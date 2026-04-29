import RestHaltedOrDelayedFormatter from './RestHaltedOrDelayedFormatter';
import ErrorMessage from './ErrorMessage';
import ErrorEventType from './errorEventType';

describe('RestHaltedOrDelayedFormatter', () => {
  it('skal håndtere feil når feildata er av korrekt type', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(new RestHaltedOrDelayedFormatter().isOfType(ErrorEventType.POLLING_HALTED_OR_DELAYED)).toBe(true);
  });

  it('skal ikke håndtere feil når feildata er av annen type', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(new RestHaltedOrDelayedFormatter().isOfType(ErrorEventType.POLLING_TIMEOUT)).toBe(false);
  });

  it('skal formatere feil når en har status HALTED', () => {
    const errorData = {
      message: 'venter',
      status: 'HALTED',
      eta: '2018-08-02T00:54:25.455',
      type: ErrorEventType.POLLING_HALTED_OR_DELAYED,
    };
    expect(new RestHaltedOrDelayedFormatter().format(errorData)).toEqual(
      ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        { systemMelding: errorData.message },
      ),
    );
  });

  it('skal formatere feil når en har status DELAYED', () => {
    const errorData = {
      message: 'venter',
      status: 'DELAYED',
      eta: '2018-08-02T00:54:25.455',
      type: ErrorEventType.POLLING_HALTED_OR_DELAYED,
    };
    expect(new RestHaltedOrDelayedFormatter().format(errorData)).toEqual(
      ErrorMessage.withMessage(
        `Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen 02.08.2018 kl. 00:54.`,
        { systemMelding: errorData.message },
      ),
    );
  });
});
