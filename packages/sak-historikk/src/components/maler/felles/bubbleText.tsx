import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import React, { useCallback, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

import styles from './bubbleText.module.css';

const truncateText = (tekst: string, cutOffLength: number): string =>
  tekst.length > cutOffLength ? `${tekst.substring(0, cutOffLength - 3)}...` : tekst;

interface OwnProps {
  bodyText?: string;
  cutOffLength?: number;
}

/**
 * Ekspanderbar tekst med chevron i nedre høyre hørnet - den skall vare expanderbar om den innehåller for mye tekst
 * för gjenbruk kan man återanvända. Man sender in teksten og var cut-off pointen skall vare.
 *
 * Eksempel:
 * ```html
 * <BubbleText bodyText={tekst} cutOffLength={70} />
 * ```
 */
const BubbleText = ({ intl, cutOffLength = 83, bodyText = '' }: OwnProps & WrappedComponentProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleOnClick = useCallback(() => setExpanded(prevState => !prevState), []);
  const handleKeyDown = useCallback(event => {
    if (event && event.keyCode === 32) {
      setExpanded(prevState => !prevState);
    }
  }, []);

  if (bodyText.length < cutOffLength + 1) {
    return <div>{bodyText}</div>;
  }

  return (
    <>
      {expanded && <div>{bodyText}</div>}
      {!expanded && <div className={styles.breakWord}>{truncateText(bodyText, cutOffLength)}</div>}
      <a
        href="#"
        onClick={handleOnClick}
        onKeyDown={handleKeyDown}
        className={styles.clickableArea}
        title={intl.formatMessage({ id: expanded ? 'BubbleText.LukkeTekstfelt' : 'BubbleText.ApneTekstfelt' })}
      >
        {expanded ? <OppChevron /> : <NedChevron />}
      </a>
    </>
  );
};

export default injectIntl(BubbleText);
