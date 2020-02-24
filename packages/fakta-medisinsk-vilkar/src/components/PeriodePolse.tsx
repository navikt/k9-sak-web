import classnames from 'classnames/bind';
import * as React from 'react';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import styles from './periodePolse.less';

type PeriodePolseTheme = 'success' | 'warn' | 'neutral' | 'blue';

interface PeriodePolseProps {
  theme?: PeriodePolseTheme;
  dates?: string;
  lengthInText?: string;
  status?: string;
  children?: React.ReactChild | React.ReactChildren;
}

const classNames = classnames.bind(styles);

const PeriodePolse: React.FunctionComponent<PeriodePolseProps> = ({
  dates,
  lengthInText,
  status,
  children,
  theme = 'neutral',
}) => {
  const themeBorder = classNames('themeBorder', {
    success: theme === 'success',
    warn: theme === 'warn',
    blue: theme === 'blue',
  });
  return (
    <div className={styles.peridePolse}>
      <div className={themeBorder} />
      <div className={styles.contentWrapper}>
        {dates || lengthInText || status ? (
          <div className={styles.headerContainer}>
            <div className={styles.datesContainer}>
              {dates && <Element className={styles.dates}>{dates}</Element>}
              {lengthInText && <Normaltekst className={styles.lengthInText}>({lengthInText})</Normaltekst>}
            </div>
            {status && <Element>{status}</Element>}
          </div>
        ) : null}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PeriodePolse;
