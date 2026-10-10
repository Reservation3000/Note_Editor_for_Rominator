import { useState } from 'react'
import './App.css'
import { InsuranceFilled } from '@ant-design/icons';

import { DrawerStyle }from './pages/notesSetting.jsx'
import { InputeNoteValues } from './pages/noteEditor.jsx'
import { PlayButtom, TimmingControl, WhiceNoteType, LandSpaceControl} from './pages/timmingAndNoteEditor.jsx'
import { InputFiles }from './pages/baseEditor.jsx'




function App() {

  const [noteType,setNoteType] = useState('note');

  return (
    <>
    {/* ================================================================================ */}
        <div id="header">
          <InsuranceFilled style={{ fontSize:'2rem' , marginRight:'5px' }}/>
          <h1>ROMINATOR</h1>
          <h2> /   Note  Editor</h2>
          <DrawerStyle/>
        </div>

    {/* ================================================================================ */}
        <div id="main">
          <div id="viewport">

            {/*==========================================================================*/}
            {/*==========================================================================*/}
            {/*==========================================================================*/}
            <div id="containerLeft">

            {/*==========================================================================*/}
              <div id="noteEditor">
                <div id="noteEditorContainerLeft">

                </div>
                <div id="noteEditorContainerRight">
                  <InputeNoteValues noteType={noteType}/>
                </div>
              </div>

            {/*==========================================================================*/}
              <div id="timmingAndNoteEditor">
                <div className="timmingAndNoteEditor_Contanier_Top">
                  <PlayButtom/>
                  <TimmingControl/>
                </div>

                <div className="timmingAndNoteEditor_Contanier_Middle">
                  <WhiceNoteType noteType={noteType} setNoteType={setNoteType}/>
                  <LandSpaceControl/>
                </div>

                <div className="timmingAndNoteEditor_Contanier_Buttom">
                </div>
                
              </div>

            </div>


          {/*==========================================================================*/}
          {/*==========================================================================*/}
          {/*==========================================================================*/}
            <div id="containerRight">

          {/*==========================================================================*/}
              <div id="baseEditor">
                <div id="baseEditorContainerLeft">
                  <InputFiles />
                </div>
                <div id="baseEditorContainerRight">
                  
                </div>
              </div>

          {/*==========================================================================*/}
              <div id="circlePerview">
              </div>

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


