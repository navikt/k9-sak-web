import { Feilmelding } from '@k9-sak-web/gui/sak/dekoratør/feilmeldingTsType.js';
import HeaderWithErrorPanel from '@k9-sak-web/gui/sak/dekoratør/HeaderWithErrorPanel.js';
import { InnloggetAnsattContext } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattContext.js';
import { AAREG_URL } from '@k9-sak-web/konstanter';
import { useRestApiError, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import ErrorFormatter from '@k9-sak-web/sak-app/src/app/feilhandtering/ErrorFormatter';
import ErrorMessage from '@k9-sak-web/sak-app/src/app/feilhandtering/ErrorMessage';
import { use, useMemo } from 'react';

type QueryStrings = {
  errorcode?: string;
  errormessage?: string;
};

// Feilmeldingsmaler som tidligere lå i public/sprak/nb_NO.json
const feilmeldingsmaler: Record<string, (params?: Record<string, string>) => string> = {
  'Rest.ErrorMessage.General': () =>
    'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
  'Rest.ErrorMessage.DownTime': p =>
    `Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen ${p?.date ?? ''} kl. ${p?.time ?? ''}.\n${p?.message ?? ''}`,
  'Rest.ErrorMessage.PollingTimeout': p => `Serverkall har gått ut på tid: ${p?.location ?? ''}`,
  'Rest.ErrorMessage.GatewayTimeoutOrNotFound': p =>
    `Får ikke kontakt med ${p?.contextPath ?? ''} (${p?.location ?? ''})`,
};

const formaterFeilmelding = (code: string, params?: Record<string, string>): string => {
  const mal = feilmeldingsmaler[code];
  return mal ? mal(params) : code;
};

const lagFeilmeldinger = (errorMessages: ErrorMessage[], queryStrings: QueryStrings): Feilmelding[] => {
  const resolvedErrorMessages: Feilmelding[] = [];
  if (queryStrings.errorcode) {
    resolvedErrorMessages.push({ message: formaterFeilmelding(queryStrings.errorcode) });
  }
  if (queryStrings.errormessage) {
    resolvedErrorMessages.push({ message: queryStrings.errormessage });
  }
  errorMessages.forEach(message => {
    let msg = {
      message: message.code ? formaterFeilmelding(message.code, message.params) : message.text,
      additionalInfo: undefined,
    };
    if (message.params && message.params.errorDetails) {
      msg = {
        ...msg,
        additionalInfo: JSON.parse(message.params.errorDetails),
      };
    }
    resolvedErrorMessages.push(msg);
  });
  return resolvedErrorMessages;
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

  const errorMessages = useRestApiError() || EMPTY_ARRAY;
  const formaterteFeilmeldinger = useMemo(() => new ErrorFormatter().format(errorMessages), [errorMessages]);

  const resolvedErrorMessages = useMemo(
    () => lagFeilmeldinger(formaterteFeilmeldinger, queryStrings),
    [formaterteFeilmeldinger, queryStrings],
  );

  const { removeErrorMessages } = useRestApiErrorDispatcher();

  return (
    <HeaderWithErrorPanel
      navAnsattName={navAnsatt.navn ?? navAnsatt?.brukernavn}
      navBrukernavn={navAnsatt.brukernavn}
      removeErrorMessage={removeErrorMessages}
      errorMessages={hideErrorMessages ? EMPTY_ARRAY : resolvedErrorMessages}
      setSiteHeight={setSiteHeight}
      aaregPath={getAaregPath()}
      ytelse="Ungdomsprogramytelse"
      headerTitleHref="/ung/web"
      showEndringslogg={false}
    />
  );
};

export default Dekorator;
