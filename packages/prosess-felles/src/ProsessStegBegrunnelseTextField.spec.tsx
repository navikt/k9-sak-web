import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import ProsessStegBegrunnelseTextField from './ProsessStegBegrunnelseTextField';

describe('<ProsessStegBegrunnelseTextField>', () => {
  it('skal vise tekstfelt som ikke readOnly', () => {
    renderWithIntlAndReduxForm(<ProsessStegBegrunnelseTextField readOnly={false} />, { messages });

    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).not.toBeDisabled();
  });

  it('skal ikke vise tekstfelt ved readOnly', () => {
    renderWithIntlAndReduxForm(<ProsessStegBegrunnelseTextField readOnly />, { messages });

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise default tekstkode', () => {
    renderWithIntlAndReduxForm(<ProsessStegBegrunnelseTextField readOnly={false} />, { messages });
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
  });

  it('skal vise gitt tekstkode', () => {
    renderWithIntlAndReduxForm(<ProsessStegBegrunnelseTextField readOnly={false} text="Beskrivelse" />, { messages });

    expect(screen.getByRole('textbox', { name: 'Beskrivelse' })).toBeInTheDocument();
  });

  it('skal hente begrunnelse fra første aksjonspunkt', () => {
    const aksjonspunkter = [
      {
        begrunnelse: 'test &amp;',
      },
    ] as Aksjonspunkt[];
    const initalValues = ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter);
    expect(initalValues).toEqual({ begrunnelse: 'test &' });
  });
});
