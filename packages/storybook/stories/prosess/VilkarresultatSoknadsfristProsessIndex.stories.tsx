// import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-soknadsfrist';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { Behandling } from '@k9-sak-web/types';
import withReduxProvider from '../../decorators/withRedux';

const avslagsarsaker = [
  {
    kode: 'AVSLAG_TEST_1',
    navn: 'Dette er en avslagsårsak',
    kodeverk: '',
  },
  {
    kode: 'AVSLAG_TEST_2',
    navn: 'Dette er en annen avslagsårsak',
    kodeverk: '',
  },
];

// const vilkar2 = [
//   {
//     vilkarType: { kode: 'FP_VK_41', kodeverk: 'VILKAR_TYPE' },
//     lovReferanse: '§ 8',
//     overstyrbar: true,
//     perioder: [
//       {
//         avslagKode: null,
//         merknadParametere: {},
//         vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
//         periode: { fom: '2021-04-01', tom: '2021-04-01' },
//         begrunnelse: null,
//         vurdersIBehandlingen: true,
//       },
//     ],
//   },
//   {
//     vilkarType: { kode: 'FP_VK_23', kodeverk: 'VILKAR_TYPE' },
//     lovReferanse: '§ 9-2 jamfør 8-2',
//     overstyrbar: true,
//     perioder: [
//       {
//         avslagKode: null,
//         merknadParametere: {},
//         vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
//         periode: { fom: '2021-04-01', tom: '2021-04-01' },
//         begrunnelse: null,
//         vurdersIBehandlingen: true,
//       },
//     ],
//   },
//   {
//     vilkarType: { kode: 'FP_VK_2', kodeverk: 'VILKAR_TYPE' },
//     lovReferanse: '§ 2',
//     overstyrbar: true,
//     perioder: [
//       {
//         avslagKode: null,
//         merknadParametere: {},
//         vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
//         periode: { fom: '2021-04-01', tom: '2021-04-01' },
//         begrunnelse: null,
//         vurdersIBehandlingen: true,
//       },
//     ],
//   },
//   {
//     vilkarType: { kode: 'FP_VK_3', kodeverk: 'VILKAR_TYPE' },
//     lovReferanse: '§ 22-13, 2. ledd',
//     overstyrbar: true,
//     perioder: [
//       {
//         avslagKode: null,
//         merknadParametere: {},
//         vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
//         periode: { fom: '2021-04-01', tom: '2021-04-01' },
//         begrunnelse: null,
//         vurdersIBehandlingen: true,
//       },
//     ],
//   },
// ];

const vilkar = [
  {
    vilkarType: { kode: 'FP_VK_41', kodeverk: 'VILKAR_TYPE' },
    lovReferanse: '§ 8',
    overstyrbar: true,
    perioder: [
      {
        avslagKode: null,
        merknadParametere: {},
        vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        periode: { fom: '2021-05-09', tom: '2021-05-09' },
        begrunnelse: null,
        vurdersIBehandlingen: true,
      },
    ],
  },
  {
    vilkarType: { kode: 'FP_VK_23', kodeverk: 'VILKAR_TYPE' },
    lovReferanse: '§ 9-2 jamfør 8-2',
    overstyrbar: true,
    perioder: [
      {
        avslagKode: null,
        merknadParametere: {},
        vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        periode: { fom: '2021-05-09', tom: '2021-05-09' },
        begrunnelse: null,
        vurdersIBehandlingen: true,
      },
    ],
  },
  {
    vilkarType: { kode: 'FP_VK_2', kodeverk: 'VILKAR_TYPE' },
    lovReferanse: '§ 2',
    overstyrbar: true,
    perioder: [
      {
        avslagKode: null,
        merknadParametere: {},
        vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        periode: { fom: '2021-05-09', tom: '2021-05-09' },
        begrunnelse: null,
        vurdersIBehandlingen: true,
      },
    ],
  },
  {
    vilkarType: { kode: 'FP_VK_3', kodeverk: 'VILKAR_TYPE' },
    lovReferanse: '§ 22-13, 2. ledd',
    overstyrbar: true,
    perioder: [
      {
        avslagKode: null,
        merknadParametere: {},
        vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        periode: { fom: '2021-05-09', tom: '2021-05-09' },
        begrunnelse: null,
        vurdersIBehandlingen: true,
      },
    ],
  },
];

const soknadsfristStatus = {
  dokumentStatus: [
    {
      type: 'INNTEKTSMELDING',
      status: [
        {
          periode: { fom: '2021-05-09', tom: '2021-05-09' },
          status: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ],
      innsendingstidspunkt: '2021-07-27T00:00:00',
      journalpostId: '6914407',
    },
    {
      type: 'INNTEKTSMELDING',
      status: [
        {
          periode: { fom: '2021-05-09', tom: '2021-05-09' },
          status: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ],
      innsendingstidspunkt: '2021-07-26T00:00:00',
      journalpostId: '6914406',
    },
    // {
    //   type: 'SØKNAD',
    //   status: [
    //     {
    //       periode: {
    //         fom: '2021-05-03',
    //         tom: '2021-05-14',
    //       },
    //       status: {
    //         kode: 'OPPFYLT',
    //         kodeverk: 'VILKAR_UTFALL_TYPE',
    //       },
    //     },
    //   ],
    //   innsendingstidspunkt: '2021-05-28T15:11:07.021',
    //   journalpostId: '493392148',
    // },
  ],
};

export default {
  title: 'prosess/prosess-vilkar-soknadsfrist',
  component: SoknadsfristVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visOverstyringspanelForSoknadsfrist = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: {
            kode: behandlingType.FORSTEGANGSSOKNAD,
            kodeverk: '',
          },
        } as Behandling
      }
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      avslagsarsaker={avslagsarsaker}
      panelTittelKode="Inngangsvilkar.SoknadsfristVilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      // overstyringApKode={aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET}
      // vilkar={vilkarOpptjening}
      vilkar={vilkar}
      soknadsfristStatus={soknadsfristStatus}
      visAllePerioder
    />
  );
};
