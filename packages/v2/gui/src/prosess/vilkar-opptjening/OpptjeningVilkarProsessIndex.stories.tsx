import {
  kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktDtoStatus,
  kodeverk_opptjening_OpptjeningAktivitetKlassifisering as FastsattOpptjeningAktivitetDtoKlasse,
  kodeverk_opptjening_OpptjeningAktivitetType as FastsattOpptjeningAktivitetDtoType,
  kodeverk_vilkår_VilkårUtfallMerknad as VilkårPeriodeDtoMerknad,
  kodeverk_vilkår_Utfall as VilkårPeriodeDtoVilkarStatus,
} from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction';
import withFeatureToggles from '../../storybook/decorators/withFeatureToggles';
import OpptjeningVilkarProsessIndexV2 from './OpptjeningVilkarProsessIndexV2';

const opptjening = {
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 2,
      dager: 3,
    },
    vurderesIAksjonspunkt: true,
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-01-01',
        tom: '2018-04-04',
        klasse: FastsattOpptjeningAktivitetDtoKlasse.BEKREFTET_GODKJENT,
        type: FastsattOpptjeningAktivitetDtoType.ARBEID,
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
    vurderesIAksjonspunkt: false,
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-05-01',
        tom: '2018-09-04',
        klasse: FastsattOpptjeningAktivitetDtoKlasse.BEKREFTET_GODKJENT,
        type: FastsattOpptjeningAktivitetDtoType.ARBEID,
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
      klasse: FastsattOpptjeningAktivitetDtoKlasse.BEKREFTET_GODKJENT,
      type: FastsattOpptjeningAktivitetDtoType.ARBEID,
    },
  ],
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 0,
      dager: 10,
    },
    vurderesIAksjonspunkt: false,
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-05-01',
        tom: '2018-09-04',
        klasse: FastsattOpptjeningAktivitetDtoKlasse.BEKREFTET_GODKJENT,
        type: FastsattOpptjeningAktivitetDtoType.ARBEID,
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
      klasse: FastsattOpptjeningAktivitetDtoKlasse.BEKREFTET_GODKJENT,
    },
    {
      id: 2,
      opptjeningFom: '2018-12-02',
      opptjeningTom: '2018-12-15',
      klasse: FastsattOpptjeningAktivitetDtoKlasse.BEKREFTET_GODKJENT,
      type: FastsattOpptjeningAktivitetDtoType.ARBEID,
    },
  ],
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 0,
      dager: 10,
    },
    vurderesIAksjonspunkt: false,
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-05-01',
        tom: '2018-09-04',
        klasse: FastsattOpptjeningAktivitetDtoKlasse.BEKREFTET_GODKJENT,
        type: FastsattOpptjeningAktivitetDtoType.ARBEID,
      },
    ],
    opptjeningFom: '2018-02-01',
    opptjeningTom: '2018-12-01',
  },
};

const fagsak = {
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
};

const opptjeninger = { opptjeninger: [opptjening, opptjening2] };

const meta = {
  title: 'gui/prosess/vilkar-opptjening',
  component: OpptjeningVilkarProsessIndexV2,
  decorators: [withFeatureToggles({ OPPTJENING_READ_ONLY_PERIODER: false })],
} satisfies Meta<typeof OpptjeningVilkarProsessIndexV2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisPanelForÅpentAksjonspunkt: Story = {
  args: {
    fagsak: {
      ...fagsak,
      sakstype: fagsakYtelsesType.OMSORGSPENGER,
    },
    behandling: {
      id: 1,
      versjon: 1,
    },
    opptjening: opptjeninger,
    vilkar: [
      {
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: VilkårPeriodeDtoVilkarStatus.IKKE_VURDERT,
            periode: {
              fom: '2020-04-27',
              tom: '2020-04-27',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            merknad: '7847B' as VilkårPeriodeDtoMerknad,
          },
        ],
      },
    ],
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
        status: AksjonspunktDtoStatus.OPPRETTET,
      },
    ],
    lovReferanse: '§§Dette er en lovreferanse',
    submitCallback: fn(),
    isReadOnly: false,
    isAksjonspunktOpen: true,
    readOnlySubmitButton: false,
    visAllePerioder: false,
  },
  play: async ({ args, canvas }) => {
    await userEvent.type(
      canvas.getByLabelText('Vurder om bruker oppfyller opptjening jf § 9-2 eller § 8-47 bokstav B'),
      'Dette er en begrunnelse',
    );
    await userEvent.click(canvas.getByText('Bekreft og fortsett'));
    await expect(args.submitCallback).toHaveBeenCalledWith([
      {
        kode: '5089',
        opptjeningPerioder: [
          {
            fom: '2018-01-01',
            tom: '2018-10-01',
          },
          {
            fom: '2018-02-01',
            tom: '2018-12-01',
          },
        ],
        vilkårPeriodeVurderinger: [
          {
            begrunnelse: 'Dette er en begrunnelse',
            erVilkarOk: true,
            innvilgelseMerknadKode: '7847B',
            kode: '7847B',
            periode: {
              fom: '2020-04-27',
              tom: '2020-04-27',
            },
            vurderesIAksjonspunkt: true,
            vurderesIBehandlingen: true,
          },
        ],
      },
    ]);
  },
};

export const VisPanelForPSBÅpentAksjonspunktUten847B: Story = {
  args: {
    fagsak,
    behandling: {
      id: 1,
      versjon: 1,
    },
    opptjening: { opptjeninger: [opptjeningUten847B] },
    vilkar: [
      {
        perioder: [
          {
            avslagKode: undefined,
            merknad: '7847A' as VilkårPeriodeDtoMerknad,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: 'OPPFYLT',

            periode: {
              fom: '2018-12-02',
              tom: '2018-12-15',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
          },
        ],
      },
    ],
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
        status: AksjonspunktDtoStatus.OPPRETTET,
      },
    ],
    submitCallback: asyncAction('Send inn skjema'),
    isReadOnly: false,
    isAksjonspunktOpen: true,
    readOnlySubmitButton: false,
    visAllePerioder: false,
  },
};

export const VisPanelForPSBÅpentAksjonspunktMed847B: Story = {
  args: {
    fagsak,
    behandling: { id: 1, versjon: 1 },
    opptjening: { opptjeninger: [opptjeningMed847B] },
    vilkar: [
      {
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            merknad: '-' as VilkårPeriodeDtoMerknad,
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2018-12-02',
              tom: '2018-12-15',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
          },
        ],
      },
    ],
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
        status: AksjonspunktDtoStatus.OPPRETTET,
      },
    ],
    lovReferanse: '§§Dette er en lovreferanse',
    submitCallback: asyncAction('Send inn skjema'),
    isReadOnly: false,
    isAksjonspunktOpen: true,
    readOnlySubmitButton: false,
    visAllePerioder: false,
  },
};

export const VisPanelForNårEnIkkeHarAksjonspunkt: Story = {
  args: {
    fagsak: { sakstype: fagsakYtelsesType.OMSORGSPENGER },
    behandling: { id: 1, versjon: 1 },
    opptjening: { opptjeninger: [opptjening] },
    vilkar: [
      {
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2020-04-27',
              tom: '2020-04-27',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            merknad: '-' as VilkårPeriodeDtoMerknad,
          },
        ],
      },
    ],
    aksjonspunkter: [],
    lovReferanse: '§§Dette er en lovreferanse',
    submitCallback: asyncAction('Send inn skjema'),
    isReadOnly: true,
    isAksjonspunktOpen: false,
    readOnlySubmitButton: false,
    visAllePerioder: false,
  },
};
