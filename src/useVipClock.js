import {useEffect,useState} from 'react';
import {vipOnlineClock} from './vip-clock.js';
export function useVipClock(){
 const[now,setNow]=useState(()=>vipOnlineClock.now());
 useEffect(()=>{let active=true;const refresh=()=>{if(document.visibilityState==='hidden')return;vipOnlineClock.sync().then(()=>{if(active)setNow(vipOnlineClock.now());}).catch(()=>{if(active)setNow(vipOnlineClock.now());});};refresh();const resync=setInterval(refresh,60000),tick=setInterval(()=>setNow(vipOnlineClock.now()),1000);window.addEventListener('online',refresh);document.addEventListener('visibilitychange',refresh);return()=>{active=false;clearInterval(resync);clearInterval(tick);window.removeEventListener('online',refresh);document.removeEventListener('visibilitychange',refresh);};},[]);
 return now;
}
