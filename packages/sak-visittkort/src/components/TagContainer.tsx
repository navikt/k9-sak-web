import { FlexColumn } from '@k9-sak-web/shared-components';
import { Tag } from '@navikt/ds-react';
import React from 'react';
import styles from './tagContainer.module.css';

interface Props {
  tagVariant: 'warning' | 'error' | 'info' | 'success';
  size?: 'small' | 'medium';
  children?: React.ReactNode;
}

const TagContainer: React.FC<Props> = ({ children, tagVariant, size = 'small' }) => (
  <FlexColumn>
    <div className={styles.flexContainer}>
      <Tag className={styles.tag} variant={tagVariant} size={size}>
        {children}
      </Tag>
    </div>
  </FlexColumn>
);

export default TagContainer;
