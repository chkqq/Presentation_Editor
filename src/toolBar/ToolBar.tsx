import { useState } from "react";
import { connect } from 'react-redux';
import { AppDispatch, uploadDocFunction } from '../model/store'

import Button from "../common/Button/Button"
import DropDown from "../common/DropDown/DropDown"
import Knob from "../common/Knob/Knob"
import TextField from "../common/TextField/TextField"

import { Editor, Slide, SlideElement } from "../model/types"

import styles from "./ToolBar.module.css"
import EditColorWindow from "./editColorWindow/EditColorWindow";
import {addSlide, changeTextProps, changeTitle, removeSlides, saveDoc, switchSlidePositions} from "../model/actionCreators";

type ToolBarProps = {
    slide: Slide,
    title: string,
    saveDoc: () => void,
    uploadDoc: () => void,
    addSlide: () => void,
    removeSlides: () => void,
    switchSlidePositions: (orderShift: number) => void,
    changeTextFont: (font: string) => void,
    changeTextSize: (fontSize: number) => void,
    changeTitle: (newTitle: string) => void,
    changeTextWeight: (fontWeight: number) => void,
}

const ToolBar = ({
    slide,
    title,
    saveDoc,
    uploadDoc,
    addSlide,
    removeSlides,
    switchSlidePositions,
    changeTextFont,
    changeTextSize,
    changeTitle,
    changeTextWeight,
}: ToolBarProps) => {
    const [rename, setRename] = useState(false);

    let textSelected = true;
    let figureSelected = true;
    slide.selectedElementsIds.forEach(id => 
        {
            if(slide.elements.find(element => element.elementId === id)?.elementType === 'figure')
            {
                textSelected = false;
            }
            else if (slide.elements.find(element => element.elementId === id)?.elementType === 'text')
            {
                figureSelected = false;
            }
        }
    )
    const [drawBlock, setDrawBlock] = useState('absent')
    const firstSelectedElement: SlideElement = slide.elements.find(element => element.elementId === slide.selectedElementsIds[0])!;

    return (
        <div className={styles.toolbar}>
            <div className={styles.top_block}>
                <div className={styles.top_block_second}>
                    <div className={styles.rename_container}>
                    {
                        rename ?
                            <TextField
                                size="big"
                                onKeyUp = {(value) => {
                                    if (value !== '') {
                                        changeTitle(value);
                                    }
                                    setRename(false)
                                }}
                                placeholder = 'Введите название...'
                             />
                            : <p className={styles.name}>{ title }</p>

                    }
                    </div>
                    <div className={styles.top_buttons_block}>
                        <div className={styles.outline_button}>
                            <Button 
                                viewStyle='outline' 
                                text='Переименовать' 
                                onClick={() => setRename(!rename)}
                            />
                        </div>
                        <div className={styles.outline_button}>
                            <Button
                                viewStyle='outline'
                                text='Сохранить'
                                onClick={() => saveDoc()}
                            />
                        </div>
                        <div className={styles.outline_button}>
                            <Button 
                                viewStyle='outline' 
                                text='Загрузить' 
                                onClick={() => uploadDoc()}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.bottom_buttons_block}>
                <div className={styles.slidebar_buttons_block}>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='sign'
                            text='+'
                            onClick={() => addSlide()}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='delete'
                            onClick={() => removeSlides()}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='arrow_down'
                            onClick={() => switchSlidePositions(1)}
                        />
                    </div>
                    <div className={styles.icon_button}>
                        <Button
                            viewStyle='arrow_up'
                            onClick={() => switchSlidePositions(-1)}
                        />
                    </div>
                </div>
                <div className={styles.slide_editor_buttons_block}>
                    <div className={styles.dropdown}>
                        <DropDown />
                    </div>
                    <div className={styles.outline_button}>
                        <Button
                            viewStyle='outline'
                            text='Фон'
                            onClick={() => setDrawBlock('backgroundSlide')}
                        />
                    </div>
                    <OptionalTools
                        textSelected = {textSelected}
                        figureSelected = {figureSelected}
                        firstSelectedElement = {firstSelectedElement}
                        onClick = {(newMode) => setDrawBlock(newMode)}
                        changeTextFont={changeTextFont}
                        changeTextSize={changeTextSize}
                        changeTextWeight={changeTextWeight}
                    />
                </div>
            </div>
            {
                drawBlock !== 'absent' &&
                <EditColorWindow
                    firstSelectedElement = {firstSelectedElement}
                    drawMode = {drawBlock}
                    onClick={() => setDrawBlock('absent')}
                />
            }
        </div>
    )}

interface OptionalToolsProps {
    textSelected: boolean,
    figureSelected: boolean,
    firstSelectedElement: SlideElement,
    onClick: (newMode: string) => void,
    changeTextFont: (font: string) => void,
    changeTextSize: (fontSize: number) => void,
    changeTextWeight: (fontWeight: number) => void,
}

function OptionalTools({ textSelected, figureSelected, firstSelectedElement, onClick, changeTextFont, changeTextSize, changeTextWeight }: OptionalToolsProps) {
    if (!textSelected && figureSelected){
        return (
            <div className={styles.optional_tools_container}>
                <div className = {styles.outline_button}>
                    <Button
                        viewStyle = 'outline'
                        text = 'Заливка фигуры'
                        onClick = {() => onClick('fillFigure')}
                    />
                </div>
                <div className={styles.outline_button}>
                    <Button
                        viewStyle='outline'
                        text='Контур фигуры'
                        onClick = {() => onClick('strokeFigure')}
                    />
                </div>
            </div>
        )
    }
    else if (textSelected && !figureSelected) {
        return (
            <div className={styles.optional_tools_container}>
                <p className={styles.optional_tools_text}>Шрифт</p>
                <TextField
                    size="small"
                    placeholder={firstSelectedElement.textProps!.font}
                    onKeyUp={(value) => changeTextFont(value)}
                />
                <p className={styles.optional_tools_text}>Размер шрифта</p>
                <Knob
                    value={firstSelectedElement.textProps!.fontSize}
                    step = {1}
                    onClick={(value) => changeTextSize(value)}
                />
                <p className={styles.optional_tools_text}>Жирность шрифта</p>
                <Knob
                    value={firstSelectedElement.textProps!.fontWeight}
                    step = {100}
                    onClick={(value) => changeTextWeight(value)}
                />
                <Button
                    viewStyle="text_color"
                    onClick={() => onClick('textColor')}
                />
            </div>
        )
    }
    else {
        return (<div className={styles.optional_tools_container}></div>)
    }
}

function mapStateToProps(state: Editor) {
    const indexSlide: number = state.presentation.slides.findIndex(slide => slide.slideId === state.presentation.currentSlideIds[0]);
    return {
        slide: state.presentation.slides[indexSlide],
        title: state.presentation.title
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        saveDoc: () => dispatch(saveDoc()),
        uploadDoc: () => uploadDocFunction(),
        addSlide: () => dispatch(addSlide()),
        removeSlides: () => dispatch(removeSlides()),
        switchSlidePositions: (orderShift: number) => dispatch(switchSlidePositions(orderShift)),
        changeTextFont: (font: string) => dispatch(changeTextProps(font)),
        changeTextSize: (fontSize: number) => dispatch(changeTextProps(undefined, undefined, undefined, fontSize)),
        changeTextWeight: (fontWeight: number) => dispatch(changeTextProps(undefined, undefined, undefined, undefined, fontWeight)),
        changeTitle: (newTitle: string) => dispatch(changeTitle(newTitle)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)