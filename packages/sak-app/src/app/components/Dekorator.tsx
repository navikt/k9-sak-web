import { HeaderPanel } from '@k9-sak-web/gui/sak/dekoratør/HeaderPanel.js';
import { InnloggetAnsattContext } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattContext.js';
import { AAREG_URL, AINNTEKT_URL } from '@k9-sak-web/konstanter';
import { use } from 'react';
import { getPathToK9Los, getPathToK9Punsj } from '../paths';
import { TopErrorPanel } from '@k9-sak-web/gui/app/errorhandling/ui/TopErrorPanel.js';
import * as Sentry from '@sentry/react';

type QueryStrings = {
  errorcode?: string;
  errormessage?: string;
};

interface OwnProps {
  queryStrings: QueryStrings;
  pathname: string;
}

const Dekorator = ({ queryStrings, pathname }: OwnProps) => {
  const navAnsatt = use(InnloggetAnsattContext);
  const fagsakFraUrl = pathname.split('/fagsak/')[1]?.split('/')[0];
  const isFagsakFraUrlValid = fagsakFraUrl?.match(/^[a-zA-Z0-9]{1,19}$/);

  const getAinntektPath = () => {
    const ainntektPath = '/k9/sak/api/register/redirect-to/a-inntekt';
    if (!isFagsakFraUrlValid) {
      return AINNTEKT_URL;
    }
    return `${ainntektPath}?saksnummer=${fagsakFraUrl}`;
  };

  const getAaregPath = () => {
    const aaregPath = '/k9/sak/api/register/redirect-to/aa-reg';
    if (!isFagsakFraUrlValid) {
      return AAREG_URL;
    }
    return `${aaregPath}?saksnummer=${fagsakFraUrl}`;
  };

  // Denne koden kan fjernast viss vi ikkje har fått advarsler i sentry ei stund etter utrulling.
  if (queryStrings.errorcode) {
    const msg = `Dekorator queryString.errorcode satt (${queryStrings.errorcode}). Ikke støttet lenger`;
    console.warn(msg);
    Sentry.logger.warn(msg);
  }
  if (queryStrings.errormessage) {
    const msg = `Dekorator queryString.errormessage satt (${queryStrings.errormessage}). Ikke støttet lenger`;
    console.warn(msg);
    Sentry.logger.warn(msg);
  }

  return (
    <>
      <HeaderPanel
        navAnsattName={navAnsatt?.navn}
        navBrukernavn={navAnsatt?.brukernavn}
        getPathToLos={getPathToK9Los}
        getPathToK9Punsj={getPathToK9Punsj}
        ainntektPath={getAinntektPath()}
        aaregPath={getAaregPath()}
        ytelse="Pleiepenger, Omsorgspenger og Opplæringspenger"
        headerTitleHref="/k9/web"
      />
      <TopErrorPanel />
    </>
  );
};

export default Dekorator;
