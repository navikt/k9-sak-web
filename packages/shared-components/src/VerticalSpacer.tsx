import classnames from 'classnames/bind';
import React from 'react';

import styles from './verticalSpacer.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  fourPx?: boolean;
  eightPx?: boolean;
  sixteenPx?: boolean;
  twentyPx?: boolean;
  thirtyTwoPx?: boolean;
  fourtyPx?: boolean;
}

/**
 * VerticalSpacer
 *
 * Presentasjonskomponent. Legg inn vertikalt tomrom.
 */
const VerticalSpacer = ({
  fourPx = false,
  eightPx = false,
  sixteenPx = false,
  twentyPx = false,
  thirtyTwoPx = false,
  fourtyPx = false,
}: OwnProps) => (
  <div
    className={classNames({
      fourPx,
      eightPx,
      sixteenPx,
      twentyPx,
      thirtyTwoPx,
      fourtyPx,
    })}
  />
);

export default VerticalSpacer;
