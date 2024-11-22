import { render, screen } from '@testing-library/react';
import FaktaBegrunnelseTextField from './FaktaBegrunnelseTextField';

describe('<FaktaBegrunnelseTextField>', () => {
  it('skal ikke vise tekstfelt når en ikke har lov til å løse aksjonspunkt', () => {
    render(<FaktaBegrunnelseTextField isReadOnly={false} isSubmittable={false} hasBegrunnelse={false} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise tekstfelt når en har lov til å løse aksjonspunkt og en har gjort endringer', () => {
    render(<FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} />);

    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });

  it('skal ikke vise inputfelt når readOnly', () => {
    render(<FaktaBegrunnelseTextField isReadOnly isSubmittable hasBegrunnelse={false} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise standard-label når en ikke har valgt å vise vurderingstekst eller sende med tekstkode', () => {
    render(<FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} />);

    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });

  it('skal vise label for vurdering når dette er markert av prop', () => {
    render(<FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} hasVurderingText />);

    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
  });

  it('skal vise medsendt label', () => {
    render(<FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} label="Test" />);

    expect(screen.getByRole('textbox', { name: 'Test' })).toBeInTheDocument();
  });
});
