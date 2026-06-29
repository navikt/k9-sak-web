import { sentryReportedErrorIdLookup, sentryReportedIdList } from '../sentry.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AxiosError } from 'axios';

const makeErrorReportLines = (errors: ReadonlyArray<Error>): ReadonlyArray<string> => {
  const errLines: string[] = [];
  errLines.push(`----`);
  errLines.push(`Teknisk info om feil (ref: ${sentryReportedIdList.join(', ')})`);
  for (const error of errors) {
    const sentryId = `sentry:${sentryReportedErrorIdLookup.get(error)}`;
    errLines.push(`*${error.name}* (${sentryId})`);
    errLines.push(`${error.message}`);
    if (error instanceof ExtendedApiError) {
      errLines.push(`NavCallid:${error.navCallid}`);
    }
    if (error instanceof AxiosError) {
      const callId = error.config?.headers.get('Nav-Callid');
      if (typeof callId === 'string') {
        errLines.push(`NavCallid:${callId}`);
      }
    }
    errLines.push('----');
  }
  return errLines;
};

export const makeErrorReportText = (errors: ReadonlyArray<Error>): string => {
  return makeErrorReportLines(errors).join('\n');
};

const makeErrorReportTextForJira = (errors: ReadonlyArray<Error>): string => {
  const errLines = [
    '', // Tom linje slik at ein enkelt kan fylle inn eigen info over forhåndsutfyllt teknisk info i jira feltet
    ...makeErrorReportLines(errors),
  ];
  return errLines.join('\\\\');
};

export const makeErrorReportLinkForJira = (errors: ReadonlyArray<Error>, fagsakId?: string): string => {
  const reportText = makeErrorReportTextForJira(errors);
  const saksIdUrlArgument =
    fagsakId != null && fagsakId.length > 2 && fagsakId.length <= 10
      ? `&customfield_21428=${encodeURIComponent(fagsakId)}`
      : ``;
  return `https://jira.adeo.no/plugins/servlet/desk/portal/541/create/3142?customfield_24712=30158${saksIdUrlArgument}&summary=Feilrapport+k9-sak-web&description=${encodeURIComponent(reportText)}`;
};
