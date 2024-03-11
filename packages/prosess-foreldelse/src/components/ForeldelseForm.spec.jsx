import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { ForeldelseForm } from './ForeldelseForm';

const alleKodeverk = {
  ForeldelseVurderingType: [
    {
      kode: foreldelseVurderingType.IKKE_FORELDET,
      navn: 'Ikke foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
    {
      kode: foreldelseVurderingType.FORELDET,
      navn: 'Foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
  ],
};

describe('<ForeldelseForm>', () => {
  it('skal vise informasjon om foreldelsesloven og ikke vise tidslinje når en ikke har aksjonspunkt', () => {
    const perioder = [
      {
        fom: '2019-10-10',
        tom: '2019-11-10',
        foreldelseVurderingType: {
          kode: foreldelseVurderingType.UDEFINERT,
        },
      },
    ];
    renderWithIntlAndReduxForm(
      <ForeldelseForm
        foreldelsesresultatActivity={perioder}
        behandlingFormPrefix="form"
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
        navBrukerKjonn="MANN"
        readOnly={false}
        readOnlySubmitButton={false}
        merknaderFraBeslutter={{
          notAccepted: false,
        }}
        alleKodeverk={{}}
        beregnBelop={vi.fn()}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.queryByText('Forrige periode')).not.toBeInTheDocument();
    expect(screen.getByText('Foreldelsesloven §§ 2 og 3')).toBeInTheDocument();
  });

  it('skal ikke vise informasjon om foreldelsesloven og vise tidslinje når en har aksjonspunkt', () => {
    const perioder = [
      {
        fom: '2019-10-10',
        tom: '2019-11-10',
        foreldelseVurderingType: {
          kode: foreldelseVurderingType.UDEFINERT,
        },
      },
    ];
    renderWithIntlAndReduxForm(
      <ForeldelseForm
        foreldelsesresultatActivity={perioder}
        behandlingFormPrefix="form"
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
        navBrukerKjonn="MANN"
        readOnly={false}
        readOnlySubmitButton={false}
        merknaderFraBeslutter={{
          notAccepted: false,
        }}
        apCodes={['5003']}
        alleKodeverk={alleKodeverk}
        beregnBelop={vi.fn()}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getAllByText('Forrige periode').length).toBeGreaterThan(0);
    expect(screen.queryByText('Foreldelsesloven §§ 2 og 3')).not.toBeInTheDocument();
  });

  it('skal ikke vise default periode når periode er foreldet', () => {
    const perioder = [
      {
        fom: '2019-10-10',
        tom: '2019-11-10',
        foreldelseVurderingType: {
          kode: foreldelseVurderingType.FORELDET,
        },
      },
    ];
    renderWithIntlAndReduxForm(
      <ForeldelseForm
        foreldelsesresultatActivity={perioder}
        behandlingFormPrefix="form"
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
        navBrukerKjonn="MANN"
        readOnly={false}
        readOnlySubmitButton={false}
        merknaderFraBeslutter={{
          notAccepted: false,
        }}
        apCodes={['5003']}
        alleKodeverk={{}}
        beregnBelop={vi.fn()}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.queryByTestId('foreldelseperiodeform')).not.toBeInTheDocument();
  });
});
