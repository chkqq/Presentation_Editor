import { Editor } from "./types"

//editor
function saveDoc() {
    return {
        type: 'SAVE_DOCUMENT',
    }
}

function uploadDoc(newEditor: Editor) {
    return {
        type: 'UPLOAD_DOCUMENT',
        newEditor
    }
}

function exportDoc() {
    return {
        type: 'EXPORT_DOCUMENT',
    }
}

function switchPreview() {
    return {
        type: 'SWITCH_PREVIEW'
    }
}

function undo() {
    return {
        type: 'UNDO'
    }
}

function redo() {
    return {
        type: 'REDO'
    }
}

function copy() {
    return {
        type: 'COPY'
    }
}

function paste() {
    return {
        type: 'PASTE'
    }
}

//presentation
function changeTitle(newTitle: string) {
    return {
        type: 'CHANGE_TITLE',
        newTitle
    }
}

function addSlide() {
    return {
        type: 'ADD_SLIDE'
    }
}

function removeSlides() {
    return {
        type: 'DELETE_SLIDE'
    }
}

function switchSlide(slideId: string) {
    return {
        type: 'SWITCH_SLIDE',
        slideId
    }
}

function selectOneSlide(slideId: string) {
    return {
        type: 'SELECT_ONE_SLIDE',
        slideId
    }
}

function selectManySlides(slideId: string) {
    return {
        type: 'SELECT_MANY_SLIDE',
        slideId
    }
}

function switchSlidePositions(orderShift: number) {
    return {
        type: 'SWITCH_SLIDE_POSITIONS',
        orderShift
    }
}

//slide
function setBackground(background: string) {
    return {
        type: 'SET_BACKGROUND',
        background
    }
}

function addObject(element: string) {
    return {
        type: 'ADD_OBJECT',
        element
    }
}

function addImage(urlImage: string) {
    return {
        type: 'ADD_IMAGE',
        urlImage
    }
}

function selectElement(elementId: string) {
    return {
        type: 'SELECT_ELEMENT',
        elementId
    }
}

function selectManyElements(elementId: string) {
    return {
        type: 'SELECT_MANY_ELEMENTS',
        elementId
    }
}

function changePosition(xShift: number, yShift: number) {
    return {
        type: 'CHANGE_POSITION',
        changePositionCoordinates: {
            xShift,
            yShift
        }
    }
}

function changeSize(newWidth: number, newHeight: number, xShift: number, yShift: number) {
    return {
        type: 'CHANGE_SIZE',
        ChangeSizeArgs: {
            newWidth,
            newHeight,
            xShift,
            yShift
        }
    }
}

function switchLayer(orderShift: number) {
    return {
        type: 'SWITCH_LAYER',
        orderShift
    }
}

function changeTextProps(
    font?: string,
    textColor?: string,
    bgColor?: string,
    textValue?: string,
    fontSize?: number,
    fontWeight?: "light" | "regular" | "bold"
) {
    return {
        type: 'CHANGE_TEXT_PROPS',
        ChangeTextArgs: {
            font,
            textColor,
            bgColor,
            textValue,
            fontSize,
            fontWeight
        }
    }
}

function changeStrokeWidth(newWidth: number) {
    return {
        type: 'CHANGE_STROKE_WIDTH',
        newWidth
    }
}

function changeStrokeColor(newColor: string) {
    return {
        type: 'CHANGE_STROKE_COLOR',
        newColor
    }
}

function changeFillColor(newColor: string) {
    return {
        type: 'CHANGE_FILL_COLOR',
        newColor
    }
}

function deleteSelected() {
    return {
        type: 'DELETE_SELECTED'
    }
}

function removeSelection(elementId: string) {
    return {
        type: 'REMOVE_SELECTION',
        elementId
    }
}

export { uploadDoc, redo, undo, switchPreview, exportDoc, saveDoc, changeTitle, addSlide, removeSlides,
         switchSlide, selectOneSlide, selectManySlides, switchSlidePositions, setBackground,
         addObject, addImage, selectElement, selectManyElements, changePosition, changeSize, switchLayer,
         changeTextProps, changeStrokeWidth, changeStrokeColor, changeFillColor, deleteSelected, removeSelection,
         copy, paste
        }