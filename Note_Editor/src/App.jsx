import { useState } from 'react'
import './App.css'

import {
    DrawerStyle
} from  './pages/components.jsx'

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


