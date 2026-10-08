import { useState } from 'react'
import './App.css'


import {
    DrawerStyle,
}from './pages/drawerSetting.jsx'

import {
    PlayButtom,
    TimmingControl
} from './pages/timmingAndNoteEditor.jsx'

function App() {

  return (
    <>
    {/* ================================================================================ */}
        <div id="header">
          <h1>ROMINATOR</h1>
          <h2> /   Note  Editor</h2>
          <DrawerStyle/>
        </div>

    {/* ================================================================================ */}
        <div id="main">
        
          
          <div id="containerLeft">

            <div id="noteEditor">
            </div>

            <div id="timmingAndNoteEditor">
              <div className="timmingAndNoteEditor_Contanier_Top">
                <PlayButtom/>
                <TimmingControl/>
              </div>

              <div className="timmingAndNoteEditor_Contanier_Middle">
              </div>

              <div className="timmingAndNoteEditor_Contanier_Buttom">
              </div>
              
            </div>

          </div>

          <div id="containerRight">

            <div id="circlePerview">
            </div>

            <div id="baseEditor">
            </div>
            
          </div>

        </div>

    {/* ================================================================================ */}
        <div id="footer">
          Copyright © 2026 Reservation All Rights Reserved.
        </div>
    </>
  )
}

export default App


