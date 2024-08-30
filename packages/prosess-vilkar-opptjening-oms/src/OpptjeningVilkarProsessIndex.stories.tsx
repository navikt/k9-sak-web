import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Fagsak, OpptjeningBehandling } from '@k9-sak-web/types';
import OpptjeningVilkarProsessIndex from './OpptjeningVilkarProsessIndex';
import opptjeningAktivitetKlassifisering from './kodeverk/opptjeningAktivitetKlassifisering';

const opptjening = {
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 2,
      dager: 3,
    },
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-01-01',
        tom: '2018-04-04',
        klasse: {
          kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
        },
      },
    ],
    opptjeningFom: '2018-01-01',
    opptjeningTom: '2018-10-01',
  },
};

const opptjening2 = {
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 4,
      dager: 6,
    },
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-05-01',
        tom: '2018-09-04',
        klasse: {
          kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
        },
      },
    ],
    opptjeningFom: '2018-02-01',
    opptjeningTom: '2018-12-01',
  },
};

const opptjeningUten847B = {
  opptjeningAktivitetList: [
    {
      id: 1,
      opptjeningFom: '2018-05-01',
      opptjeningTom: '2018-11-15',
      klasse: {
        kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
      },
    },
  ],
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 4,
      dager: 6,
    },
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-05-01',
        tom: '2018-09-04',
        klasse: {
          kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
        },
      },
    ],
    opptjeningFom: '2018-02-01',
    opptjeningTom: '2018-12-01',
  },
};

const opptjeningMed847B = {
  opptjeningAktivitetList: [
    {
      id: 1,
      opptjeningFom: '2018-05-01',
      opptjeningTom: '2018-11-15',
      klasse: {
        kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
      },
    },
    {
      id: 2,
      opptjeningFom: '2018-12-02',
      opptjeningTom: '2018-12-15',
      klasse: {
        kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
      },
    },
  ],
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 4,
      dager: 6,
    },
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-05-01',
        tom: '2018-09-04',
        klasse: {
          kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
        },
      },
    ],
    opptjeningFom: '2018-02-01',
    opptjeningTom: '2018-12-01',
  },
};

const behandlingsresultat = {
  vilkårResultat: {
    OPPTJENINGSVILKÅRET: [
      {
        avslagsårsak: null,
        periode: { fom: '2018-01-01', tom: '2018-04-04' },
        fom: '2018-01-01',
        tom: '2018-10-01',
        utfall: 'IKKE_VURDERT', // VILKAR_UTFALL_TYPE
      },
      {
        avslagsårsak: null,
        periode: { fom: '2018-05-01', tom: '2018-09-04' },
        fom: '2018-02-01',
        tom: '2018-12-01',
        utfall: 'IKKE_VURDERT', // VILKAR_UTFALL_TYPE
      },
    ],
  },
};

const fagsak = {
  saksnummer: '1DoJZD0',
  sakstype: 'PSB', // FAGSAK_YTELSE
  gyldigPeriode: { fom: '2022-11-28', tom: '2023-01-20' },
  status: 'UBEH', // FAGSAK_STATUS
  kanRevurderingOpprettes: false,
  skalBehandlesAvInfotrygd: false,
  opprettet: '2023-02-27T07:33:46.432',
  endret: '2023-02-27T09:51:46.333',
  person: {
    erDod: false,
    alder: 36,
    diskresjonskode: null,
    dodsdato: null,
    erKvinne: false,
    navn: 'DATO AKSEPTABEL',
    personnummer: '06838698180',
    personstatusType: 'BOSA', // PERSONSTATUS_TYPE
    aktørId: '2649841813944',
  },
  erPbSak: false,
} as Fagsak;

const opptjeninger = { opptjeninger: [opptjening, opptjening2] };

export default {
  title: 'prosess/prosess-vilkar-opptjening-oms',
  component: OpptjeningVilkarProsessIndex,
};

