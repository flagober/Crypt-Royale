import {useEffect,useRef,useState} from 'react';
import {MAPS,mapById} from './game/maps.js';
import './maps.css';
export function MapChooser({current,onApply,onClose}){
 const [selected,setSelected]=useState(current),ref=useRef(null),closeRef=useRef(onClose);
 closeRef.current=onClose;
 useEffect(()=>{const previous=document.activeElement,dialog=ref.current;dialog.querySelector('button')?.focus();
  const trap=e=>{if(e.key==='Escape'){e.stopPropagation();closeRef.current();return;}if(e.key!=='Tab')return;const all=[...dialog.querySelectorAll('button:not(:disabled)')],first=all[0],last=all.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  };dialog.addEventListener('keydown',trap);return()=>{dialog.removeEventListener('keydown',trap);if(previous?.isConnected)previous.focus();};
 },[]);
 return <div className="map-overlay" role="dialog" aria-modal="true" aria-labelledby="map-title" ref={ref}>
  <div className="map-shell"><header><div><p className="map-eyebrow">Vila Byte · Arenas de treino</p><h2 id="map-title">Escolha seu cenário</h2><p>Três mapas iniciais para testar. A troca preserva a partida, as rotas e os atributos.</p></div><button type="button" className="map-close" onClick={onClose} aria-label="Fechar mapas">×</button></header>
   <div className="map-grid">{MAPS.map(map=><button type="button" key={map.id} aria-pressed={selected===map.id} onClick={()=>setSelected(map.id)} className="map-choice" style={{'--map-accent':map.accent}}><img src={map.file} alt="" width="360" height="560"/><span className="map-choice-text"><small>Fase {map.phase}</small><strong>{map.name}</strong><span>{map.description}</span></span></button>)}</div>
   <footer><p>Selecionado: <strong>{mapById(selected).name}</strong></p><button type="button" className="map-apply" onClick={()=>onApply(selected)}>Usar este mapa</button></footer>
  </div>
 </div>;
}
