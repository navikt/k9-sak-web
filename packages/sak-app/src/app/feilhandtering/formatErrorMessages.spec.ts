import { formatErrorMessages } from './formatErrorMessages';
import ErrorMessage from './ErrorMessage';
import ErrorEventType from './errorEventType';

describe('ErrorFormatter', () => {
  it('skal legge til både crashmessage og flere feil av ulik type til de formaterte feilene', () => {
    const errorMessages = [
      {
        type: ErrorEventType.POLLING_HALTED_OR_DELAYED,
        message: 'halted',
        status: 'HALTED',
        eta: '2019-01-01',
      },
      {
        type: ErrorEventType.POLLING_TIMEOUT,
        message: 'timeout',
        location: 'url',
      },
    ];

    expect(formatErrorMessages(errorMessages)).toEqual([
      ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        { systemMelding: errorMessages[0].message },
      ),
      ErrorMessage.withMessage('Serverkall har gått ut på tid: url', { systemMelding: errorMessages[1].message }),
    ]);
  });

  it('skal returnere tom liste når ingen feilmeldinger er gitt', () => {
    expect(formatErrorMessages([])).toEqual([]);
  });

  it('skal formatere feil med status HALTED', () => {
    const errorMessages = [
      {
        type: ErrorEventType.POLLING_HALTED_OR_DELAYED,
        message: 'halted',
        status: 'HALTED',
        eta: '2019-01-01',
      },
    ];

    expect(formatErrorMessages(errorMessages)).toEqual([
      ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        { systemMelding: errorMessages[0].message },
      ),
    ]);
  });

  it('skal formatere feil med status DELAYED', () => {
    const errorMessages = [
      {
        type: ErrorEventType.POLLING_HALTED_OR_DELAYED,
        message: 'venter',
        status: 'DELAYED',
        eta: '2018-08-02T00:54:25.455',
      },
    ];

    expect(formatErrorMessages(errorMessages)).toEqual([
      ErrorMessage.withMessage(
        'Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen 02.08.2018 kl. 00:54.',
        { systemMelding: errorMessages[0].message },
      ),
    ]);
  });

  it('skal formatere feil når en har fått timeout', () => {
    const errorMessages = [
      {
        type: ErrorEventType.POLLING_TIMEOUT,
        message: 'timeout',
        location: 'url',
      },
    ];

    expect(formatErrorMessages(errorMessages)).toEqual([
      ErrorMessage.withMessage('Serverkall har gått ut på tid: url', { systemMelding: errorMessages[0].message }),
    ]);
  });

  it('skal formatere feil når en har fått gateway timeout eller not found', () => {
    const errorMessages = [
      {
        type: ErrorEventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND,
        message: 'not found',
        location: '/k9-sak/api/test',
      },
    ];

    expect(formatErrorMessages(errorMessages)).toEqual([
      ErrorMessage.withMessage('Får ikke kontakt med K9-SAK (/k9-sak/api/test)'),
    ]);
  });

  it('skal formatere feil med feilmelding via default formatter når type ikke matcher', () => {
    const errorMessages = [
      {
        type: 'UKJENT_TYPE' as any,
        feilmelding: 'Dette er feil',
      },
    ];

    expect(formatErrorMessages(errorMessages)).toEqual([ErrorMessage.withMessage('Dette er feil')]);
  });

  it('skal formatere feil med message via default formatter når type ikke matcher', () => {
    const errorMessages = [
      {
        type: 'UKJENT_TYPE' as any,
        message: 'Dette er en annen feil',
      },
    ];

    expect(formatErrorMessages(errorMessages)).toEqual([ErrorMessage.withMessage('Dette er en annen feil')]);
  });
});
