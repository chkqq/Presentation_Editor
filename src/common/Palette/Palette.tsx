import { connect } from 'react-redux';
import styles from './Palette.module.css';

interface PaletteProps {
  sendValue: (colorValue: string) => void;
}

const Palette = ({ sendValue }: PaletteProps) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value;
    sendValue(selectedColor);
  };

  return (
    <input
      type="color"
      className={styles.palette}
      onChange={handleColorChange}
    />
  );
};

export default connect()(Palette);
