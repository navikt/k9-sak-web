import { render, screen } from '@testing-library/react';
import AksjonspunktHelpText from './AksjonspunktHelpText';

describe('AksjonspunktHelpText', () => {
  test('renders null when no children are provided', () => {
    const { container } = render(<AksjonspunktHelpText isAksjonspunktOpen={false} children={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders closed action points correctly', () => {
    render(<AksjonspunktHelpText isAksjonspunktOpen={false} children={['Action point 1', 'Action point 2']} />);
    expect(screen.getByText('Behandlet aksjonspunkt:')).toBeInTheDocument();
    expect(screen.getByText('Action point 1')).toBeInTheDocument();
    expect(screen.getByText('Action point 2')).toBeInTheDocument();
  });

  test('renders open action points correctly', () => {
    render(<AksjonspunktHelpText isAksjonspunktOpen={true} children={['Action point 1', 'Action point 2']} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Action point 1')).toBeInTheDocument();
    expect(screen.getByText('Action point 2')).toBeInTheDocument();
  });
});
