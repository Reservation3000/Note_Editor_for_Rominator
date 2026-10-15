import { useEffect, useState } from 'react';
import { UseInputAndDescribe } from '../hook.jsx';
import {
  RedoOutlined,
  UndoOutlined,
  DeleteFilled,
  PrinterFilled,
  TrademarkCircleFilled,
  ReloadOutlined,
  PieChartFilled,
} from '@ant-design/icons';
import { Divider, Select } from 'antd';
import { useNoteEditor } from './noteEditorState.jsx';
import { createNoteUpdates, getNoteFormValues, getNoteTime } from './noteEditorModel.js';

const DirectionInput = ({ value, onChange }) => (
  <div className="inputeNoteValue_RotateType">
    <Select
      className="rotateSelect"
      value={value ?? 0}
      onChange={onChange}
      options={[
        { value: 1, label: '1' },
        { value: 0, label: '0' },
      ]}
    />
    {value === 1 ? (
      <UndoOutlined className="icon_redoOutlined" style={{ color: '#008cff' }} />
    ) : (
      <RedoOutlined className="icon_undoOutlined" style={{ color: '#ff0000' }} />
    )}
  </div>
);

// Properties for the selected note are edited locally and committed as one update.
export const InputeNoteValues = () => {
  const { noteType, selectedNote, applySelectedNote, deleteSelectedNote } = useNoteEditor();
  const displayType = selectedNote?.type ?? noteType;
  const [fieldValues, setFieldValues] = useState(() => getNoteFormValues(selectedNote));

  useEffect(() => {
    setFieldValues(getNoteFormValues(selectedNote));
  }, [selectedNote]);

  const setFieldValue = (field) => (value) => {
    setFieldValues((currentValues) => ({
      ...currentValues,
      [field]: value === null ? null : Math.round(Number(value)),
    }));
  };

  const applyChanges = () => {
    if (selectedNote) applySelectedNote(createNoteUpdates(selectedNote, fieldValues));
  };

  return (
    <div className="inputeNoteValueContainer">
      <Divider style={{ borderColor: '#ffffff', fontSize: '25px', color: '#ffffff' }}>
        {displayType}
      </Divider>

      {displayType === 'note' && (
        <>
          <UseInputAndDescribe describe="time" inputValue={fieldValues.time ?? 0} setValue={setFieldValue('time')} precision={0} />
          <UseInputAndDescribe describe="land" inputValue={fieldValues.land ?? 0} setValue={setFieldValue('land')} precision={0} />
        </>
      )}

      {displayType === 'drag' && (
        <>
          <UseInputAndDescribe describe="startTime" inputValue={fieldValues.startTime ?? 0} setValue={setFieldValue('startTime')} precision={0} />
          <UseInputAndDescribe describe="endTime" inputValue={fieldValues.endTime ?? 0} setValue={setFieldValue('endTime')} precision={0} />
          <UseInputAndDescribe describe="startLand" inputValue={fieldValues.startLand ?? 0} setValue={setFieldValue('startLand')} precision={0} />
          <UseInputAndDescribe describe="endLand" inputValue={fieldValues.endLand ?? 0} setValue={setFieldValue('endLand')} precision={0} />
          <DirectionInput value={fieldValues.direction} onChange={setFieldValue('direction')} />
        </>
      )}

      {displayType === 'rotate' && (
        <>
          <UseInputAndDescribe describe="time" inputValue={fieldValues.time ?? 0} setValue={setFieldValue('time')} precision={0} />
          <DirectionInput value={fieldValues.direction} onChange={setFieldValue('direction')} />
        </>
      )}

      <div className="addOrDelete">
        <button
          type="button"
          className="noteActionButton"
          aria-label="套用音符編輯"
          title="套用編輯"
          disabled={!selectedNote}
          onClick={applyChanges}
        >
          <PrinterFilled className="icon_addNote" />
        </button>
        <span className="addOrDeleteDivider" aria-hidden="true" />
        <button
          type="button"
          className="noteActionButton"
          aria-label="刪除音符"
          title="刪除音符"
          disabled={!selectedNote}
          onClick={deleteSelectedNote}
        >
          <DeleteFilled className="icon_deleteNote" />
        </button>
      </div>
    </div>
  );
};

const NOTE_ICONS = {
  drag: <PieChartFilled style={{ color: 'rgb(90, 208, 208)' }} />,
  note: <TrademarkCircleFilled style={{ color: 'rgb(170, 215, 56)' }} />,
  rotate: <ReloadOutlined style={{ color: 'rgb(255, 255, 255)' }} />,
};

const formatNote = (note) => {
  const values = note.type === 'drag'
    ? [note.timeStart, note.timeEnd, note.landStart, note.landEnd]
    : [note.time, ...(note.land === undefined ? [] : [note.land])];
  if (note.direction !== undefined) values.push(note.direction);
  return values.map((value) => Math.round(value)).join(', ');
};

// The list is sorted for reading, while each row keeps its original editor index.
export const NotesList = () => {
  const { notes, selectedIndex, selectNote } = useNoteEditor();
  const sortedNotes = notes
    .map((note, index) => ({ note, index }))
    .sort((first, second) => getNoteTime(first.note) - getNoteTime(second.note) || first.index - second.index);

  return (
    <div className={`notesList${!notes.length ? ' notesListEmpty' : ''}`}>
      {!notes.length ? (
        <p>no Data. <br /> Please input csv data.</p>
      ) : sortedNotes.map(({ note, index }) => (
        <button
          type="button"
          className={selectedIndex === index ? 'notesListRow notesListRowSelected' : 'notesListRow'}
          key={`${note.type}-${index}`}
          onClick={() => selectNote(index)}
        >
          {NOTE_ICONS[note.type]}
          <span className="notesListText">{formatNote(note)}</span>
        </button>
      ))}
    </div>
  );
};
