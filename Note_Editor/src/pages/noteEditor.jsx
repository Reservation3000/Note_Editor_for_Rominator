import { useState } from "react";
import { UseInputAndDescribe } from "../hook.jsx";
import { RedoOutlined , UndoOutlined , DeleteFilled , PrinterFilled} from '@ant-design/icons';
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