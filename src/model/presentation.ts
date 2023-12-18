import type { Slide, Presentation } from './types';
import { deepClone } from '../core/functions/deepClone';
import { v4 } from 'uuid';
import { ActionType } from './store';

function changeTitleReducer(presentation: Presentation, title: string): Presentation {
    const newPresentation = deepClone(presentation) as Presentation;
    return {
        ...newPresentation,
        title: title,
    }
}

function addSlideReducer(presentation: Presentation): Presentation {
    const newPresentation = deepClone(presentation) as Presentation;
    const newSlides = deepClone(newPresentation.slides) as Array<Slide>;
    newSlides.push({
        slideId: v4(),
        elements: [],
        background: "#FFFFFF",
        selectedElementsIds: []
    });
    return {
        ...newPresentation,
        slides: newSlides
    }
}

function deleteSlidesReducer(presentation: Presentation): Presentation {
    const newPresentation = deepClone(presentation) as Presentation;
    const newSlides = deepClone(newPresentation.slides) as Array<Slide>;
    newPresentation.currentSlideIds.forEach(idToDelete => {
        if (newSlides.length >= 2) {
            newSlides.splice(newSlides.findIndex(slide => slide.slideId === idToDelete), 1)
        }
    })
    return {
        ...newPresentation,
        slides: newSlides,
        currentSlideIds: [newSlides[0].slideId]
    }
}

function switchSlideReducer(presentation: Presentation, slideId: string): Presentation {
    const newPresentation = deepClone(presentation) as Presentation;
    const slideIndex = newPresentation.slides.findIndex(slide => slide.slideId === newPresentation.currentSlideIds[0])
    newPresentation.slides[slideIndex].selectedElementsIds = [];
    return {
        ...newPresentation,
        currentSlideIds: [slideId]
    }
}


function selectOneSlideReducer(presentation: Presentation, slideId: string): Presentation {
    const newPresentation = deepClone(presentation) as Presentation;
    const newCurrentSlideIds = presentation.currentSlideIds.concat();
    newCurrentSlideIds.push(slideId);
    return {
        ...newPresentation,
        currentSlideIds: newCurrentSlideIds
    }
}

function selectManySlideReducer(presentation: Presentation, slideId: string): Presentation {
    const newPresentation = deepClone(presentation) as Presentation;
    const newCurrentSlideIds = newPresentation.currentSlideIds.concat();
    const firstIndex = newPresentation.slides.findIndex(slide => slide.slideId === newCurrentSlideIds[newCurrentSlideIds.length - 1])
    const indexSelected = newPresentation.slides.findIndex(slide => slide.slideId === slideId)
    for (let i = firstIndex + 1; i <= indexSelected; i++) {
        newCurrentSlideIds.push(newPresentation.slides[i].slideId)
    }
    return {
        ...newPresentation,
        currentSlideIds: newCurrentSlideIds
    }
}

function switchSlidePositionsReducer(presentation: Presentation, orderShift: number): Presentation {
    const newPresentation = deepClone(presentation) as Presentation;
    const newSlides = deepClone(newPresentation.slides) as Array<Slide>;
    if(orderShift > 0) {
        for (let i = newPresentation.currentSlideIds.length - 1; i >= 0; i--) {
            const indexSlide: number = newSlides.findIndex(slide => slide.slideId === newPresentation.currentSlideIds[i]);
            if (indexSlide + orderShift < newSlides.length) {
                const tempSlide: Slide = newSlides[indexSlide + orderShift];
                newSlides.splice(indexSlide + orderShift, 1, newSlides[indexSlide]);
                newSlides.splice(indexSlide, 1, tempSlide);
            }
            else {
                return newPresentation
            }
        }
    }
    else {
        for (let i = 0; i < newPresentation.currentSlideIds.length; i++) {
            const indexSlide: number = newSlides.findIndex(slide => slide.slideId === newPresentation.currentSlideIds[i]);
            if (indexSlide + orderShift >= 0) {
                const tempSlide: Slide = newSlides[indexSlide + orderShift];
                newSlides.splice(indexSlide + orderShift, 1, newSlides[indexSlide]);
                newSlides.splice(indexSlide, 1, tempSlide);
            }
            else {
                return newPresentation
            }
        }
    }
    return {
        ...newPresentation,
        slides: newSlides
    }   
}

function presentationReducer(state: Presentation, action: ActionType): Presentation {
    switch (action.type) {
        case 'CHANGE_TITLE': 
            return action.newTitle !== undefined? changeTitleReducer(state, action.newTitle): deepClone(state) as Presentation
        case 'ADD_SLIDE':
            return addSlideReducer(state);
        case 'DELETE_SLIDE':
            return deleteSlidesReducer(state);
        case 'SWITCH_SLIDE':
            return action.slideId !== undefined? switchSlideReducer(state, action.slideId): deepClone(state) as Presentation
        case 'SELECT_ONE_SLIDE': 
            return action.slideId !== undefined? selectOneSlideReducer(state, action.slideId): deepClone(state) as Presentation;
        case 'SELECT_MANY_SLIDE': 
            return action.slideId !== undefined? selectManySlideReducer(state, action.slideId): deepClone(state) as Presentation
        case 'SWITCH_SLIDE_POSITIONS':
            return action.orderShift !== undefined? switchSlidePositionsReducer(state, action.orderShift): deepClone(state) as Presentation;
        default:
            return deepClone(state) as Presentation;
    }
}

export { presentationReducer }