export const visPanelForÅpentAksjonspunkt = args => (
  <OpptjeningVilkarProsessIndex
    fagsak={{
      ...fagsak,
      sakstype: {
        kode: 'OMP',
        kodeverk: 'FAGSAK_YTELSE',
      },
    }}
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat,
      } as OpptjeningBehandling
    }
    opptjening={opptjeninger}
    vilkar={[
      {
        vilkarType: {
          kode: 'FP_VK_23',
          kodeverk: 'VILKAR_TYPE',
        },
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: null,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: {
              kode: 'OPPFYLT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2020-04-27',
              tom: '2020-04-27',
            },
            begrunnelse: null,
            vurderesIBehandlingen: true,
            merknad: {
              kode: '7847B',
              kodeverk: 'VILKAR_UTFALL_MERKNAD',
            },
          },
        ],
      },
    ]}
    aksjonspunkter={
      [
        {
          definisjon: aksjonspunktCodes.SVANGERSKAPSVILKARET,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
        },
      ] as Aksjonspunkt[]
    }
    status={vilkarUtfallType.IKKE_VURDERT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelForÅpentAksjonspunkt.args = {
  isReadOnly: false,
  isAksjonspunktOpen: true,
  readOnlySubmitButton: false,
};

export const visPanelForPSBÅpentAksjonspunktUten847B = args => (
  <OpptjeningVilkarProsessIndex
    fagsak={fagsak}
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat,
      } as OpptjeningBehandling
    }
    opptjening={{ opptjeninger: [opptjeningUten847B] }}
    vilkar={[
      {
        vilkarType: {
          kode: 'FP_VK_23',
          kodeverk: 'VILKAR_TYPE',
        },
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: null,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: {
              kode: 'OPPFYLT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2018-12-02',
              tom: '2018-12-15',
            },
            begrunnelse: null,
            vurderesIBehandlingen: true,
          },
        ],
      },
    ]}
    aksjonspunkter={
      [
        {
          definisjon: aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
        },
      ] as Aksjonspunkt[]
    }
    status={vilkarUtfallType.IKKE_VURDERT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelForPSBÅpentAksjonspunktUten847B.args = {
  isReadOnly: false,
  isAksjonspunktOpen: true,
  readOnlySubmitButton: false,
};

export const visPanelForPSBÅpentAksjonspunktMed847B = args => (
  <OpptjeningVilkarProsessIndex
    fagsak={fagsak}
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat,
      } as OpptjeningBehandling
    }
    opptjening={{ opptjeninger: [opptjeningMed847B] }}
    vilkar={[
      {
        vilkarType: {
          kode: 'FP_VK_23',
          kodeverk: 'VILKAR_TYPE',
        },
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: null,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: {
              kode: 'OPPFYLT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2018-12-02',
              tom: '2018-12-15',
            },
            begrunnelse: null,
            vurderesIBehandlingen: true,
          },
        ],
      },
    ]}
    aksjonspunkter={
      [
        {
          definisjon: aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
        },
      ] as Aksjonspunkt[]
    }
    status={vilkarUtfallType.IKKE_VURDERT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelForPSBÅpentAksjonspunktMed847B.args = {
  isReadOnly: false,
  isAksjonspunktOpen: true,
  readOnlySubmitButton: false,
};

export const visPanelForNårEnIkkeHarAksjonspunkt = args => (
  <OpptjeningVilkarProsessIndex
    fagsak={{
      ...fagsak,
      sakstype: {
        kode: 'OMP',
        kodeverk: 'FAGSAK_YTELSE',
      },
    }}
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat: {},
      } as OpptjeningBehandling
    }
    opptjening={opptjening}
    vilkar={[
      {
        vilkarType: {
          kode: 'FP_VK_23',
          kodeverk: 'VILKAR_TYPE',
        },
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: null,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: {
              kode: 'OPPFYLT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2020-04-27',
              tom: '2020-04-27',
            },
            begrunnelse: null,
            vurderesIBehandlingen: true,
            merknad: {
              kode: '1035',
              kodeverk: 'VILKAR_UTFALL_MERKNAD',
            },
          },
        ],
      },
    ]}
    aksjonspunkter={[]}
    status={vilkarUtfallType.OPPFYLT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelForNårEnIkkeHarAksjonspunkt.args = {
  isReadOnly: true,
  isAksjonspunktOpen: false,
  readOnlySubmitButton: false,
};
