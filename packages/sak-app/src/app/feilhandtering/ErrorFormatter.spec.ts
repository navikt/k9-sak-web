import { formatErrorMessages } from './ErrorFormatter';
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
      ErrorMessage.withMessageCode('Rest.ErrorMessage.General', { errorDetails: 'halted' }),
      ErrorMessage.withMessageCode('Rest.ErrorMessage.PollingTimeout', errorMessages[1]),
    ]);
  });
});
