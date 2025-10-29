import React, { useCallback, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
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
    return <BodyShort size="small">{bodyText}</BodyShort>;
  }

  return (
    <>
      {expanded && <BodyShort size="small">{bodyText}</BodyShort>}
      {!expanded && (
        <BodyShort size="small" className={styles.breakWord}>
          {truncateText(bodyText, cutOffLength)}
        </BodyShort>
      )}
      <Button
        type="button"
        onClick={handleOnClick}
        onKeyDown={handleKeyDown}
        className={styles.clickableArea}
        aria-label={intl.formatMessage({ id: expanded ? 'BubbleText.LukkeTekstfelt' : 'BubbleText.ApneTekstfelt' })}
        aria-expanded={expanded}
        icon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        variant="tertiary"
      />
    </>
  );
};

export default injectIntl(BubbleText);
