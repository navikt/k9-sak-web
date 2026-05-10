import { HeaderPanel } from '@k9-sak-web/gui/sak/dekoratør/HeaderPanel.js';
import { InnloggetAnsattContext } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattContext.js';
import { isAktivitetspenger } from '@k9-sak-web/gui/utils/urlUtils.js';
import { AAREG_URL } from '@k9-sak-web/konstanter';
import { use } from 'react';
import { TopErrorPanel } from '@k9-sak-web/gui/app/errorhandling/ui/TopErrorPanel.js';
import * as Sentry from '@sentry/react';

const getYtelseNavn = (): string => {
  if (isAktivitetspenger()) {
    return 'Aktivitetspenger';
  }
  return 'Ungdomsprogramytelse';
};

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

  const getAaregPath = () => {
    const aaregPath = '/ung/sak/api/register/redirect-to/aa-reg';
    if (!isFagsakFraUrlValid) {
      return AAREG_URL;
    }
    return `${aaregPath}?saksnummer=${fagsakFraUrl}`;
  };

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
  const ytelse = getYtelseNavn();

  return (
    <>
      <HeaderPanel
        navAnsattName={navAnsatt.navn ?? navAnsatt?.brukernavn}
        navBrukernavn={navAnsatt.brukernavn}
        aaregPath={getAaregPath()}
        ytelse={ytelse}
        headerTitleHref="/ung/web"
        showEndringslogg={false}
      />
      <TopErrorPanel />
    </>
  );
};

export default Dekorator;
