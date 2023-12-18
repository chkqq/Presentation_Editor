import type { SlideElement, Slide } from './types';
import { deepClone } from '../core/functions/deepClone';
import { v4 } from 'uuid';
import { ActionType } from './store';

function setBackgroundReducer(slide: Slide, background: string): Slide {
    if (background !== '') {
        const newSlide = deepClone(slide) as Slide;
        newSlide.background = background;
        return newSlide
    }
    else { return slide }
}

function addObjectReducer(slide: Slide, element: string): Slide {
    const newSlide = deepClone(slide) as Slide;
    const newEl: SlideElement = {
        elementId: v4(),
        elementType: 'figure',
        position: {
            x: 400,
            y: 400
        },
        size: {
            width: 100,
            height: 100
        }
    }
    switch(element) {
        case 'rectangle': {
            newEl.figure = {
                form: 'rectangle',
                strokeWidth: 1,
                strokeColor: 'black',
                fillColor: 'white'
            }
            break;
        }
        case 'triangle': {
            newEl.figure = {
                form: 'triangle',
                strokeWidth: 1,
                strokeColor: 'black',
                fillColor: 'white'
            }
            break;
        }
        case 'circle': {
            newEl.figure = {
                form: 'circle',
                strokeWidth: 1,
                strokeColor: 'black',
                fillColor: 'white'
            }
            break;
        }
        case 'text': {
            newEl.elementType = 'text';
            newEl.textProps = {
                font: 'Arial',
                textColor: 'black',
                bgColor: null,
                textValue: 'Hello Kerim',
                fontSize: 15,
                fontWeight: 'regular'
            }
            break;
        }
    }
    newSlide.elements.push(newEl);
    return newSlide
}


function addImageReducer(slide: Slide, urlImage: string): Slide {
    const newSlide = deepClone(slide) as Slide;
    const newEl: SlideElement = {
        elementId: v4(),
        elementType: 'image',
        position: {
            x: 400,
            y: 400
        },
        size: {
            width: 100,
            height: 100
        },
        image: urlImage
    } 
    newSlide.elements.push(newEl);
    return newSlide
}

function removeSelectionReducer(slide: Slide, elementId: string): Slide {
    const newSlide = deepClone(slide) as Slide;
    const elementIndex = newSlide.selectedElementsIds.findIndex((id) => id === elementId)
    newSlide.selectedElementsIds.splice(elementIndex, 1)
    return newSlide
}

function selectElementReducer(slide: Slide, elementId: string): Slide {
    const newSlide = deepClone(slide) as Slide;
    newSlide.selectedElementsIds = [elementId];
    return newSlide
}

function selectManyElementsReducer(slide: Slide, elementId: string): Slide {
    const newSlide = deepClone(slide) as Slide;
    newSlide.selectedElementsIds.push(elementId);
    console.log(JSON.stringify(newSlide.selectedElementsIds))
    return newSlide
} 

function changePositionReducer(slide: Slide, xShift: number, yShift: number): Slide {
    const newSlide = deepClone(slide) as Slide;
    for(let i = 0; i < newSlide.elements.length; i++) {
        if(newSlide.selectedElementsIds.includes(newSlide.elements[i].elementId)) {
            const newElement: SlideElement = {
                ...newSlide.elements[i],
                position: {
                    x: newSlide.elements[i].position.x + xShift,
                    y: newSlide.elements[i].position.y + yShift
                }
            };
            newSlide.elements.splice(i, 1, newElement)
        }
    }
    return newSlide
}

function switchLayerReducer(slide: Slide, orderShift: number): Slide {
    const newSlide = deepClone(slide) as Slide;
    if (orderShift > 0) {
        for (let i = newSlide.selectedElementsIds.length - 1; i >= 0; i--) {
            const indexElement: number = newSlide.elements.findIndex(element => element.elementId === newSlide.selectedElementsIds[i]);
            if (indexElement + orderShift < newSlide.elements.length) {
                const tempElement: SlideElement = newSlide.elements[indexElement + orderShift];
                newSlide.elements.splice(indexElement + orderShift, 1, newSlide.elements[indexElement]);
                newSlide.elements.splice(indexElement, 1, tempElement)
            }
            else {
                return newSlide
            }
        }
    }
    else {
        for (let i = 0; i < newSlide.selectedElementsIds.length; i++) {
            const indexElement: number = newSlide.elements.findIndex(element => element.elementId === newSlide.selectedElementsIds[i]);
            if (indexElement + orderShift >= 0) {
                const tempSlide: SlideElement = newSlide.elements[indexElement + orderShift];
                newSlide.elements.splice(indexElement + orderShift, 1, newSlide.elements[indexElement]);
                newSlide.elements.splice(indexElement, 1, tempSlide);
            }
        }
    }
    return {
        ...newSlide
    }   
}

