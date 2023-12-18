import { Editor } from './model/types';
import ToolBar from './toolBar/ToolBar';
import SlideEditor from './slideEditor/slideEditor';  
import styles from './App.module.css';
import SlideView from './common/Slide/Slide';
import SlidesElement from './common/SlidesElement/SlidesElement'
import SideBar from './sideBar/sideBar'
import { AppDispatch } from './model/store';
import { switchPreview } from './model/actionCreators';
import { connect } from 'react-redux';
import { useRef, useState } from 'react';

interface AppProps {
    editor: Editor,
    switchPreview: () => void
}

function App({
    editor,
    switchPreview
}: AppProps) {
    if (editor.statePreview) {
        const onKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    switchPreview();
                    document.removeEventListener('keydown', onKeyDown);
                    break;
                case 'ArrowRight':
                    if (indexSlide !== editor.presentation.slides.length - 1) {
                        setIndexSlide(indexSlide + 1);    
                    }
                    break;
                case 'ArrowLeft':
                    if (indexSlide !== 0) {
                        setIndexSlide(indexSlide - 1);
                    }
                    break;            
            }
        }
        document.addEventListener('keydown', onKeyDown)
    }
    const slideRef = useRef(null)
    const [indexSlide, setIndexSlide] = useState(editor.presentation.slides.findIndex(slide => slide.slideId === editor.presentation.currentSlideIds[0]));
    const slidesList = editor.presentation.slides.map((slide) => (
        <div
            key = {slide.slideId}
            ref = {slideRef}
        >
            <SlideView
                slideElements = {
                    slide.elements.map((slideElement) =>
                        <li
                            key = {slideElement.elementId} 
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
    ))
    return (
        <div className={styles.app}>
            {
                editor.statePreview ?
                <div 
                    className={styles.preview_container}
                    onKeyDown = {(e) => {
                        if (e.key === 'Escape') {
                            switchPreview()
                        }
                    }}
                > 
                    <div className={styles.preview_slide}> 
                        {slidesList[indexSlide]} 
                    </div>        
                </div>
                :
                <div className={styles.app_content}>
                    <ToolBar />
                    <div className={styles.pres_view}>
                        <SideBar />
                        <SlideEditor />
                    </div>
                </div>
            }
        </div>
    )
}

function mapStateToProps(state: Editor) {
    return {
        editor: state
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        switchPreview: () => dispatch(switchPreview())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)