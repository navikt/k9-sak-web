import DefaultFormatter from './DefaultFormatter';
import ErrorMessage from './ErrorMessage';

describe('DefaultFormatter', () => {
  it('skal formatere feil der en har feilmelding i et objekt', () => {
    const errorData = {
      feilmelding: 'Dette er feil',
      type: 'test',
    };
    expect(new DefaultFormatter().format(errorData)).toEqual(
      ErrorMessage.withMessage(errorData.feilmelding, errorData.type),
    );
  });

  it('skal formatere feil der en har message i et objekt', () => {
    const errorData = {
      message: 'Dette er feil',
      type: 'test',
    };
    expect(new DefaultFormatter().format(errorData)).toEqual(
      ErrorMessage.withMessage(errorData.message, errorData.type),
    );
  });

  it('skal formatere feil der data er en streng', () => {
    const errorData = 'Dette er feil';
    expect(new DefaultFormatter().formatString(errorData)).toEqual(ErrorMessage.withMessage(errorData));
  });
});
