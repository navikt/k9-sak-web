import { Tag, type TagProps } from '@navikt/ds-react';
import React from 'react';
import styles from './tagContainer.module.css';

interface Props {
  tagVariant: TagProps['variant'];
  size?: 'small' | 'medium';
  children?: React.ReactNode;
}

const TagContainer: React.FC<Props> = ({ children, tagVariant, size = 'small' }) => (
  <div className={styles.flexContainer}>
    <Tag className={styles.tag} variant={tagVariant} size={size}>
      {children}
    </Tag>
  </div>
);

export default TagContainer;
