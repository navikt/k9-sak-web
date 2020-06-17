import React, { ReactNode, FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './flexRow.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  children: ReactNode | ReactNode[];
  /**
   * spaceBetween: aktiverer { justify-content: space-between } på raden. Default er false.
   */
  spaceBetween?: boolean;
  alignItemsToBaseline?: boolean;
  alignItemsToFlexEnd?: boolean;
  wrap?: boolean;
  className?: string;
  ustifyCenter?: boolean;
  childrenMargin?: boolean;
  autoFlex?: boolean;
}

const FlexRow: FunctionComponent<OwnProps> = ({
  children,
  spaceBetween = false,
  alignItemsToBaseline = false,
  alignItemsToFlexEnd = false,
  wrap = false,
  className,
  justifyCenter = false,
  childrenMargin = false,
  autoFlex = false,
}) => (
  <div
    className={classNames(
      'flexRow',
      { spaceBetween },
      { alignItemsToBaseline },
      { alignItemsToFlexEnd },
      { wrap },
      { justifyCenter },
      { childrenMargin },
      { autoFlex },
      className,
    )}
  >
    {children}
  </div>
);

export default FlexRow;
