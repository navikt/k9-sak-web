import { TopErrorPanel } from '@k9-sak-web/gui/app/errorhandling/ui/TopErrorPanel.js';
import { HeaderPanel } from '@k9-sak-web/gui/sak/dekoratør/HeaderPanel.js';
import { isAktivitetspenger } from '@k9-sak-web/gui/utils/urlUtils.js';
import { AAREG_URL } from '@k9-sak-web/konstanter';
import * as Sentry from '@sentry/react';
import { useInnloggetBrukerNavn } from '../../data/useNavAnsattForYtelse.js';

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
  const { brukernavn, navn } = useInnloggetBrukerNavn();
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
        navAnsattName={navn || brukernavn}
        navBrukernavn={brukernavn}
        aaregPath={getAaregPath()}
        ytelse={ytelse}
        headerTitleHref="/ung/web"
        showEndringslogg={false}
      />
      <TopErrorPanel aktivFagsakId={fagsakFraUrl} />
    </>
  );
};

export default Dekorator;
