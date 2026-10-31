// Cosmetic only: no writes to units, shields, rewards or match state.
export function drawVipEntry(ctx,game){
 if(game.mode==='pvp'||game.vipTier!==3||game.nowMs<0||game.nowMs>=1800)return;
 const core=game.towers.find(t=>t.team==='player'&&t.type==='core');if(!core)return;
 const phase=game.nowMs/1800,fade=Math.sin(Math.PI*phase),radius=25+phase*45;
 ctx.save();ctx.globalAlpha=fade*.8;ctx.strokeStyle='#f9d675';ctx.lineWidth=2;
 ctx.beginPath();ctx.ellipse(core.x,core.y-12,radius,radius*.38,0,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle='#ffeab2';for(let i=0;i<12;i++){const angle=i*Math.PI/6+phase,dist=28+phase*32;ctx.beginPath();ctx.arc(core.x+Math.cos(angle)*dist,core.y-12+Math.sin(angle)*dist*.4-phase*20,1.5,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
