import { BigError, DefaultErrorMsg } from '@k9-sak-web/gui/sak/feilmeldinger/BigError.js';
import { NavCallIdEncouragementMsg } from '../../app/alerts/NavCallIdEncouragementMsg.js';

export interface NetworkErrorPageProps {
  readonly navCallId?: string;
  readonly statusCode?: number;
}

const NetworkErrorPage = ({ navCallId, statusCode = 0 }: NetworkErrorPageProps) => {
  return (
    <BigError title="Feil ved henting/sending av data">
      <DefaultErrorMsg />
      <p>
        <NavCallIdEncouragementMsg navCallId={navCallId} statusCode={statusCode} />
      </p>
    </BigError>
  );
};

export default NetworkErrorPage;
