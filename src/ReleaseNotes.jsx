import {useEffect,useRef,useState} from 'react';
import {X,History} from 'lucide-react';
import history from './data/release-history.json';
import release from '../versao.json';
import archivedNotes from '../docs/NOTAS_DAS_VERSOES.md?raw';
import {releaseNoteVisible} from './release-versions.js';
export function ReleaseNotes({onClose}){
 const ref=useRef(null),close=useRef(onClose),[full,setFull]=useState(false);close.current=onClose;
 useEffect(()=>{const previous=document.activeElement,overflow=document.body.style.overflow;document.body.style.overflow='hidden';ref.current?.focus();const key=e=>{if(e.key==='Escape')close.current();if(e.key==='Tab'){const nodes=[...ref.current.querySelectorAll('button')];if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0]?.focus();}}};document.addEventListener('keydown',key);return()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',key);previous?.focus();};},[]);
 return <div className="fixed inset-0 z-[105] grid place-items-center overflow-y-auto bg-slate-950/95 p-4"><section role="dialog" aria-modal="true" aria-labelledby="release-title" tabIndex={-1} ref={ref} className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-cyan-400/30 bg-slate-900 p-5 text-slate-100 shadow-2xl md:p-8">
  <header className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-widest text-cyan-300">CRYPT ROYALE · v{release.versao}</p><h2 id="release-title" className="mt-2 flex items-center gap-2 text-2xl font-black"><History/> Notas das versões</h2></div><button aria-label="Fechar notas das versões" className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-600" onClick={onClose}><X className="mx-auto"/></button></header>
  <p className="mb-5 text-sm leading-relaxed text-slate-400">Veja o que mudou em cada atualização. O beta oferece treino e campanha contra IA; partidas entre jogadores e ligas continuam em desenvolvimento.</p>
  {history.filter(n=>releaseNoteVisible(n,release)).map(n=><article key={`${n.cicloVersao||1}:${n.versao}`} className="mb-4 rounded-2xl border border-slate-700 bg-slate-950/50 p-5"><p className="text-xs font-bold text-cyan-300">v{n.versao} · {n.data.split('-').reverse().join('/')}{n.cicloVersao>1?` · Ciclo ${n.cicloVersao}`:''}</p><h3 className="mt-2 text-lg font-black">{n.titulo}</h3><p className="mt-2 text-sm text-slate-300">{n.resumo}</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">{n.alteracoes.map(s=><li key={s}>{s}</li>)}</ul></article>)}
  <button onClick={()=>setFull(!full)} className="min-h-[44px] rounded-xl border border-cyan-400/40 px-4 py-2 text-sm font-bold text-cyan-200">{full?'Ocultar arquivo completo':'Ver arquivo completo do histórico'}</button>{full&&<pre className="mt-5 whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 font-sans text-xs leading-relaxed text-slate-400">{archivedNotes}</pre>}
 </section></div>;
}
