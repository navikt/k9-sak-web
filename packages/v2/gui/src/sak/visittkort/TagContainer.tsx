import { Tag, type TagProps } from '@navikt/ds-react';
import React from 'react';
import styles from './tagContainer.module.css';

interface Props {
  tagVariant: TagProps['variant'];
  size?: 'small' | 'medium';
  children?: React.ReactNode;
}

const TagContainer: React.FC<Props> = ({ children, tagVariant, size = 'small' }) => (
  <Tag className={styles.tag} variant={tagVariant} size={size}>
    {children}
  </Tag>
);

export default TagContainer;
