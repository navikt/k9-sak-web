import React from 'react';

import { Heading } from '@navikt/ds-react';

import styles from './detailView.module.css';

export interface DetailViewProps {
  title: string;
  children: React.ReactNode;
  contentAfterTitleRenderer?: () => React.ReactNode;
  className?: string;
}

export const DetailView = ({ title, children, contentAfterTitleRenderer, className }: DetailViewProps) => {
  const cls = `${styles.detailView} ${className ?? ''}`;
  return (
    <div className={cls}>
      <div className={styles.detailViewTitleContainer}>
        <Heading size="small" level="2">
          {title}
        </Heading>
        {contentAfterTitleRenderer && <div className={styles.detailViewNextToTitle}>{contentAfterTitleRenderer()}</div>}
      </div>
      {children}
    </div>
  );
};
