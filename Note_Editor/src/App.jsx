import { useState } from 'react'
import './App.css'
import { InsuranceFilled } from '@ant-design/icons';
import { Divider } from 'antd';

import { DrawerStyle }from './pages/notesSetting.jsx'
import { InputeNoteValues , NotesList } from './pages/noteEditor.jsx'
import { PlayButtom, TimmingControl, WhiceNoteType, LandSpaceControl} from './pages/timmingAndNoteEditor.jsx'
import { InputFiles, InputMusic , BaseEditor_Divider, InputBaseSetting, InputBaseSetting_noteValue, NoteSpeedControl}from './pages/baseEditor.jsx'




function App() {

  const [noteType,setNoteType] = useState('note');
  const [csvData,setCsvData] = useState([]);
  const [startLand,setStartLand] = useState(0);
  const [chartOffest,setChartOffest] = useState(0);
  const [speed , setSpeed] = useState(0.06);
  const [beat , setBeat] = useState(4);

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
                  <NotesList csvData={csvData}/>
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
                  <InputFiles setCsvData={setCsvData}
                              setStartLand={setStartLand}
                              setChartOffest={setChartOffest}
                  /> 
                  <InputMusic setCsvData={setCsvData}
                              setStartLand={setStartLand}
                              setChartOffest={setChartOffest}
                  />
                  <p>In put your files.</p>
                </div>

                <div id="baseEditorContainerDivider">
                  <BaseEditor_Divider/>
                </div>

                <div id="baseEditorContainerMiddle">
                  <InputBaseSetting chartOffest={chartOffest} 
                                    startLand={startLand} 
                                    beat={beat}
                                    setChartOffest={setChartOffest} 
                                    setStartLand={setStartLand} 
                                    setBeat={setBeat}/>
                </div>

                <div id="baseEditorContainerRight">
                  <InputBaseSetting_noteValue/>
                  <NoteSpeedControl setSpeed={setSpeed} speed={speed}/>
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


