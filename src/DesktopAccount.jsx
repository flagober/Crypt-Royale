import {useState} from 'react';
import {GoogleAuthProvider} from 'firebase/auth';
import {googleLogin,friendlyError} from './cloud.js';
import './account.css';
export function desktopCallback(value){try{const url=new URL(value);return url.protocol==='http:'&&url.hostname==='127.0.0.1'&&Number(url.port)>1024&&url.pathname==='/callback'&&/^[\w-]{43}$/.test(url.searchParams.get('state')||'')?url:null;}catch{return null;}}
export function DesktopAccount({callback}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const login=async()=>{if(busy)return;setBusy(true);try{const result=await googleLogin();const credential=GoogleAuthProvider.credentialFromResult(result)?.idToken;if(!credential)throw Error('Login incompleto.');const target=new URL(callback);target.hash=new URLSearchParams({credential}).toString();window.location.replace(target.href);}catch(e){setMessage(friendlyError(e));setBusy(false);}};
 return <main className="cr-account-backdrop"><section className="cr-account-panel"><header><div><small>CRYPT ROYALE · WINDOWS</small><h2>Entre com segurança.</h2></div></header><p>O Google abre no seu navegador. Depois do login, você retorna ao Crypt Royale no computador.</p><button className="cr-google" disabled={busy} onClick={login}>Continuar com Google</button>{message&&<p role="status">{message}</p>}<p className="cr-account-note">Não compartilhe o endereço desta tela. Sua senha é digitada somente no Google.</p></section></main>;
}
