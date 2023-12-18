import { connect } from 'react-redux';
import styles from './input.module.css';

interface TextFieldProps {
    size: 'small' | 'big',
    placeholder?: string,
    value?: string,
    onKeyUp: (value: string) => void
}

const TextField = ({
    size,
    value,
    onKeyUp,
    placeholder = ""
}: TextFieldProps) => {
    return (
        <input
            autoFocus={size === 'big'}
            type='text'
            value={value}
            className={`${styles.input} ${size === 'big' ? styles.big: styles.small}`}
            placeholder={placeholder}
            onKeyUp={(e) => {
                if (e.key === 'Enter') {
                    onKeyUp(e.currentTarget.value)
                }
            }}
        ></input>
    )
}

export default connect()(TextField)