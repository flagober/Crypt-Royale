import React,{useState} from 'react';import {createRoot} from 'react-dom/client';
import {ActivitiesPanelV2} from './ActivitiesPanelV2.jsx';
import {createProgress,claimActivity,activityView,dayKey} from './game/activities.js';
import './index.css';
const now=Date.now();
function Preview(){
 const [profile,setProfile]=useState(()=>{
  const p=createProgress(now);p.checkin.cursor=2;p.checkin.consecutive=2;
  p.wallet.gold=360;p.wallet.xp=120;p.wallet.dataFragments=2;
  p.daily.battles=3;p.daily.towerDamage=1200;p.daily.familyWins=1;p.daily.wins=1;
  p.weekly.missionsClaimed=9;p.weekly.wins=3;p.weekly.towerDamage=5000;p.weekly.cardsUsed=['bit-bug','data-mouse','code-slime','pixel-pup'];
  return p;
 }),[message,setMessage]=useState('Prévia visual · dados de demonstração, sem alterar seu progresso.');
 function claim(kind,id){try{setProfile(current=>claimActivity(current,kind,id,now));setMessage('Recompensa recebida na prévia.');}catch(e){setMessage(e.message);}}
 return <ActivitiesPanelV2 profile={profile} now={now} onClaim={claim} busy={false} message={message} onClose={()=>{location.href='/'}}/>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
