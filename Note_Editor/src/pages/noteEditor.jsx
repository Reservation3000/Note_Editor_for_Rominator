import { useState } from "react";
import { UseInputAndDescribe } from "../hook.jsx";
import { RedoOutlined , UndoOutlined , DeleteFilled , PrinterFilled ,
         TrademarkCircleFilled , ReloadOutlined , PieChartFilled 
} from '@ant-design/icons';
import { Divider , Select , message } from 'antd';

// 輸入音符值的輸入框組合================================================
export const InputeNoteValues = ({ noteType }) =>{

  const[rotateType , setRotateType]=useState(null);

    const handleChange = (value) => {
        setRotateType(value);
    };

    return(
        <div className="inputeNoteValueContainer">
          
          <Divider style={{ borderColor:'#ffffff', fontSize: "25px" , color: "#ffffff"}}>
            {noteType}
          </Divider>

          {noteType === 'note' && (
            <>
              <UseInputAndDescribe describe="time" />
              <UseInputAndDescribe describe="land" />
            </>
          )}
          {noteType === 'darg' && (
            <>
              <UseInputAndDescribe describe="starTime" />
              <UseInputAndDescribe describe="endTime" />
              <UseInputAndDescribe describe="startLand" />
              <UseInputAndDescribe describe="endLand" />

              <div className="inputeNoteValue_RotateType">
                <Select
                    className="rotateSelect"
                    defaultValue="CW"
                    onChange={handleChange}
                    options={[
                      { value: 'CW', label: 'CW' },
                      { value: 'ACW', label: 'ACW' },
                    ]}
                />
                {rotateType === "CW" ? (
                  <RedoOutlined className="icon_redoOutlined" style={{ color: "#ff0000" }} />
                ) : (
                  <UndoOutlined className="icon_undoOutlined" style={{ color: "#008cff" }} />
                )}

              </div>
            </>
          )}
          {noteType === 'rotate' && (
            <>
              <UseInputAndDescribe describe="time" />
              <div className="inputeNoteValue_RotateType">
                <Select
                    className="rotateSelect"
                    defaultValue="CW"
                    onChange={handleChange}
                    options={[
                      { value: 'CW', label: 'CW' },
                      { value: 'ACW', label: 'ACW' },
                    ]}
                />
                {rotateType === "CW" ? (
                  <RedoOutlined className="icon_redoOutlined" style={{ color: "#ff0000" }} />
                ) : (
                  <UndoOutlined className="icon_undoOutlined" style={{ color: "#008cff" }} />
                )}

              </div>
            </>
          )}

          <div className="addOrDelete">
            <PrinterFilled className="icon_addNote"/>
            <span className="addOrDeleteDivider" aria-hidden="true" />
            <DeleteFilled className="icon_deleteNote"/>
          </div>
        </div>
    );
}


const showNot = {
  drag: <PieChartFilled style={{ color: 'rgb(90, 208, 208)' }} />,
  note: <TrademarkCircleFilled style={{ color: 'rgb(170, 215, 56)' }} />,
  rotate: <ReloadOutlined style={{ color: 'rgb(255, 255, 255)' }} />,
};

// 條列式顯示所有音符資料。
export const NotesList = ({ csvData }) => {
  return (
    <div className={`notesList${!csvData?.length ? ' notesListEmpty' : ''}`}>

      {!csvData?.length ? (
        <p>no Data. <br /> Please input csv data.</p>
      ) : (csvData.map((row, index) => (

          <div className="notesListRow" key={`${row.type}-${index}`}>
            {showNot[row.type]}

            <div className="notesListText">
              {row.type === 'drag'
                ? `${row.timeStart}, ${row.timeEnd}, ${row.landStart}, ${row.landEnd}`
                : `${row.time}${row.land !== undefined ? `, ${row.land}` : ''}`
              }
              {row.direction !== undefined && `, ${row.direction}`}
            </div>     
            
          </div>
        ))
      )}
    </div>
  );
};