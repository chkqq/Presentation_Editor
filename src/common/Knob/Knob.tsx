import { connect } from 'react-redux';
import styles from './Knob.module.css';

interface KnobProps {
    value: number,
    step: number,
    onClick: (value: number) => void
}

const Knob = ({
    value,
    step,
    onClick
}: KnobProps) => {
    return (
        <table className={styles.table}>
            <thead className={styles.table_head}>
                <tr className={styles.row}>
                    <td
                        className={styles.minus}
                        onClick={() => {
                            if (value - step > 0) {
                                value -= step
                            }
                            onClick(value)
                        }}
                    ></td>
                    <td className={styles.value}>{value}</td>
                    <td
                        className={styles.plus}
                        onClick={() => {
                            if (value + step <= 900) {
                                value += step
                            }
                            onClick(value)
                        }}
                    ></td>
                </tr>
            </thead>
        </table>
    )
}

export default connect()(Knob)