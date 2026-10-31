const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('cryptDesktop',Object.freeze({googleSignIn:()=>ipcRenderer.invoke('crypt:google')}));
