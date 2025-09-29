import { Label } from '@navikt/ds-react';
import * as React from 'react';
import styles from './uttakUtregning.module.css';

import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import type { JSX } from 'react';

interface UttakUtregningProps {
  heading: string;
  children: React.ReactNode;
  highlight?: boolean;
  headingPostContent?: React.ReactNode;
}

const UttakUtregning = ({ heading, children, highlight, headingPostContent }: UttakUtregningProps): JSX.Element => {
  const uttakUtregningCls = `${styles.uttakUtregning} ${highlight ? styles.uttakUtregningHighlighted : ''}`;
  return (
    <div className={uttakUtregningCls}>
      <div className={styles.uttakUtregningHeadingContainer}>
        <div className={styles.uttakUtregningHeadingIcon}>
          {highlight && <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />}
        </div>
        <Label size="small" as="p">
          {heading}
        </Label>
        {headingPostContent}
      </div>
      <hr />
      {children}
    </div>
  );
};

export default UttakUtregning;
