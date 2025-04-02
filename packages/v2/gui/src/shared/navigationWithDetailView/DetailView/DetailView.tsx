import React from 'react';

import { Heading } from '@navikt/ds-react';
import classnames from 'classnames';

import styles from './detailView.module.css';

export interface DetailViewProps {
  title: string;
  children: React.ReactNode;
  contentAfterTitleRenderer?: () => React.ReactNode;
  className?: string;
}

// TODO (TOR) Skriv om til å bruka Aksel Box/VStack, evt slett
export const DetailView = ({ title, children, contentAfterTitleRenderer, className }: DetailViewProps) => {
  const cls = classnames(
    styles.detailView,
    className
      ? {
          [className]: !!className,
        }
      : {},
  );
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
