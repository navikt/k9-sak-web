/* eslint-disable import/no-relative-packages */
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { Aksjonspunkt, Opptjening, OpptjeningBehandling } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import React from 'react';
import alleKodeverk from '../../storybook/stories/mocks/alleKodeverk.json';
import arbeidsgivere from '../../storybook/stories/mocks/arbeidsgivere.json';
import OpptjeningFaktaIndex from './OpptjeningFaktaIndex';

const behandling = {
  id: 1,
  versjon: 1,
} as OpptjeningBehandling;

const opptjeningNårEnHarAksjonspunkt = {
  opptjeninger: [
    {
      fastsattOpptjening: {
        opptjeningFom: '2018-12-25',
        opptjeningTom: '2019-10-24',
        opptjeningperiode: {
          måneder: 0,
          dager: 0,
        },
        fastsattOpptjeningAktivitetList: [],
      },
      opptjeningAktivitetList: [
        {
          aktivitetType: {
            kode: opptjeningAktivitetType.NARING,
          },
          originalFom: null,
          originalTom: null,
          opptjeningFom: '1995-09-14',
          opptjeningTom: '9999-12-31',
          arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
          arbeidsgiverNavn: null,
          oppdragsgiverOrg: '973861778',
          arbeidsgiverIdentifikator: '973861778',
          privatpersonNavn: null,
          privatpersonFødselsdato: null,
          arbeidsforholdRef: null,
          stillingsandel: 100,
          naringRegistreringsdato: '1995-09-14',
          erManueltOpprettet: false,
          erGodkjent: null,
          erEndret: false,
          begrunnelse: null,
        },
        {
          aktivitetType: {
            kode: opptjeningAktivitetType.ARBEID,
          },
          originalFom: null,
          originalTom: null,
          opptjeningFom: '2018-01-01',
          opptjeningTom: '2018-11-01',
          arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
          arbeidsgiverNavn: null,
          oppdragsgiverOrg: '973861778',
          arbeidsgiverIdentifikator: '973861778',
          privatpersonNavn: null,
          privatpersonFødselsdato: null,
          arbeidsforholdRef: 'e5ec2632-0e31-4c8f-8190-d942053f847b',
          stillingsandel: 100,
          naringRegistreringsdato: '1995-09-14',
          erManueltOpprettet: false,
          erGodkjent: true,
          erEndret: false,
          begrunnelse: null,
        },
        {
          aktivitetType: {
            kode: opptjeningAktivitetType.ARBEID,
          },
          originalFom: null,
          originalTom: null,
          opptjeningFom: '2019-10-25',
          opptjeningTom: '2019-12-01',
          arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
          arbeidsgiverNavn: null,
          oppdragsgiverOrg: '973861778',
          arbeidsgiverIdentifikator: '973861778',
          privatpersonNavn: null,
          privatpersonFødselsdato: null,
          arbeidsforholdRef: '123adw32-231-654362-1231-3242',
          stillingsandel: 100,
          naringRegistreringsdato: '1995-09-14',
          erManueltOpprettet: false,
          erGodkjent: true,
          erEndret: false,
          begrunnelse: null,
        },
      ],
    },
  ],
} as { opptjeninger: Opptjening[] };

const opptjeningUtenAksjonspunkt = {
  opptjeninger: [
    {
      fastsattOpptjening: {
        opptjeningFom: '2018-11-30',
        opptjeningTom: '2019-09-29',
        opptjeningperiode: {
          dager: 4,
          måneder: 10,
        },
        fastsattOpptjeningAktivitetList: [],
      },
      opptjeningAktivitetList: [
        {
          opptjeningFom: '2017-01-01',
          opptjeningTom: '9999-12-31',
          aktivitetType: {
            kode: opptjeningAktivitetType.ARBEID,
          },
          arbeidsforholdRef: 'bf623ff9-6ffb-4a81-b9f1-2648e5530a47',
          arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
          arbeidsgiverIdentifikator: '973861778',
          erEndret: false,
          erGodkjent: true,
          erManueltOpprettet: false,

          oppdragsgiverOrg: '973861778',
          stillingsandel: 50,
        },
        {
          opptjeningFom: '2017-01-01',
          opptjeningTom: '9999-12-31',
          aktivitetType: {
            kode: opptjeningAktivitetType.DAGPENGER,
          },
          arbeidsforholdRef: 'bf623ff9-6ffb-4a81-b9f1-2648e5530a47',
          arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
          arbeidsgiverIdentifikator: '973861778',
          erEndret: false,
          erGodkjent: true,
          erManueltOpprettet: false,

          aringRegistreringsdato: '1995-09-14',
          oppdragsgiverOrg: '973861778',
          stillingsandel: 50,
        },
      ],
    },
  ],
} as { opptjeninger: Opptjening[] };

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-opptjening-oms',
  component: OpptjeningFaktaIndex,
};

export const visAksjonspunktForOpptjeningsvilkåret = args => (
  <OpptjeningFaktaIndex
    behandling={behandling}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING,
          },
          status: {
            kode: aksjonspunktStatus.OPPRETTET,
          },
          begrunnelse: undefined,
          kanLoses: true,
          erAktivt: true,
        },
      ] as Aksjonspunkt[]
    }
    alleKodeverk={alleKodeverk as any}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    submitCallback={action('button-click')}
    {...args}
  />
);

visAksjonspunktForOpptjeningsvilkåret.args = {
  opptjening: opptjeningNårEnHarAksjonspunkt,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]: merknaderFraBeslutter,
  },
  readOnly: false,
  harApneAksjonspunkter: true,
  submittable: true,
};

export const visPanelUtenAksjonpunkt = args => (
  <OpptjeningFaktaIndex
    behandling={behandling}
    aksjonspunkter={[]}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    alleKodeverk={alleKodeverk as any}
    alleMerknaderFraBeslutter={{}}
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelUtenAksjonpunkt.args = {
  opptjening: opptjeningUtenAksjonspunkt,
  readOnly: false,
  harApneAksjonspunkter: false,
  submittable: true,
};
