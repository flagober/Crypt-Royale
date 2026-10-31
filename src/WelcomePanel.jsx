import {useState} from 'react';
import {Shield,Swords,Layers,ChevronRight,X} from 'lucide-react';
import './welcome.css';
export function WelcomePanel({ready,authenticated=false,onClose,onAccount,onCampaign}){
 const [step,setStep]=useState(0);
 const guide=[{title:'Bem-vindo a Vila Byte!',text:'Sou seu guardião. Monte sua estratégia, proteja suas torres e faça sua coleção crescer.'},{title:'As cartas são suas tropas.',text:'Escolha uma carta disponível e toque na metade azul da arena para posicioná-la. Cada carta gasta energia, que se recupera durante a batalha.'},{title:'Proteja seu Bastião.',text:'Derrube as torres rivais e defenda as suas. O treino contra IA dura até 3 minutos; a campanha traz desafios e recompensas próprios.'},{title:'Sua jornada começa aqui.',text:'Ganhe cartas repetidas e Gold para melhorar suas criaturas. Entre na sua conta para salvar essa jornada e continuar em outro aparelho.'}][step];
 return <div className="cr-welcome" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><section>
  <button className="cr-welcome-skip" onClick={authenticated?onClose:onAccount} aria-label={authenticated?"Pular apresentação":"Entrar ou criar conta"}><X size={17}/> {authenticated?"Pular":"Entrar"}</button>
  <div className="cr-welcome-brand"><img src="/assets/branding/crypt-royale-logo-v001.png" alt="Crypt Royale" width="1536" height="1024"/><span>BETA · VILA BYTE</span></div>
  <div className="cr-welcome-scene"><div className="cr-welcome-halo"/><div className="cr-welcome-hero" role="img" aria-label="Guerreiro guardião de Vila Byte"/><div className="cr-welcome-bubble"><small>SEU GUARDIÃO DE VILA BYTE</small><h2 id="welcome-title">{guide.title}</h2><p>{guide.text}</p></div></div>
  <div className="cr-welcome-dots" aria-label={`Passo ${step+1} de 4`}>{[0,1,2,3].map(i=><i key={i} className={i<=step?'active':''}/>)}</div>
  {step<3?<button className="cr-welcome-primary" onClick={()=>setStep(step+1)}>Vamos nessa <ChevronRight size={18}/></button>:<div className={"cr-welcome-options"+(!authenticated?" cr-welcome-options--guest":"")}>{!authenticated?<><button type="button" className="cr-welcome-primary" onClick={onAccount}><Shield size={18}/> Entrar ou criar conta</button><p className="cr-welcome-account-hint">Entre para salvar sua jornada e continuar em outro aparelho.</p></>:<><button type="button" className="cr-welcome-primary" disabled={!ready} onClick={onCampaign}><Swords size={18}/> Começar a campanha</button><button type="button" onClick={onClose}><Layers size={17}/> Conhecer o treino livre</button></>}</div>}
  <p className="cr-welcome-foot">Campanha contra IA e treino disponíveis. Arenas competitivas e ligas ainda estão em desenvolvimento.</p>
 </section></div>;
}
