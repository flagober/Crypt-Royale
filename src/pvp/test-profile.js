import {createProgress} from '../game/activities.js';
export function eligibleProfile(now=Date.now()){
 const p=createProgress(now);p.wallet.xp=2100;
 for(let i=1;i<=3;i++)p.progression.campaign.completed['stage-'+i]={stars:1,at:new Date(now).toISOString()};return p;
}
