import './mct.css';
import './shop.css';
import {usePlayer} from './AccountPanel.jsx';
import {MCT_MILESTONES,loyaltyView} from './loyalty.js';
const coin='/assets/rewards/mct-credit-coin-v001.png';
export function MctIcon({className=''}){
 return <span className={'mct-icon '+className} aria-hidden="true"><img src={coin} alt="" width="128" height="128"/></span>;
}
function useCredits(){const p=usePlayer();return {player:p,balance:p?.loyaltyStatus==='ready'?(p.loyalty?.balance||0):null};}
export function MctCard({onOpen}){
 const {balance}=useCredits();
 return <button type="button" className="mct-card" onClick={onOpen} aria-label="Créditos internos MCT · Ver saldo"><MctIcon/><span className="mct-card__text"><strong>Créditos MCT</strong><span className="mct-card__balance">{balance===null?'—':balance.toLocaleString('pt-BR')}</span><small>Internos · sem saque</small></span></button>;
}
export function LoyaltyMilestones({sequence=0}){
 return <div className="loyalty-milestones">{MCT_MILESTONES.map(m=>{
  const reached=sequence>=m.day;
  return <div key={m.day} className={'loyalty-reward loyalty-reward--'+m.day+(reached?' received':'')}><small className="loyalty-reward-day">Dia {m.day}</small><MctIcon className="mct-icon--reward"/><strong>+{m.amount} MCT</strong><small className="loyalty-reward-status">{reached?'✓ Marco alcançado':'Continue a sequência'}</small></div>;
 })}</div>;
}
export function LoyaltyPanel({now=Date.now()}){
 const {player,balance}=useCredits(),v=loyaltyView(player?.loyalty,now);
 return <section className="loyalty-panel" aria-label="Bônus de presença MCT"><div className="loyalty-heading"><MctIcon/><div><small>CRÉDITOS MCT · PRESENÇA</small><h3>Sua presença vale bônus</h3></div></div><p>{v.sequence} de 30 dias consecutivos · {balance===null?'Saldo indisponível':`${balance} créditos MCT internos`}</p><LoyaltyMilestones sequence={v.sequence}/><p>Uma confirmação por dia, no horário de Brasília. Faltar um dia reinicia a sequência dos créditos; o saldo recebido fica guardado. Depois do dia 30 começa um novo ciclo. Gold e materiais seguem seu próprio calendário.</p>{!player?.uid?<p>Entre na conta para começar a sequência de créditos.</p>:player.loyaltyStatus==='error'?<p role="status">Não foi possível consultar os créditos. Sincronize e tente novamente; seu saldo foi preservado.</p>:<p>Créditos pessoais do jogo, sem valor financeiro, saque, transferência ou promessa de conversão futura.</p>}</section>;
}
export function MctInfo(){const {balance}=useCredits();return <section className="mct-info" aria-labelledby="mct-title"><div className="mct-info__hero"><MctIcon/><div><p className="mct-info__tag">Vila Byte · presença contínua</p><h3 id="mct-title">Créditos internos MCT</h3></div></div><div className="mct-info__balance"><span>Créditos registrados na conta</span><strong>{balance===null?'—':balance.toLocaleString('pt-BR')} MCT</strong><small>Registro interno separado da carteira blockchain.</small></div><LoyaltyPanel/><p>MetaMask, Phantom e outras carteiras externas ficam para uma atualização futura. Estes créditos não são saldo on-chain, não podem ser vendidos ou transferidos e não garantem conversão em tokens reais.</p><p>Gold, XP, cartas e Fragmentos de Dados continuam sendo recursos separados.</p></section>;}
