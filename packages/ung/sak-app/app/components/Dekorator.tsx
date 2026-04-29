import { Feilmelding } from '@k9-sak-web/gui/sak/dekoratør/feilmeldingTsType.js';
import HeaderWithErrorPanel from '@k9-sak-web/gui/sak/dekoratør/HeaderWithErrorPanel.js';
import { InnloggetAnsattContext } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattContext.js';
import { isAktivitetspenger } from '@k9-sak-web/gui/utils/urlUtils.js';
import { AAREG_URL } from '@k9-sak-web/konstanter';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
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

const EMPTY_ARRAY = [];

interface OwnProps {
  queryStrings: QueryStrings;
  hideErrorMessages?: boolean;
  setSiteHeight: (headerHeight: number) => void;
  pathname: string;
}

const Dekorator = ({ queryStrings, setSiteHeight, pathname, hideErrorMessages = false }: OwnProps) => {
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

  const formaterteFeilmeldinger = useRestApiError() || EMPTY_ARRAY;
  const resolvedErrorMessages: Feilmelding[] = formaterteFeilmeldinger.map(fm => ({
    message: fm.text,
    additionalInfo: fm.extra,
  }));

  const { removeErrorMessages } = useRestApiErrorDispatcher();
  const ytelse = getYtelseNavn();

  return (
    <>
      <HeaderWithErrorPanel
        navAnsattName={navAnsatt.navn ?? navAnsatt?.brukernavn}
        navBrukernavn={navAnsatt.brukernavn}
        removeErrorMessage={removeErrorMessages}
        errorMessages={hideErrorMessages ? EMPTY_ARRAY : resolvedErrorMessages}
        setSiteHeight={setSiteHeight}
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
