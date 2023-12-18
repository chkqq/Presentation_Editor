import { connect } from 'react-redux';
import styles from './Slide.module.css'

interface SlideViewProps {
    slideElements: Array<JSX.Element>,
    background: string
}

const SlideView = ({
    slideElements,
    background,
}: SlideViewProps) => {
    const stringStile: string = background[0] !== '#' ? '0 0/cover url(' + background + ')' : background;
    return (
        <div 
            className = {styles.slide}
            style = {{"background": stringStile}}
        >
            <ul>{slideElements}</ul>                
        </div>
    )
}

export default connect()(SlideView)