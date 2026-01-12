import type { JSX, ReactNode } from 'react';
import styles from './listItem.module.css';

interface ListItemProps {
  firstColumnRenderer: () => ReactNode;
  secondColumnRenderer: () => ReactNode;
}

const ListItem = ({ firstColumnRenderer, secondColumnRenderer }: ListItemProps): JSX.Element => (
  <div className={styles.listItem}>
    <div className={styles.listItem__firstColumn}>{firstColumnRenderer()}</div>
    <div className={styles.listItem__secondColumn}>{secondColumnRenderer()}</div>
  </div>
);

export default ListItem;
