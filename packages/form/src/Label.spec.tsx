import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Label } from './Label';

const FORMATTED_MESSAGE = 'En formatert melding';
const intl = { ...intlMock, formatMessage: () => FORMATTED_MESSAGE };

describe('<Label>', () => {
  it('skal ikke formatere input hvis den er en node', () => {
    render(<Label input="Hei" intl={intl} />);
    expect(screen.getByText('Hei')).toBeInTheDocument();
  });

  it('skal formatere input hvis den er en meldingsdefinisjon', () => {
    render(<Label input={{ id: 'Hei' }} intl={intl} />);
    expect(screen.getByText(FORMATTED_MESSAGE)).toBeInTheDocument();
  });

  it('skal rendre null hvis input er tom', () => {
    const { container } = render(<Label intl={intl} />);
    expect(container).toBeEmptyDOMElement();
  });
});