function changeSizeReducer(slide: Slide, newWidth: number, newHeight: number, xShift: number, yShift: number): Slide {
    const newSlide = deepClone(slide) as Slide;
    const selectedElementsId: Array<string> = newSlide.selectedElementsIds.concat();
    for(let i = 0; i < newSlide.elements.length; i++) {
        if(selectedElementsId.includes(newSlide.elements[i].elementId)) {
            const newElement: SlideElement = {
                ...newSlide.elements[i],
                size: {
                    width: newWidth,
                    height: newHeight
                },
                position: {
                    x: newSlide.elements[i].position.x + xShift,
                    y: newSlide.elements[i].position.y + yShift
                }
            };
            newSlide.elements.splice(i, 1, newElement)
        }
    }
    return newSlide
}

function changeTextPropsReducer(
    slide: Slide | undefined,
    font: string | undefined,
    textColor: string | undefined,
    bgColor: string | undefined,
    textValue: string | undefined,
    fontSize: number | undefined,
    fontWeight: "light" | "regular" | "bold" | undefined   
): Slide {
    const newSlide = deepClone(slide) as Slide;
    const selectedElementsId: Array<string> = newSlide.selectedElementsIds.concat();
    for (let i = 0; i < newSlide.elements.length; i++) {
        if (selectedElementsId.includes(newSlide.elements[i].elementId) && newSlide.elements[i].elementType === "text") {
            const newElement: SlideElement = {
                ...newSlide.elements[i],
                textProps: {
                    font: font !== undefined ? font : newSlide.elements[i].textProps!.font, 
                    textColor: textColor !== undefined ? textColor : newSlide.elements[i].textProps!.textColor,
                    bgColor: bgColor !== undefined ? bgColor : newSlide.elements[i].textProps!.bgColor,
                    textValue: textValue !== undefined ? textValue : newSlide.elements[i].textProps!.textValue,
                    fontSize: fontSize !== undefined ? fontSize : newSlide.elements[i].textProps!.fontSize,
                    fontWeight: fontWeight !== undefined ? fontWeight : newSlide.elements[i].textProps!.fontWeight,
                }
            };
            newSlide.elements.splice(i, 1, newElement)
        }
    }
    return newSlide
}

function changeStrokeWidthReducer(slide: Slide, newWidth: number): Slide {
    const newSlide = deepClone(slide) as Slide;
    const selectedElementsId: Array<string> = newSlide.selectedElementsIds.concat();
    for (let i = 0; i < newSlide.elements.length; i++) {
        if (selectedElementsId.includes(newSlide.elements[i].elementId) && (newSlide.elements[i].elementType === "figure") && (newSlide.elements[i].figure !== undefined)) {
            const newElement: SlideElement = {
                ...newSlide.elements[i],
                figure: {
                    form: newSlide.elements[i].figure!.form,
                    strokeColor: newSlide.elements[i].figure!.strokeColor,
                    strokeWidth: newWidth,
                    fillColor: newSlide.elements[i].figure!.fillColor
                }
            }
            newSlide.elements.splice(i, 1, newElement)
        }
    }
    return newSlide
}

function changeStrokeColorReducer(slide: Slide, newColor: string): Slide {
    if (newColor) {
        const newSlide = deepClone(slide) as Slide;
        const selectedElementsId: Array<string> = newSlide.selectedElementsIds.concat();
        for (let i = 0; i < newSlide.elements.length; i++) {
            if (selectedElementsId.includes(newSlide.elements[i].elementId) && (newSlide.elements[i].elementType === "figure") && (newSlide.elements[i].figure !== undefined)) {
                const newElement: SlideElement = {
                    ...newSlide.elements[i],
                    figure: {
                        form: newSlide.elements[i].figure!.form,
                        strokeColor: newColor,
                        strokeWidth: newSlide.elements[i].figure!.strokeWidth,
                        fillColor: newSlide.elements[i].figure!.fillColor
                    }
                }
                newSlide.elements.splice(i, 1, newElement)
            }
        }
        return newSlide
    }
    else { return slide }
}

