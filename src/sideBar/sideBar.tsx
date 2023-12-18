import styles from './SideBar.module.css'
import type { Editor, Slide } from '../model/types'
import SlideView from '../common/Slide/Slide'
import SlidesElement from '../common/SlidesElement/SlidesElement'
import { AppDispatch } from '../model/store'
import { selectManySlides, selectOneSlide, switchSlide } from '../model/actionCreators'
import { connect } from 'react-redux'
import { useRef } from 'react'


interface SideBarProps {
    slides: Array<Slide>,
    currentSlideIds: Array<string>,
    switchSlide: (slideId: string) => void,
    selectOneSlide: (slideId: string) => void,
    selectManySlides: (slideId: string) => void
}

const SideBar = ({
    slides,
    currentSlideIds,
    switchSlide,
    selectOneSlide,
    selectManySlides
}: SideBarProps) => {
    const slideRef = useRef(null)
    const slidesList = slides.map((slide) => (
        <div className = {styles.sidebar_element}
            key = {slide.slideId}
        >
            <li
                key = {slide.slideId}
                className = {styles.scaled_slide_container}
            >
                <div
                    className = {`${styles.scaled_slide} ${currentSlideIds.includes(slide.slideId, 0)? styles.scaled_slide_selected: ''}`}
                    onClick = {(e) => {
                        if (e.ctrlKey) {
                            selectOneSlide(slide.slideId)
                        }
                        else if (e.shiftKey) {
                            selectManySlides(slide.slideId)
                        }   
                        else {
                            switchSlide(slide.slideId)
                        }
                    }}
                >
                    <SlideView
                        slideElements = {
                            slide.elements.map((slideElement) =>
                                <li
                                    key = {slideElement.elementId} 
                                    className = {styles.slide_element}
                                > 
                                    <SlidesElement
                                        slideId = {slide.slideId}
                                        elementId= {slideElement.elementId}
                                        active = {false}
                                        slideRef={slideRef}
                                    />
                                </li> 
                            )}
                        background = {slide.background}   
                    />
                </div>
            </li>    
        </div>
    ))
    return (
        <div className = {styles.sidebar_container} >
            <ol className = {styles.slide_list}>{slidesList}</ol>
        </div>
    )
}

function mapStateToProps(state: Editor) {
    return {
        slides: state.presentation.slides,
        currentSlideIds: state.presentation.currentSlideIds
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        switchSlide: (slideId: string) => dispatch(switchSlide(slideId)),
        selectOneSlide: (slideId: string) => dispatch(selectOneSlide(slideId)),
        selectManySlides: (slideId: string) => dispatch(selectManySlides(slideId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)