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
      ErrorMessage.withMessage(
        'Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.',
        { systemMelding: errorMessages[0].message },
      ),
      ErrorMessage.withMessage('Serverkall har gått ut på tid: url', { systemMelding: errorMessages[1].message }),
    ]);
  });
});
