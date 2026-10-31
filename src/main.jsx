import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {DesktopAccount,desktopCallback} from './DesktopAccount.jsx'

const callback=desktopCallback(new URLSearchParams(window.location.search).get('desktop'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {callback?<DesktopAccount callback={callback}/>:<App />}
  </React.StrictMode>,
)
