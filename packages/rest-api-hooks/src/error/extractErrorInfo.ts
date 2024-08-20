import { AxiosError } from 'axios';

interface ErrorInfo {
  navCallId: string | undefined;
  statusCode: number | undefined;
}

/**
 * Kan brukast for å hente ut meta informasjon frå AxiosError som har skjedd.
 * Brukast for å vise referanse i feilmelding til bruker, slik at denne kan inkluderast i evt feilmelding vidare.
 *
 * @param error feil som har oppstått
 * @returns objekt med Nav-Callid string og http status kode for respons viss denne info finnast.
 */
export const extractErrorInfo = (error: unknown): Readonly<ErrorInfo> => {
  const resp: ErrorInfo = {
    navCallId: undefined,
    statusCode: undefined,
  };
  if (error instanceof AxiosError) {
    const callId = error.config.headers.get('Nav-Callid');
    if (typeof callId === 'string') {
      resp.navCallId = callId;
    }
    resp.statusCode = error.status;
  }
  return resp;
};
