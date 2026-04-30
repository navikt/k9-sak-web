import { formatErrorMessage, ErrorMessage } from './formatErrorMessages';
import { EventType } from '@k9-sak-web/rest-api';

describe('ErrorFormatter', () => {
  it('skal formatere feil med status HALTED', () => {
    const errorMessage = {
      type: EventType.POLLING_HALTED_OR_DELAYED,
      message: 'halted',
      status: 'HALTED',
      eta: '2019-01-01',
    };

    expect(formatErrorMessage(errorMessage)).toEqual(
      ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        errorMessage.type,
        { systemMelding: errorMessage.message },
      ),
    );
  });

  it('skal formatere feil med status DELAYED', () => {
    const errorMessage = {
      type: EventType.POLLING_HALTED_OR_DELAYED,
      message: 'venter',
      status: 'DELAYED',
      eta: '2018-08-02T00:54:25.455',
    };

    expect(formatErrorMessage(errorMessage)).toEqual(
      ErrorMessage.withMessage(
        'Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen 02.08.2018 kl. 00:54.',
        errorMessage.type,
        { systemMelding: errorMessage.message },
      ),
    );
  });

  it('skal formatere feil når en har fått timeout', () => {
    const errorMessage = {
      type: EventType.POLLING_TIMEOUT,
      message: 'timeout',
      location: 'url',
    };

    expect(formatErrorMessage(errorMessage)).toEqual(
      ErrorMessage.withMessage('Serverkall har gått ut på tid: url', errorMessage.type, {
        systemMelding: errorMessage.message,
      }),
    );
  });

  it('skal formatere feil når en har fått gateway timeout eller not found', () => {
    const errorMessage = {
      type: EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND,
      message: 'not found',
      location: '/k9-sak/api/test',
    };

    expect(formatErrorMessage(errorMessage)).toEqual(
      ErrorMessage.withMessage('Får ikke kontakt med K9-SAK (/k9-sak/api/test)', errorMessage.type),
    );
  });

  it('skal formatere feil med feilmelding via default formatter når type ikke matcher', () => {
    const errorMessage = {
      type: 'UKJENT_TYPE' as any,
      feilmelding: 'Dette er feil',
    };

    expect(formatErrorMessage(errorMessage)).toEqual(ErrorMessage.withMessage('Dette er feil', errorMessage.type));
  });

  it('skal formatere feil med message via default formatter når type ikke matcher', () => {
    const errorMessage = {
      type: 'UKJENT_TYPE' as any,
      message: 'Dette er en annen feil',
    };

    expect(formatErrorMessage(errorMessage)).toEqual(
      ErrorMessage.withMessage('Dette er en annen feil', errorMessage.type),
    );
  });

  it('skal returnere undefined for ukjent melding uten tekst', () => {
    const errorMessage = { type: 'UKJENT_TYPE' } as any;
    expect(formatErrorMessage(errorMessage)).toBeUndefined();
  });
});
