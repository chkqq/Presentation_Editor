import type { FigureType } from '../../../model/types'
import type { Size } from '../../../core/types/types'
import { connect } from 'react-redux'

interface FigureProps {
    figure: FigureType,
    size: Size
}

const Circle = ({
    figure,
    size
}: FigureProps) => {
    const width: number = size.width !== 0 ?(size.width - figure.strokeWidth) / 2 : figure.strokeWidth;
    const height: number = size.height !== 0 ? (size.height - figure.strokeWidth) / 2 : figure.strokeWidth;
    return (
        <svg
            width = {size.width + figure.strokeWidth}
            height = {size.height + figure.strokeWidth}
        >
            <ellipse
                rx = {width}
                ry = {height}
                cx = {size.width / 2}
                cy = {size.height / 2}
                fill = {figure.fillColor}
                stroke = {figure.strokeColor}
                strokeWidth = {figure.strokeWidth}
            >
            </ellipse>
        </svg>
    )
}

const Rectangle = ({
    figure,
    size
}: FigureProps) => {
    const width: number = size.width !== 0 ? size.width - figure.strokeWidth : figure.strokeWidth;
    const height: number = size.height !== 0 ? size.height - figure.strokeWidth : figure.strokeWidth;
    return (
        <svg
            width = {size.width + figure.strokeWidth}
            height = {size.height + figure.strokeWidth}
        >
            <rect   
                x = {figure.strokeWidth/2}
                y = {figure.strokeWidth/2}
                width = {width}
                height = {height}
                fill = {figure.fillColor}
                stroke = {figure.strokeColor}
                strokeWidth = {figure.strokeWidth}
            >
            </rect>
        </svg>
    )
}

const Triangle = ({
    figure,
    size
}: FigureProps) => {
    const width: number = size.width + figure.strokeWidth;
    const height: number = size.height + figure.strokeWidth;
    const points: string = String(figure.strokeWidth) + ', ' + String(height-figure.strokeWidth * 2) + ' ' + String(width/2) + ',' + String(figure.strokeWidth) + ' ' + String(width-figure.strokeWidth) + ',' + String(height-figure.strokeWidth * 2)
    return (
        <svg
            width = {width}
            height = {height}
        >
            <polygon
                points = {points}
                fill = {figure.fillColor}
                stroke = {figure.strokeColor}
                strokeWidth = {figure.strokeWidth}
            >
            </polygon>
        </svg>
    )
}

const Figure = ({
    figure,
    size
}: FigureProps) => {
    switch (figure.form) {
        case "rectangle":
            return ( 
                <Rectangle
                    figure = {figure}
                    size = {size}
                />
            )

        case "circle":
            return (
                <Circle
                    figure = {figure}
                    size = {size}
                />     
            )
            
        case "triangle":
            return (
                <Triangle
                    figure = {figure}
                    size = {size}
                />            
            )    
    }
}

export default connect()(Figure)