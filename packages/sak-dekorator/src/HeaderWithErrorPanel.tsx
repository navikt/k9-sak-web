import React, { useState, useCallback, useEffect, useRef, RefObject } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { BoxedListWithLinks, Header, Popover, SystemButton, UserPanel } from '@navikt/k9-react-components';
import Endringslogg from '@navikt/familie-endringslogg';

import { AINNTEKT_URL, AAREG_URL, RETTSKILDE_URL, SYSTEMRUTINE_URL } from '@k9-sak-web/konstanter';

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
const isInDevelopmentMode = () =>
  window.location.hostname === 'localhost' || window.location.hostname === 'app-q1.adeo.no';
const getHeaderTitleHref = getPathToFplos => {
  if (!isRunningOnLocalhost()) {
    return getPathToFplos() || '/k9/web';
  }
  return '/k9/web';
};

interface OwnProps {
  navAnsattName?: string;
  navBrukernavn?: string;
  removeErrorMessage: () => void;
  errorMessages?: Feilmelding[];
  setSiteHeight: (height: number) => void;
  getPathToFplos: () => void;
}

const lenkerFormatertForBoxedList = [
  {
    name: intl.formatMessage({ id: 'HeaderWithErrorPanel.AInntekt' }),
    href: AINNTEKT_URL,
    isExternal: true,
  },
  {
    name: intl.formatMessage({ id: 'HeaderWithErrorPanel.AAReg' }),
    href: AAREG_URL,
    isExternal: true,
  },
  {
    name: intl.formatMessage({ id: 'HeaderWithErrorPanel.Rettskilde' }),
    href: RETTSKILDE_URL,
    isExternal: true,
  },
  {
    name: intl.formatMessage({ id: 'HeaderWithErrorPanel.Systemrutine' }),
    href: SYSTEMRUTINE_URL,
    isExternal: true,
  },
];

/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene og systemrutinen.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel = ({
  navAnsattName = '',
  navBrukernavn,
  removeErrorMessage,
  errorMessages = [],
  setSiteHeight,
  getPathToFplos,
}: OwnProps) => {
  const [erLenkepanelApent, setLenkePanelApent] = useState(false);
  const wrapperRef = useOutsideClickEvent(erLenkepanelApent, setLenkePanelApent);

  const fixedHeaderRef = useRef<any>();
  useEffect(() => {
    setSiteHeight(fixedHeaderRef.current.clientHeight);
  }, [errorMessages.length]);

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
    <div
      ref={fixedHeaderRef}
      className={[styles.container, isInDevelopmentMode() ? styles.container_dev : ''].join(' ')}
    >
      <RawIntlProvider value={intl}>
        <div ref={wrapperRef}>
          <Header
            title={intl.formatMessage({ id: 'HeaderWithErrorPanel.Ytelse' })}
            titleHref={getHeaderTitleHref(getPathToFplos)}
          >
            {navBrukernavn && (
              <div className={styles['endringslogg-container']}>
                <Endringslogg
                  userId={navBrukernavn}
                  appId="K9_SAK"
                  appName="k9-sak-web"
                  backendUrl={process.env.ENDRINGSLOGG_URL}
                  stil="lys"
                  alignLeft
                />
              </div>
            )}
            <Popover
              popperIsVisible={erLenkepanelApent}
              renderArrowElement
              customPopperStyles={{ top: '11px', zIndex: 1 }}
              popperProps={{
                children: popperPropsChildren,
                placement: 'bottom-start',
                strategy: 'fixed',
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
    </div>
  );
};

export default HeaderWithErrorPanel;
