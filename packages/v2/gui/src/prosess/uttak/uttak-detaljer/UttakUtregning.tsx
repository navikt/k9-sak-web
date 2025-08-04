import { Label } from '@navikt/ds-react';
import { GreenCheckIcon } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import styles from './uttakUtregning.module.css';

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
        <div className={styles.uttakUtregningHeadingIcon}>{highlight && <GreenCheckIcon size={19} />}</div>
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
