import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from '@k9-sak-web/konstanter';
import Endringslogg from '@navikt/familie-endringslogg';
import { BoxedListWithLinks, Header, Popover, SystemButton, UserPanel } from '@navikt/ft-plattform-komponenter';
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import { useLocation } from 'react-router';
import messages from '../i18n/nb_NO.json';
import ErrorMessagePanel from './ErrorMessagePanel';
import Feilmelding from './feilmeldingTsType';
import styles from './headerWithErrorPanel.module.css';

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
  window.location.hostname === 'localhost' ||
  window.location.hostname === 'app-q1.adeo.no' ||
  window.location.hostname === 'k9.dev.intern.nav.no';
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
  getPathToK9Punsj: () => string | null;
  ainntektPath: string;
  aaregPath: string;
}

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
  getPathToK9Punsj,
  ainntektPath,
  aaregPath,
}: OwnProps) => {
  const [erLenkepanelApent, setLenkePanelApent] = useState(false);
  const wrapperRef = useOutsideClickEvent(erLenkepanelApent, setLenkePanelApent);
  const location = useLocation();

  const fixedHeaderRef = useRef<any>();
  useEffect(() => {
    setSiteHeight(fixedHeaderRef.current.clientHeight);
  }, [errorMessages.length]);

  const lenkerFormatertForBoxedList = [
    {
      name: intl.formatMessage({ id: 'HeaderWithErrorPanel.AInntekt' }),
      href: ainntektPath,
      isExternal: true,
    },
    {
      name: intl.formatMessage({ id: 'HeaderWithErrorPanel.AAReg' }),
      href: aaregPath,
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
    {
      name: intl.formatMessage({ id: 'HeaderWithErrorPanel.Punsj' }),
      href: getPathToK9Punsj(),
      isExternal: true,
    },
  ];

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

  const skalViseEndringslogg = !location.pathname.includes('/close') && !!navBrukernavn;

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
            {/*
            Går mot en backend som foreldrepenger styrer.
            https://github.com/navikt/familie-endringslogg
            For å nå backend lokalt må man være tilkoblet naisdevice og kjøre opp k9-sak-web på port 8000 pga CORS
            */}
            {skalViseEndringslogg && (
              <div className={styles['endringslogg-container']}>
                <Endringslogg
                  userId={navBrukernavn}
                  appId="K9_SAK"
                  appName="K9 Sak"
                  backendUrl="/k9/endringslogg"
                  stil="lys"
                  alignLeft
                  maxEntries={20}
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
