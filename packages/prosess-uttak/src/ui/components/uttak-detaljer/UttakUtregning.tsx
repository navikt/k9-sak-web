import classNames from 'classnames/bind';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { GreenCheckIcon } from '@navikt/ft-plattform-komponenter';
import styles from './uttakUtregning.module.css';

const cx = classNames.bind(styles);

interface UttakUtregningProps {
  heading: string;
  children: React.ReactNode;
  highlight?: boolean;
  headingPostContent?: React.ReactNode;
}

const UttakUtregning = ({ heading, children, highlight, headingPostContent }: UttakUtregningProps): JSX.Element => {
  const uttakUtregningCls = cx('uttakUtregning', {
    'uttakUtregning--highlighted': highlight,
  });
  return (
    <div className={uttakUtregningCls}>
      <div className={styles.uttakUtregning__headingContainer}>
        <div className={styles.uttakUtregning__headingIcon}>{highlight && <GreenCheckIcon size={19} />}</div>
        <Element>{heading}</Element>
        {headingPostContent}
      </div>
      <hr />
      {children}
    </div>
  );
};

export default UttakUtregning;
