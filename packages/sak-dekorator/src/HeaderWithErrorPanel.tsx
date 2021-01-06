import React, { FunctionComponent, useState, useMemo, useCallback, useEffect, useRef, RefObject } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import BoxedListWithLinks from '@navikt/boxed-list-with-links';
import Header from '@navikt/nap-header';
import Popover from '@navikt/nap-popover';
import SystemButton from '@navikt/nap-system-button';
import UserPanel from '@navikt/nap-user-panel';

import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from '@k9-sak-web/konstanter';
import rettskildeneIkonUrl from '@fpsak-frontend/assets/images/rettskildene.svg';
import systemrutineIkonUrl from '@fpsak-frontend/assets/images/rutine.svg';

import ErrorMessagePanel from './ErrorMessagePanel';
import Feilmelding from './feilmeldingTsType';

import messages from '../i18n/nb_NO.json';

import styles from './headerWithErrorPanel.less';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const useOutsideClickEvent = (
  erLenkepanelApent: boolean,
  setLenkePanelApent: (erApent: boolean) => void,
): RefObject<HTMLDivElement> => {
  const wrapperRef = useRef(null);
  const handleClickOutside = useCallback(
    event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setLenkePanelApent(false);
      }
    },
    [wrapperRef.current],
  );

  useEffect(() => {
    if (erLenkepanelApent) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [erLenkepanelApent]);

  return wrapperRef;
};

const isRunningOnLocalhost = () => window.location.hostname === 'localhost';
const getHeaderTitleHref = getPathToFplos => {
  if (!isRunningOnLocalhost()) {
    return getPathToFplos() || '/k9/web';
  }
  return '/k9/web';
};

interface OwnProps {
  navAnsattName?: string;
  removeErrorMessage: () => void;
  errorMessages?: Feilmelding[];
  setSiteHeight: (height: number) => void;
  getPathToFplos: () => void;
}

/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene og systemrutinen.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel: FunctionComponent<OwnProps> = ({
  navAnsattName = '',
  removeErrorMessage,
  errorMessages = [],
  setSiteHeight,
  getPathToFplos,
}) => {
  const [erLenkepanelApent, setLenkePanelApent] = useState(false);
  const wrapperRef = useOutsideClickEvent(erLenkepanelApent, setLenkePanelApent);

  const fixedHeaderRef = useRef<any>();
  useEffect(() => {
    setSiteHeight(fixedHeaderRef.current.clientHeight);
  }, [errorMessages.length]);

  const iconLinks = useMemo(
    () => [
      {
        url: RETTSKILDE_URL,
        icon: rettskildeneIkonUrl,
        text: intl.formatMessage({ id: 'HeaderWithErrorPanel.Rettskilde' }),
      },
      {
        url: SYSTEMRUTINE_URL,
        icon: systemrutineIkonUrl,
        text: intl.formatMessage({ id: 'HeaderWithErrorPanel.Systemrutine' }),
      },
    ],
    [],
  );

  const lenkerFormatertForBoxedList = useMemo(
    () =>
      iconLinks.map(link => ({
        name: link.text,
        href: link.url,
        isExternal: true,
      })),
    [],
  );
  const popperPropsChildren = useCallback(
    () => (
      <BoxedListWithLinks
        items={lenkerFormatertForBoxedList}
        onClick={() => {
          setLenkePanelApent(false);
        }}
      />
    ),
    [],
  );
  const referencePropsChildren = useCallback(
    ({ ref }) => (
      <div ref={ref}>
        <SystemButton
          onClick={() => {
            setLenkePanelApent(!erLenkepanelApent);
          }}
          isToggled={erLenkepanelApent}
        />
      </div>
    ),
    [erLenkepanelApent],
  );

  return (
    <header ref={fixedHeaderRef} className={styles.container}>
      <RawIntlProvider value={intl}>
        <div ref={wrapperRef}>
          <Header
            title={intl.formatMessage({ id: 'HeaderWithErrorPanel.Ytelse' })}
            titleHref={getHeaderTitleHref(getPathToFplos)}
          >
            <Popover
              popperIsVisible={erLenkepanelApent}
              renderArrowElement
              customPopperStyles={{ top: '11px', zIndex: 1 }}
              popperProps={{
                children: popperPropsChildren,
                placement: 'bottom-start',
                positionFixed: true,
              }}
              referenceProps={{
                children: referencePropsChildren,
              }}
            />
            <UserPanel name={navAnsattName} />
          </Header>
        </div>
        <ErrorMessagePanel removeErrorMessage={removeErrorMessage} errorMessages={errorMessages} />
      </RawIntlProvider>
    </header>
  );
};

export default HeaderWithErrorPanel;
