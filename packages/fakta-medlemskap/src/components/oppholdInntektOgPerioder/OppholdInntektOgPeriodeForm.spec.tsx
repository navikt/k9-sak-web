import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import { OppholdInntektOgPeriodeForm } from './OppholdInntektOgPeriodeForm';

const valgtPeriode = {
  aksjonspunkter: [],
  id: '123',
};

const alleKodeverk = {
  MedlemskapManuellVurderingType: [
    {
      kode: 'IKKE_RELEVANT',
      navn: 'Ikke relevant periode',
      kodeverk: 'MEDLEMSKAP_MANUELL_VURD',
    },
    {
      kode: 'MEDLEM',
      navn: 'Periode med medlemskap',
      kodeverk: 'MEDLEMSKAP_MANUELL_VURD',
    },
    {
      kode: 'UNNTAK',
      navn: 'Periode med unntak fra medlemskap',
      kodeverk: 'MEDLEMSKAP_MANUELL_VURD',
    },
  ],
};

describe('<OppholdInntektOgPeriodeForm>', () => {
  it('skal vise informasjon uten editeringsmuligheter når det ikke finnes aksjonspunkter', () => {
    renderWithIntlAndReduxForm(
      <OppholdInntektOgPeriodeForm
        {...reduxFormPropsMock}
        initialValues={{}}
        intl={intlMock}
        aksjonspunkter={[]}
        updateOppholdInntektPeriode={vi.fn()}
        periodeResetCallback={vi.fn()}
        hasOpenAksjonspunkter={false}
        valgtPeriode={valgtPeriode}
        submittable
        readOnly
        isRevurdering={false}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByText('Opplysninger oppgitt i søknaden')).toBeInTheDocument();
    expect(screen.getByText('Perioder med medlemskap')).toBeInTheDocument();
    expect(screen.queryByText('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
  });

  it('skal avklare bosatt data når en har dette aksjonspunktet', () => {
    const bosattAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const valgtPeriodeMedBosattAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT],
      id: '123',
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPeriodeForm
        {...reduxFormPropsMock}
        initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT}`]: 'test', begrunnelse: 'test' }}
        intl={intlMock}
        aksjonspunkter={[bosattAksjonspunkt]}
        updateOppholdInntektPeriode={vi.fn()}
        periodeResetCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        valgtPeriode={valgtPeriodeMedBosattAksjonspunkt}
        isRevurdering={false}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
  });

  it('skal avklare perioder når en har dette aksjonspunktet', () => {
    const periodeAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const valgtPeriodeMedAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE],
      id: '123',
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPeriodeForm
        {...reduxFormPropsMock}
        initialValues={{
          [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE}`]: 'test',
          begrunnelse: 'test',
        }}
        intl={intlMock}
        aksjonspunkter={[periodeAksjonspunkt]}
        updateOppholdInntektPeriode={vi.fn()}
        periodeResetCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        valgtPeriode={valgtPeriodeMedAksjonspunkt}
        isRevurdering={false}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByText('Perioder med medlemskap')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
  });

  it('skal avklare oppholdsrett når en har dette aksjonspunktet', () => {
    const oppholdsrettAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const valgtPeriodeMedOppholdsrettAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      id: '123',
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPeriodeForm
        {...reduxFormPropsMock}
        initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OPPHOLDSRETT}`]: 'test', begrunnelse: 'test' }}
        intl={intlMock}
        aksjonspunkter={[oppholdsrettAksjonspunkt]}
        updateOppholdInntektPeriode={vi.fn()}
        periodeResetCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        valgtPeriode={valgtPeriodeMedOppholdsrettAksjonspunkt}
        isRevurdering={false}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByText('Status for søker')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
  });

  it('skal avklare lovlig opphold når en har dette aksjonspunktet', () => {
    const lovligOppholdAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const valgtPeriodeMedLovligoppholdAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD],
      id: '123',
    };

    renderWithIntlAndReduxForm(
      <OppholdInntektOgPeriodeForm
        {...reduxFormPropsMock}
        initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD}`]: 'test', begrunnelse: 'test' }}
        intl={intlMock}
        aksjonspunkter={[lovligOppholdAksjonspunkt]}
        updateOppholdInntektPeriode={vi.fn()}
        periodeResetCallback={vi.fn()}
        hasOpenAksjonspunkter
        submittable
        readOnly={false}
        valgtPeriode={valgtPeriodeMedLovligoppholdAksjonspunkt}
        isRevurdering={false}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByText('Status for søker')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
  });
});
