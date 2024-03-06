import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import FaktaBegrunnelseTextField from './FaktaBegrunnelseTextField';

describe('<FaktaBegrunnelseTextField>', () => {
  it('skal ikke vise tekstfelt når en ikke har lov til å løse aksjonspunkt', () => {
    renderWithIntlAndReduxForm(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable={false} hasBegrunnelse={false} />,
      { messages },
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise tekstfelt når en har lov til å løse aksjonspunkt og en har gjort endringer', () => {
    renderWithIntlAndReduxForm(<FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} />, {
      messages,
    });

    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });

  it('skal ikke vise inputfelt når readOnly', () => {
    renderWithIntlAndReduxForm(<FaktaBegrunnelseTextField isReadOnly isSubmittable hasBegrunnelse={false} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise standard-label når en ikke har valgt å vise vurderingstekst eller sende med tekstkode', () => {
    renderWithIntlAndReduxForm(<FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} />, {
      messages,
    });

    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });

  it('skal vise label for vurdering når dette er markert av prop', () => {
    renderWithIntlAndReduxForm(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} hasVurderingText />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
  });

  it('skal vise medsendt label', () => {
    renderWithIntlAndReduxForm(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} label="Test" />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Test' })).toBeInTheDocument();
  });
});