function changeFillColorReducer(slide: Slide, newColor: string ): Slide {
    if (newColor) {
        const newSlide = deepClone(slide) as Slide;
        const selectedElementsId: Array<string> = newSlide.selectedElementsIds.concat();
        for (let i = 0; i < newSlide.elements.length; i++) {
            if (selectedElementsId.includes(newSlide.elements[i].elementId) && (newSlide.elements[i].elementType === "figure") && (newSlide.elements[i].figure !== undefined)) {
                const newElement: SlideElement = {
                    ...newSlide.elements[i],
                    figure: {
                        form: newSlide.elements[i].figure!.form,
                        strokeColor: newSlide.elements[i].figure!.strokeColor,
                        strokeWidth: newSlide.elements[i].figure!.strokeWidth,
                        fillColor: newColor
                    }
                }
                newSlide.elements.splice(i, 1, newElement)
            }
        }
        return newSlide
    }
    else {return slide}
}

function deleteSelectedReducer(slide: Slide): Slide {
    const newSlide = deepClone(slide) as Slide;
    const selectedElementsId: Array<string> = newSlide.selectedElementsIds.concat();
    newSlide.elements.forEach(element => {
        if(selectedElementsId.includes(element.elementId)) {
            newSlide.elements.splice(newSlide.elements.indexOf(element), 1)
        }
    })
    newSlide.selectedElementsIds = [];
    return newSlide
}

function slideReducer(state: Slide, action: ActionType): Slide {
    switch (action.type) {
        case 'SET_BACKGROUND':
            return action.background !== undefined? setBackgroundReducer(state, action.background): deepClone(state) as Slide;
        case 'ADD_OBJECT':
            return action.element !== undefined? addObjectReducer(state, action.element): deepClone(state) as Slide;
        case 'ADD_IMAGE':
            return action.urlImage !== undefined? addImageReducer(state, action.urlImage): deepClone(state) as Slide;
        case 'SELECT_ELEMENT':
            return action.elementId !== undefined? selectElementReducer(state, action.elementId): deepClone(state) as Slide;
        case 'SELECT_MANY_ELEMENTS':
            return action.elementId !== undefined? selectManyElementsReducer(state, action.elementId): deepClone(state) as Slide;
        case 'CHANGE_POSITION':
            return action.changePositionCoordinates !== undefined? changePositionReducer(state, action.changePositionCoordinates.xShift, action.changePositionCoordinates.yShift): deepClone(state) as Slide;
        case 'SWITCH_LAYER':
            return action.orderShift !== undefined? switchLayerReducer(state, action.orderShift): deepClone(state) as Slide;
        
        case 'CHANGE_SIZE':
            return action.ChangeSizeArgs !== undefined? changeSizeReducer(state, action.ChangeSizeArgs.newWidth, action.ChangeSizeArgs.newHeight, action.ChangeSizeArgs.xShift, action.ChangeSizeArgs.yShift): deepClone(state) as Slide;
        case 'CHANGE_TEXT_PROPS':
            return action.ChangeTextArgs !== undefined? changeTextPropsReducer(state,
                action.ChangeTextArgs.font,
                action.ChangeTextArgs.textColor,
                action.ChangeTextArgs.bgColor,
                action.ChangeTextArgs.textColor,
                action.ChangeTextArgs.fontSize,
                action.ChangeTextArgs.fontWeight
            ): deepClone(state) as Slide;
        case 'CHANGE_STROKE_WIDTH':
            return action.newWidth !== undefined? changeStrokeWidthReducer(state, action.newWidth): deepClone(state) as Slide;
        case 'CHANGE_STROKE_COLOR': 
            return action.newColor !== undefined? changeStrokeColorReducer(state, action.newColor): deepClone(state) as Slide;
        case 'CHANGE_FILL_COLOR':
            return action.newColor !== undefined? changeFillColorReducer(state, action.newColor): deepClone(state) as Slide;
        case 'DELETE_SELECTED':
            return deleteSelectedReducer(state);
        case 'REMOVE_SELECTION': 
            return action.elementId !== undefined? removeSelectionReducer(state, action.elementId): deepClone(state) as Slide;
        default:
            return deepClone(state) as Slide;
    }
}

export { slideReducer }