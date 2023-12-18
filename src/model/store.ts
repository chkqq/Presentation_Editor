import { createStore } from 'redux';
import { Editor } from "./types"
import { addActionToHistoryReducer, editorReducer } from './editor'
import { presentationReducer } from './presentation';
import { slideReducer } from './slide'
import { deepClone } from '../core/functions/deepClone';
import { uploadDoc, deleteSelected, switchLayer, copy, paste } from './actionCreators';

let initialState: Editor = {
    presentation: {
        title: "Ваша презенташка",
        slides: [
            {
                slideId: "0",
                elements: [
                ],
                background: "#FFF",
                selectedElementsIds: []
            }
        ],
        currentSlideIds: ['0']
    },
    history: {
        undoStack: [],
        redoStack: []
    },
    buffers: {
        slideBuffer: [],
        elementBuffer: []
    },
    statePreview: false
};

export type ActionType = {
    type: string,
    newTitle?: string,
    slideId?: string,
    orderShift?: number,
    background?: string,
    element?: string,
    urlImage?: string,
    elementId?: string,
    changePositionCoordinates?: {
        xShift: number,
        yShift: number
    },
    ChangeSizeArgs?: {
        newWidth: number,
        newHeight: number,
        xShift: number,
        yShift: number
    },
    ChangeTextArgs?: {
        font?: string
        textColor?: string,
        bgColor?: string,
        textValue?: string,
        fontSize?: number,
        fontWeight?: number
    },
    newWidth?: number,
    newColor?: string,
    newEditor?: Editor
}

function uploadDocFunction() {
    const inputFile = document.createElement('input')
    inputFile.type = 'file';
    inputFile.style.display = 'none';
    inputFile.accept = 'application/json';
    inputFile.onchange = () => {
        if (inputFile.files) {
            const fileEditor = inputFile.files[0];
            const reader = new FileReader();
            reader.readAsText(fileEditor);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    const newEditor = deepClone(JSON.parse(reader.result)) as Editor;
                    store.dispatch(uploadDoc(newEditor));
                }
            };
        }
    }
    inputFile.click();
    inputFile.remove();
}

function HotKeys() {
    window.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowUp' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(switchLayer(1))
        }
        if (event.code === 'ArrowDown' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(switchLayer(-1))
        }
        if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(copy())
        }
        if (event.code === 'KeyV' && (event.ctrlKey || event.metaKey)) {
            store.dispatch(paste())
        }
        if (event.code === 'Delete') {
            store.dispatch(deleteSelected())
        }
    });
}


function mainReducer(state: Editor = initialState, action: ActionType): Editor {
    const addInHistory: boolean = (action.type !== 'SAVE_DOCUMENT')
                                && (action.type !== 'EXPORT_DOCUMENT')
                                && (action.type !== 'SWITCH_PREVIEW')
                                && (action.type !== 'UPLOAD_DOCUMENT')
                                && (action.type !== 'SWITCH_PREVIEW')
    const indexCurrentSlide: number = state.presentation.slides.findIndex(slide => slide.slideId === state.presentation.currentSlideIds[0]);
    const newState: Editor = editorReducer(state, action);
    if (addInHistory) {newState.history = addActionToHistoryReducer(state)}
    newState.presentation.slides.splice(indexCurrentSlide, 1, slideReducer(newState.presentation.slides[indexCurrentSlide], action))
    newState.presentation = presentationReducer(newState.presentation, action);
    localStorage.setItem("savedEditor", JSON.stringify(newState))
    return newState
}


let store = createStore(mainReducer, localStorage.getItem("savedEditor") !== null ? deepClone(JSON.parse(localStorage.getItem("savedEditor")!)) as Editor: initialState)

export type AppDispatch = typeof store.dispatch

export { store, uploadDocFunction, HotKeys }