import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { createNoteData } from './noteEditorModel.js';

const NoteEditorContext = createContext(null);

const initialState = {
  notes: [],
  selectedIndex: null,
  noteType: 'note',
};

const noteEditorReducer = (state, action) => {
  switch (action.type) {
    case 'replace-notes':
      return { ...state, notes: action.notes, selectedIndex: null };
    case 'set-note-type':
      return { ...state, noteType: action.noteType };
    case 'select-note': {
      const note = state.notes[action.index];
      return note
        ? { ...state, selectedIndex: action.index, noteType: note.type }
        : state;
    }
    case 'create-note': {
      const notes = [...state.notes, action.note];
      return { ...state, notes, selectedIndex: notes.length - 1, noteType: action.note.type };
    }
    case 'update-note': {
      if (!Number.isInteger(action.index) || !state.notes[action.index]) return state;
      const notes = state.notes.map((note, index) => (
        index === action.index ? { ...note, ...action.updates } : note
      ));
      return { ...state, notes };
    }
    case 'update-selected-note': {
      if (state.selectedIndex === null) return state;
      const notes = state.notes.map((note, index) => (
        index === state.selectedIndex ? { ...note, ...action.updates } : note
      ));
      return { ...state, notes };
    }
    case 'delete-note': {
      if (!Number.isInteger(action.index) || !state.notes[action.index]) return state;
      const selectedIndex = state.selectedIndex === action.index
        ? null
        : state.selectedIndex > action.index ? state.selectedIndex - 1 : state.selectedIndex;
      return {
        ...state,
        notes: state.notes.filter((_, index) => index !== action.index),
        selectedIndex,
      };
    }
    default:
      return state;
  }
};

export const NoteEditorProvider = ({ value, children }) => (
  <NoteEditorContext.Provider value={value}>{children}</NoteEditorContext.Provider>
);

export const useNoteEditor = () => {
  const context = useContext(NoteEditorContext);
  if (!context) throw new Error('useNoteEditor must be used inside NoteEditorProvider');
  return context;
};

export const useNoteEditorController = (config) => {
  const [state, dispatch] = useReducer(noteEditorReducer, initialState);

  const replaceNotes = useCallback((notes) => {
    dispatch({ type: 'replace-notes', notes: Array.isArray(notes) ? notes : [] });
  }, []);
  const setNoteType = useCallback((noteType) => {
    dispatch({ type: 'set-note-type', noteType });
  }, []);
  const selectNote = useCallback((index) => {
    dispatch({ type: 'select-note', index });
  }, []);
  const createNote = useCallback(({ noteType, time, land }) => {
    dispatch({ type: 'create-note', note: createNoteData(noteType, time, land, config) });
  }, [config]);
  const updateNote = useCallback((index, updates) => {
    dispatch({ type: 'update-note', index, updates });
  }, []);
  const applySelectedNote = useCallback((updates) => {
    dispatch({ type: 'update-selected-note', updates });
  }, []);
  const deleteSelectedNote = useCallback(() => {
    dispatch({ type: 'delete-note', index: state.selectedIndex });
  }, [state.selectedIndex]);

  useEffect(() => {
    if (state.selectedIndex === null) return undefined;

    const handleKeyDown = (event) => {
      const target = event.target;
      const editingText = target instanceof HTMLElement
        && target.closest('input, textarea, select, [contenteditable="true"]');
      if (event.key === 'Delete' && !editingText) {
        dispatch({ type: 'delete-note', index: state.selectedIndex });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedIndex]);

  const selectedNote = state.selectedIndex === null ? null : state.notes[state.selectedIndex] ?? null;

  return useMemo(() => ({
    ...state,
    selectedNote,
    config,
    replaceNotes,
    setNoteType,
    selectNote,
    createNote,
    updateNote,
    applySelectedNote,
    deleteSelectedNote,
  }), [
    state,
    selectedNote,
    config,
    replaceNotes,
    setNoteType,
    selectNote,
    createNote,
    updateNote,
    applySelectedNote,
    deleteSelectedNote,
  ]);
};
