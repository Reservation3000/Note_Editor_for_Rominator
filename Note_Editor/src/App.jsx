import { useMemo, useState } from 'react'
import './App.css'
import { InsuranceFilled , DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { DrawerStyle }from './pages/setting.jsx'
import { InputeNoteValues , NotesList } from './pages/noteEditor.jsx'
import { PlayButton, TimmingControl, TimmingMsShow, WhiceNoteType, LandSpaceControl } from './pages/timmingAndNoteEditor.jsx'
import { InputFiles, InputMusic , BaseEditor_Divider, InputBaseSetting, InputBaseSetting_noteValue, NoteSpeedControl}from './pages/baseEditor.jsx'
import { Editor } from './pages/editorCanvas.jsx'
import { handleDownloadChart } from './pages/header.jsx'
import { CirclePreview } from './pages/circlePreview.jsx'
import { NoteEditorProvider, useNoteEditorController } from './pages/noteEditorState.jsx'

import { Editor as RhythmEditor } from './pages/editor/rhythm_Line_Drawing.jsx'


function App() {

  const [musicUrl , setMusicUrl] = useState('');
  const [musicDuration, setMusicDuration] = useState(0);
  const [stop,setStop] = useState(true);
  const [startLand,setStartLand] = useState(0);
  const [chartOffest,setChartOffest] = useState(0);
  const [speed , setSpeed] = useState(0.06);
  const [beat , setBeat] = useState(4);
  const [signature  , setSignature] = useState(4);
  const [bpm , setBpm] = useState(120);
  const [aBeatPx , setABeatPx] = useState(70);
  const editorConfig = useMemo(() => ({
    bpm,
    beat,
    signature,
    chartOffset: chartOffest,
    musicDuration,
    pixelsPerSecond: speed,
  }), [bpm, beat, signature, chartOffest, musicDuration, speed]);
  const noteEditor = useNoteEditorController(editorConfig);


  return (
    <NoteEditorProvider value={noteEditor}>
    <>
    {/* ================================================================================ */}
        <div id="header">
          <InsuranceFilled style={{ fontSize:'2rem' , marginRight:'5px' }}/>
          <h1>ROMINATOR</h1>
          <h2> /   Note  Editor</h2>
          <Button className="OutPuteButtom" type="primary" icon={<DownloadOutlined />} size={'large'} onClick={() => handleDownloadChart({ chartOffest, startLand, csvData: noteEditor.notes })}>
            Download
          </Button>
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
                  <NotesList />
                </div>

                <div id="noteEditorContainerRight">
                  <InputeNoteValues />
                </div>
              </div>

            {/*==========================================================================*/}
              <div id="timmingAndNoteEditor">
                <div className="timmingAndNoteEditor_Contanier_Top">
                  <PlayButton setStop={setStop} stop={stop}/>
                  <TimmingControl musicDuration={musicDuration} musicUrl={musicUrl} setMusicDuration={setMusicDuration} setStop={setStop} stop={stop} />
                </div>

                <div className="timmingAndNoteEditor_Contanier_Middle">
                  <WhiceNoteType noteType={noteEditor.noteType} setNoteType={noteEditor.setNoteType}/>
                  <TimmingMsShow musicDuration={musicDuration} />
                  <LandSpaceControl setABeatPx={setABeatPx} aBeatPx={aBeatPx} />
                </div>

                <div className="timmingAndNoteEditor_Contanier_Buttom">
                  {/* <Editor /> */}
                  <RhythmEditor musicDuration={musicDuration} bpm={bpm} beat={beat} signature={signature} aBeatPx={aBeatPx}/>
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
                  <InputFiles setCsvData={noteEditor.replaceNotes}
                              setStartLand={setStartLand}
                              setChartOffest={setChartOffest}
                  /> 
                  <InputMusic setMusicUrl={setMusicUrl} setStop={setStop} stop={stop} setMusicDuration={setMusicDuration}/>
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
                                    setBeat={setBeat}
                                    setBpm={setBpm}
                                    bpm={bpm}
                  />
                </div>

                <div id="baseEditorContainerRight">
                  <InputBaseSetting_noteValue setSignature={setSignature}/>
                  <NoteSpeedControl setSpeed={setSpeed} speed={speed}/>
                </div>
              </div>

          {/*==========================================================================*/}
              <div id="circlePerview">
                {/* <CirclePreview csvData={noteEditor.notes} speed={speed} /> */}
              </div>

            </div>

          </div>
        </div>

    {/* ================================================================================ */}
        <div id="footer">
          Copyright © 2026 Reservation All Rights Reserved.
        </div>
    </>
    </NoteEditorProvider>
  )
}

export default App
