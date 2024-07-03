import React from 'react';
import { screen } from '@testing-library/react';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import OppholdInntektOgPerioderForm, { transformValues } from './OppholdInntektOgPerioderForm';
import messages from '../../../i18n/nb_NO.json';

const perioder = [];

describe('<OppholdInntektOgPerioderForm>', () => {
  it('skal vise informasjon uten editeringsmuligheter når det ikke finnes aksjonspunkter', () => {
    renderWithIntlAndReduxForm(
      <OppholdInntektOgPerioderForm
        {...reduxFormPropsMock}
        initialValues={{}}
        intl={intlMock}
        aksjonspunkter={[]}
        openInfoPanels={['medlemskapsvilkaret']}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter={false}
        submittable
        isRevurdering={false}
        perioder={perioder}
        readOnly
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      />,
      { messages },
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal avklare bosatt data når en har dette aksjonspunktet', () => {
    const bosattAksjonspunkt = {
      id: 1,
      definisjon: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      status: 's1',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPerioderForm
        {...reduxFormPropsMock}
        initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT}`]: 'test', begrunnelse: 'test' }}
        intl={intlMock}
        aksjonspunkter={[bosattAksjonspunkt]}
        openInfoPanels={['omsorgsvilkaaret']}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        isRevurdering={false}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om søker er bosatt i Norge')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal avklare perioder når en har dette aksjonspunktet', () => {
    const periodeAksjonspunkt = {
      id: 1,
      definisjon: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
      status: 's1',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPerioderForm
        {...reduxFormPropsMock}
        initialValues={{
          [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE}`]: 'test',
          begrunnelse: 'test',
        }}
        intl={intlMock}
        aksjonspunkter={[periodeAksjonspunkt]}
        openInfoPanels={['omsorgsvilkaaret']}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        isRevurdering={false}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om søker har gyldig medlemskap i perioden')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal avklare oppholdsrett når en har dette aksjonspunktet', () => {
    const oppholdsrettAksjonspunkt = {
      id: 1,
      definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      status: 's1',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPerioderForm
        {...reduxFormPropsMock}
        initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OPPHOLDSRETT}`]: 'test', begrunnelse: 'test' }}
        intl={intlMock}
        aksjonspunkter={[oppholdsrettAksjonspunkt]}
        openInfoPanels={['omsorgsvilkaaret']}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        isRevurdering={false}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om søker er EØS-borger med oppholdsrett')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal avklare lovlig opphold når en har dette aksjonspunktet', () => {
    const lovligOppholdAksjonspunkt = {
      id: 1,
      definisjon: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
      status: 's1',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPerioderForm
        {...reduxFormPropsMock}
        initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD}`]: 'test', begrunnelse: 'test' }}
        intl={intlMock}
        aksjonspunkter={[lovligOppholdAksjonspunkt]}
        openInfoPanels={['omsorgsvilkaaret']}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        isRevurdering={false}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      />,
      { messages },
    );

    expect(screen.getByText('Avklar om søker har lovlig opphold')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal avklare fortsatt medlemskap når en har dette aksjonspunktet', () => {
    const fortsattMedlemskapAksjonspunkt = {
      id: 1,
      definisjon: aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
      status: 's1',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPerioderForm
        {...reduxFormPropsMock}
        initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP}`]: 'test', begrunnelse: 'test' }}
        intl={intlMock}
        aksjonspunkter={[fortsattMedlemskapAksjonspunkt]}
        openInfoPanels={['omsorgsvilkaaret']}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        isRevurdering={false}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om søker fortsatt har gyldig medlemskap i perioden')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal kun avklare aksjonspunkt som er aktive', () => {
    const lovligOppholdAksjonspunkt = {
      id: 1,
      definisjon: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
      status: 's1',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: false,
      erAktivt: false,
    };

    const fortsattMedlemskapAksjonspunkt = {
      id: 1,
      definisjon: aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
      status: 's1',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const values = {
      perioder: [
        {
          aksjonspunkter: [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD],
          begrunnelse: 'dawdawdawdawdawda',
          bosattVurdering: null,
          erEosBorger: false,
          lovligOppholdVurdering: true,
          medlemskapManuellVurderingType: null,
          oppholdsrettVurdering: null,
          vurderingsdato: '2019-10-06',
          årsaker: ['STATSBORGERSKAP'],
        },
      ],
    };

    const transformed = transformValues(values, [lovligOppholdAksjonspunkt, fortsattMedlemskapAksjonspunkt]);

    expect(transformed.length).toBe(1);
    expect(transformed[0].kode).toBe(aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP);
  });
});
