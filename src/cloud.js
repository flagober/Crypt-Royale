import {initializeApp} from 'firebase/app';
import {getAuth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signInWithCredential,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,signOut,updateProfile,sendEmailVerification} from 'firebase/auth';
import {initializeFirestore,doc,getDocFromServer,runTransaction,serverTimestamp,deleteDoc,collection,query,orderBy,limit,onSnapshot} from 'firebase/firestore';
import {applyGift} from './mailbox.js';
import{WELCOME_ID,welcomeGift}from'./welcome-gift.js';
import{advanceLoyalty,loyaltyDay,validateLoyalty}from'./loyalty.js';
import{claimActivity,dayKey}from'./game/activities.js';
import {Capacitor} from '@capacitor/core';
import config from './firebase-config.json';
import {confirmedVipTime} from './vip-clock.js';
import {prepareVipCommit} from './vip-transaction.js';

const app=initializeApp(config,'crypt-royale');
export const auth=getAuth(app);
const db=initializeFirestore(app,{experimentalAutoDetectLongPolling:true});
const reference=uid=>doc(db,'cryptroyale_saves',uid);
export const cloudSaves={
 async purchaseVip(uid,expected,tier,id){
  const now=await confirmedVipTime();
  return runTransaction(db,async tx=>{const ref=reference(uid),saved=await tx.get(ref);const next=prepareVipCommit(saved.exists()?saved.data():null,uid,expected,tier,id,now);if(next.changed)tx.update(ref,{revision:next.revision,profileJson:JSON.stringify(next.profile),updatedAt:serverTimestamp()});return {revision:next.revision,profile:next.profile};});
 },
 async claimCheckin(uid,expected){return runTransaction(db,async tx=>{
  const saveRef=reference(uid),ledgerRef=doc(db,'cryptroyale_loyalty',uid),saved=await tx.get(saveRef),record=await tx.get(ledgerRef);
  if(!saved.exists())throw Error('Salve sua jornada antes do check-in.');const s=saved.data();if(s.revision!==expected){const e=Error('Save atualizado em outro aparelho');e.code='save-conflict';throw e;}
  const now=Date.now(),original=JSON.parse(s.profileJson),old=record.exists()?validateLoyalty(record.data()):null;
  if(old?.lastDay===loyaltyDay(now)&&original.checkin.lastDay===dayKey(now))return {revision:s.revision,profile:original};
  const profile=original.checkin.lastDay===dayKey(now)?original:claimActivity(original,'checkin',null,now),ledger=advanceLoyalty(old,uid,now),revision=s.revision+1;
  tx.update(saveRef,{revision,profileJson:JSON.stringify(profile),updatedAt:serverTimestamp()});
  tx.set(ledgerRef,{...ledger,updatedAt:serverTimestamp()});return {revision,profile};
 });},
 async claimMail(uid,expected,id){return runTransaction(db,async tx=>{
  const saveRef=reference(uid),mailRef=doc(db,'cryptroyale_mailboxes',uid,'messages',id);
  const saved=await tx.get(saveRef),mail=await tx.get(mailRef);
  if(!saved.exists()||!mail.exists()||mail.data().owner!==uid)throw Error('Brinde não encontrado para esta conta.');
  const s=saved.data();
  if(s.revision!==expected){const e=Error('Save atualizado em outro aparelho');e.code='save-conflict';throw e;}
  const original=JSON.parse(s.profileJson);
  if(mail.data().claimedAt)return {revision:s.revision,profile:original};
  const profile=applyGift(original,id,mail.data().reward),revision=s.revision+1;
  tx.update(saveRef,{revision,profileJson:JSON.stringify(profile),updatedAt:serverTimestamp()});
  tx.update(mailRef,{claimedAt:serverTimestamp(),...(mail.data().readAt?{}:{readAt:serverTimestamp()})});
  return {revision,profile};
 });},
 async remove(uid){await deleteDoc(reference(uid));},
 async read(uid){const s=await getDocFromServer(reference(uid));if(!s.exists())return null;const d=s.data();return {revision:d.revision,profile:JSON.parse(d.profileJson)};},
 async commit(uid,expected,profile){return runTransaction(db,async tx=>{
  const ref=reference(uid),s=await tx.get(ref),revision=s.exists()?s.data().revision:0;
  const welcomeRef=doc(db,'cryptroyale_mailboxes',uid,'messages',WELCOME_ID),welcome=!s.exists()?await tx.get(welcomeRef):null;
  if(revision!==expected){const e=Error('Save atualizado em outro aparelho');e.code='save-conflict';throw e;}
  const next=revision+1;tx.set(ref,{owner:uid,schema:1,revision:next,profileJson:JSON.stringify(profile),updatedAt:serverTimestamp()});if(welcome&&!welcome.exists())tx.set(welcomeRef,welcomeGift(uid,serverTimestamp()));return next;
 });}
};
export const watchMail=(uid,onMail,onError)=>onSnapshot(query(collection(db,'cryptroyale_mailboxes',uid,'messages'),orderBy('createdAt','desc'),limit(50)),s=>onMail(s.docs.map(d=>{const m=d.data();return {id:d.id,...m,createdAt:m.createdAt?.toDate?.().toISOString()||m.createdAt};})),onError);
export const watchLoyalty=(uid,onValue,onError)=>onSnapshot(doc(db,'cryptroyale_loyalty',uid),s=>onValue(s.exists()?validateLoyalty(s.data()):null),onError);
export const watchAccount=fn=>onAuthStateChanged(auth,fn);
export async function googleLogin(){
 let idToken;
 if(Capacitor.isNativePlatform()){
  const {FirebaseAuthentication}=await import('@capacitor-firebase/authentication');
  const r=await FirebaseAuthentication.signInWithGoogle({skipNativeAuth:true});idToken=r.credential?.idToken;
 }else if(window.cryptDesktop){idToken=await window.cryptDesktop.googleSignIn();}
 else {const p=new GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return signInWithPopup(auth,p);}
 if(!idToken)throw Error('O Google não concluiu o login. Tente novamente.');
 return signInWithCredential(auth,GoogleAuthProvider.credential(idToken));
}
export async function emailLogin(email,password,name){
 if(name){const r=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(r.user,{displayName:name.trim()});await sendEmailVerification(r.user);return r;}
 return signInWithEmailAndPassword(auth,email,password);
}
export const recoverPassword=email=>sendPasswordResetEmail(auth,email);
export const logout=()=>signOut(auth);
export function friendlyError(e){
 const msg = (e?.message || '').toLowerCase();
 if (e?.code === 'resource-exhausted' || msg.includes('quota') || msg.includes('resource-exhausted')) {
  return 'Cota diária da nuvem atingida. Seu progresso local continua 100% seguro neste aparelho.';
 }
 const errors={'auth/invalid-credential':'Confira e-mail e senha.','auth/email-already-in-use':'Este e-mail já tem cadastro. Entre ou recupere sua senha.','auth/weak-password':'Escolha uma senha mais forte.','auth/invalid-email':'Digite um e-mail válido.','auth/popup-closed-by-user':'Login cancelado.','auth/popup-blocked':'Permita a janela do Google e tente novamente.','auth/unauthorized-domain':'Este endereço ainda precisa ser autorizado no Firebase. Use o endereço oficial do jogo.','auth/network-request-failed':'Sem conexão. Seu save local foi preservado.','auth/too-many-requests':'Muitas tentativas. Aguarde um pouco.','permission-denied':'A conta não tem acesso a este save.'};
 return errors[e?.code]||'Não foi possível concluir. '+(e?.message||'Tente novamente.');
}
