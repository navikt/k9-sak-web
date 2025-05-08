import styles from './PillIcon.module.css';

interface PillIconProps {
  text: string;
  type: 'success' | 'warning' | 'info';
}

const PillIcon = ({ text, type }: PillIconProps) => {
  const style = {
    success: styles['PillIcon--success'],
    warning: styles['PillIcon--warning'],
    info: styles['PillIcon--info'],
  };

  return <div className={style[type]}>{text}</div>;
};

export default PillIcon;
