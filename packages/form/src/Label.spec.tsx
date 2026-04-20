import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { Label } from './Label';

describe('<Label>', () => {
  it('skal ikke formatere input hvis den er en node', () => {
    renderWithIntl(<Label input="Hei" />, { messages: { intlIdForHei: 'Hei sveis' } });
    expect(screen.getByText('Hei')).toBeInTheDocument();
  });

  it('skal formatere input hvis den er en meldingsdefinisjon', () => {
    renderWithIntl(<Label input={{ id: 'intlIdForHei' }} />, { messages: { intlIdForHei: 'Hei' } });
    expect(screen.getByText('Hei')).toBeInTheDocument();
  });

  it('skal rendre null hvis input er tom', () => {
    const { container } = renderWithIntl(<Label />);
    expect(container).toBeEmptyDOMElement();
  });
});
