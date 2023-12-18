import styles from './DropDown.module.css';
import { useState, useRef } from 'react';
import Button from '../Button/Button';
import { useClickOutside } from '../../core/hooks/useClickOutside';
import { AppDispatch } from '../../model/store';
import { addImage, addObject } from '../../model/actionCreators';
import { connect } from 'react-redux';

interface DropDownProps {
    addObject: (element: string) => void,
    addImage: (urlImage: string) => void,
}

const DropDown = ({addObject, addImage}: DropDownProps) => {
    const [opened, setOpened] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null)

    useClickOutside(dropDownRef, () => setOpened(false));
    
    return (
        <div className = {styles.container}
            ref={dropDownRef}
        >
            <div
                className = {`${styles.drop_down} ${opened && styles.drop_down_active}`}
                onClick = {() => setOpened(!opened)}
            >
                <div
                    className = {`${styles.text_container} ${opened && styles.text_container_active}`}
                >
                    Вставка
                </div>
            </div>
            {
                opened
                    ?  <DropDownOptions 
                        onClick = {() => setOpened(false)}
                        addImage={addImage}
                        addObject={addObject}
                    /> 
                    :  null
            }
        </div>
    )
}

interface DropDownOptionsProps {
    onClick: () => void,
    addObject: (element: string) => void,
    addImage: (urlImage: string) => void,
}

const DropDownOptions = ({onClick, addObject, addImage}: DropDownOptionsProps) => {
    const [activeFigure, setActiveFigure] = useState(false);
    const [activeImage, setActiveImage] = useState(false);
    return (
        <div className={styles.options_container}>
            <div
                className = {`${styles.figure} ${activeFigure && styles.figure_active}`}
                onClick = {() => {
                    setActiveFigure(!activeFigure);
                    setActiveImage(false);
                }}
            >
                Фигура
            </div>
            <div 
                className = {`${styles.image} ${activeImage && styles.image}`}
                onClick = {() => {
                    setActiveImage(!activeImage);
                    setActiveFigure(false);
                }}
            >
                Изображение
            </div>
            <div
                className = {styles.text}
                onClick = {() => {
                    addObject('text')
                    setActiveImage(false);
                    setActiveFigure(false);
                    onClick();
                }}  
            >
                Текст
            </div>
            <DropDownOptionsToAdd 
                activeFigure = {activeFigure}
                activeImage = {activeImage}
                onClick = {onClick}
                addObject={addObject}
                addImage={addImage}
            />
        </div>
    )
}

interface DropDownOptionsToAddProps {
    activeFigure: boolean,
    activeImage: boolean,
    onClick: () => void,
    addObject: (element: string) => void,
    addImage: (urlImage: string) => void,
}

const DropDownOptionsToAdd = ({ activeFigure, activeImage, onClick, addObject, addImage }: DropDownOptionsToAddProps) => {
    return (
        <div className={styles.options_to_add_container}>
            {
            activeFigure 
                ?
                    <div className = {styles.figure_types}>
                        <div 
                            className={styles.rectangle}
                            onClick = {() => {
                                addObject('rectangle')
                                onClick()
                            }}>
                        </div>
                        <div 
                            className={styles.triangle}
                            onClick = {() => {
                                addObject('triangle')
                                onClick()
                            }}>
                        </div>
                        <div 
                            className={styles.circle}
                            onClick = {() => {
                                addObject('circle')
                                onClick()
                            }}>
                        </div>
                    </div>
                : null
        }
        {
            activeImage
                ?
                    <div className = {styles.image_types}>
                        <Button 
                            viewStyle = 'default'
                            text = 'С компьютера'
                            onClick = {() => {
                                const inputFile = document.createElement('input');
                                inputFile.type = 'file';
                                inputFile.style.display = 'none';
                                inputFile.accept = 'image/*';
                                inputFile.onchange = () => {
                                    if (inputFile.files) {
                                        const urlImage = URL.createObjectURL(inputFile.files[0])
                                        addImage(urlImage)
                                    }
                                   
                                }
                                inputFile.click();
                                inputFile.remove();
                                onClick()
                            }}
                        />
                        <Button 
                            viewStyle = 'default'
                            text = 'С интернета'
                            onClick = {() => {
                                onClick()
                            }}
                        />
                        <Button 
                            viewStyle = 'default'
                            text = 'С Анапы 2007'
                            onClick = {() => {
                                onClick()
                            }}
                        />
                    </div>
                : null
        }
        </div>
    )
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        addObject: (element: string) => dispatch(addObject(element)),
        addImage: (urlImage: string) => dispatch(addImage(urlImage)),
    }
}

export default connect(null, mapDispatchToProps)(DropDown)