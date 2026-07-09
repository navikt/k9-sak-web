import RestTimeoutFormatter from './RestTimeoutFormatter';
import ErrorMessage from './ErrorMessage';
import ErrorEventType from './errorEventType';

describe('RestTimeoutFormatter', () => {
  it('skal håndtere feil når feildata er av korrekt type', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(new RestTimeoutFormatter().isOfType(ErrorEventType.POLLING_TIMEOUT)).toBe(true);
  });

  it('skal ikke håndtere feil når feildata er av annen type', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(new RestTimeoutFormatter().isOfType(ErrorEventType.POLLING_HALTED_OR_DELAYED)).toBe(false);
  });

  it('skal formatere feil når en har fått timeout', () => {
    const errorData = {
      type: ErrorEventType.POLLING_TIMEOUT,
      message: 'timeout',
      location: 'url',
    };
    expect(new RestTimeoutFormatter().format(errorData)).toEqual(
      ErrorMessage.withMessageCode('Rest.ErrorMessage.PollingTimeout', errorData),
    );
  });
});
