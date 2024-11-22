import { RETTSKILDE_URL, SHAREPOINT_URL } from '@k9-sak-web/konstanter';
import { ExternalLinkIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import Endringslogg from '@navikt/familie-endringslogg';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import ErrorMessagePanel from './ErrorMessagePanel';
import type { Feilmelding } from './feilmeldingTsType';
import styles from './headerWithErrorPanel.module.css';

const isRunningOnLocalhost = () => window.location.hostname === 'localhost';
const isInDevelopmentModeOrTestEnvironment = () =>
  isRunningOnLocalhost() ||
  window.location.hostname === 'k9.dev.intern.nav.no' ||
  window.location.hostname === 'ung.intern.dev.nav.no';
const getHeaderTitleHref = (getPathToLos: () => string, headerTitleHref: string) => {
  if (!isRunningOnLocalhost()) {
    return getPathToLos() || headerTitleHref;
  }
  return headerTitleHref;
};

interface OwnProps {
  navAnsattName?: string;
  navBrukernavn?: string;
  removeErrorMessage: () => void;
  errorMessages?: Feilmelding[];
  setSiteHeight: (height: number) => void;
  getPathToLos: () => string;
  getPathToK9Punsj: () => string;
  ainntektPath: string;
  aaregPath: string;
  ytelse: string;
  headerTitleHref: string;
  showEndringslogg?: boolean;
}

/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel = ({
  navAnsattName = '',
  navBrukernavn,
  removeErrorMessage,
  errorMessages = [],
  setSiteHeight,
  getPathToLos,
  getPathToK9Punsj,
  ainntektPath,
  aaregPath,
  ytelse,
  headerTitleHref,
  showEndringslogg = true,
}: OwnProps) => {
  const location = useLocation();

  const fixedHeaderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (fixedHeaderRef?.current?.clientHeight) {
      setSiteHeight(fixedHeaderRef?.current?.clientHeight);
    }
  }, [errorMessages.length]);

  const skalViseEndringslogg = !location.pathname.includes('/close') && !!navBrukernavn && showEndringslogg;

  return (
    <div>
      <InternalHeader className={isInDevelopmentModeOrTestEnvironment() ? styles.containerDev : ''}>
        <InternalHeader.Title href={getHeaderTitleHref(getPathToLos, headerTitleHref)}>{ytelse}</InternalHeader.Title>
        <Spacer />
        {/*
            Går mot en backend som BAKS styrer.
            https://github.com/navikt/familie-endringslogg
            For å nå backend lokalt må man være tilkoblet naisdevice og kjøre opp k9-sak-web på port 8000 pga CORS
            */}
        {skalViseEndringslogg && (
          <div className={styles['endringsloggContainer']}>
            <Endringslogg
              userId={navBrukernavn}
              appId="K9_SAK"
              appName="K9 Sak"
              backendUrl="/k9/endringslogg"
              stil="lys"
              alignLeft
              maxEntries={150}
            />
          </div>
        )}
        <Dropdown>
          <InternalHeader.Button as={Dropdown.Toggle}>
            <MenuGridIcon style={{ fontSize: '1.5rem' }} title="Systemer og oppslagsverk" />
          </InternalHeader.Button>
          <Dropdown.Menu>
            <Dropdown.Menu.GroupedList>
              <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>
              <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href={ainntektPath}>
                A-inntekt <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href={aaregPath}>
                Aa-registeret <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href={RETTSKILDE_URL}>
                Rettskildene <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href={SHAREPOINT_URL}>
                Sharepoint <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href={getPathToK9Punsj()}>
                Punsj <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
            </Dropdown.Menu.GroupedList>
          </Dropdown.Menu>
        </Dropdown>
        <InternalHeader.User name={navAnsattName} />
      </InternalHeader>
      <ErrorMessagePanel removeErrorMessage={removeErrorMessage} errorMessages={errorMessages} />
    </div>
  );
};

export default HeaderWithErrorPanel;
