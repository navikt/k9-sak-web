import styles from './PillIcon.module.css';

interface PillIconProps {
  text: string;
  type: 'success' | 'warning' | 'info';
}

const PillIcon = ({ text, type }: PillIconProps) => {
  const style = {
    success: styles.pillIconSuccess,
    warning: styles.pillIconWarning,
    info: styles.pillIconInfo,
  };

  return <div className={style[type]}>{text}</div>;
};

export default PillIcon;
