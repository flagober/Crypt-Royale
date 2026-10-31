// Older public numbering cycles remain visible after a public-number restart.
export function releaseNoteVisible(note,current){
 const cycle=note.cicloVersao||1,active=current.cicloVersao||1;
 if(cycle!==active)return cycle<active;
 const a=note.versao.split('.').map(Number),b=current.versao.split('.').map(Number);
 return a[0]<b[0]||(a[0]===b[0]&&a[1]<=b[1]);
}
