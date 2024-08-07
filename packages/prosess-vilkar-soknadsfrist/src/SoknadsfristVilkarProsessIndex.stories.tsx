import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { Behandling, DokumentStatus, Vilkar } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import SoknadsfristVilkarProsessIndex from './SoknadsfristVilkarProsessIndex';

const vilkarSoknadsfrist = [
  {
    vilkarType: { kode: vilkarType.SOKNADSFRISTVILKARET, kodeverk: 'test' },
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-20',
          tom: '2020-02-25',
        },
      },
      {
        vilkarStatus: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-26',
          tom: '2020-02-27',
        },
      },
      {
        vilkarStatus: { kode: vilkarUtfallType.OPPFYLT, kodeverk: 'test' },
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-28',
          tom: '2020-02-29',
        },
      },
    ],
  } as Vilkar,
];

const soknadsStatus = {
  dokumentStatus: [
    {
      type: 'SOKNAD',
      status: [
        {
          periode: { fom: '2020-02-20', tom: '2020-02-25' },
          status: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        },
      ],
      innsendingstidspunkt: '2020-06-01',
      journalpostId: '12345',
      avklarteOpplysninger: null,
      overstyrteOpplysninger: null,
    },
    {
      type: 'SOKNAD',
      status: [
        {
          periode: { fom: '2020-02-26', tom: '2020-02-27' },
          status: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        },
      ],
      innsendingstidspunkt: '2020-06-01',
      journalpostId: '23456',
      avklarteOpplysninger: null,
      overstyrteOpplysninger: null,
    },
  ] as DokumentStatus[],
};

const meta: Meta<typeof SoknadsfristVilkarProsessIndex> = {
  title: 'prosess/prosess-vilkar-soknadsfrist',
  component: SoknadsfristVilkarProsessIndex,
};

type Story = StoryObj<typeof SoknadsfristVilkarProsessIndex>;

const behandling = {
  id: 1,
  versjon: 1,
  type: { kode: behandlingType.FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE' },
} as Behandling;

export const visOverstyringspanelForSoknadsfrist: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        behandling={behandling}
        aksjonspunkter={[]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={soknadsStatus}
        panelTittelKode="Søknadsfrist"
        vilkar={vilkarSoknadsfrist}
        {...props}
      />
    );
  },
};

export const visOverstyringspanelForSoknadsfristUtenDokumenter: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        behandling={behandling}
        aksjonspunkter={[]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={{ dokumentStatus: [] }}
        panelTittelKode="Søknadsfrist"
        vilkar={vilkarSoknadsfrist}
        {...props}
      />
    );
  },
};

export const VisSoknadsfristAksjonspunkt5077: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        behandling={behandling}
        aksjonspunkter={[
          {
            aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
            begrunnelse: null,
            besluttersBegrunnelse: null,
            definisjon: { kode: '5077', kodeverk: 'AKSJONSPUNKT_DEF' },
            erAktivt: true,
            kanLoses: true,
            status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: null,
            vilkarType: { kode: 'FP_VK_3', kodeverk: 'VILKAR_TYPE' },
            vurderPaNyttArsaker: null,
          },
        ]}
        submitCallback={props?.submitCallback || action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={{
          dokumentStatus: [
            {
              type: 'SØKNAD',
              status: [
                {
                  periode: { fom: '2021-04-28', tom: '2021-04-30' },
                  status: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                },
                {
                  periode: { fom: '2021-05-01', tom: '2021-05-05' },
                  status: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                },
              ],
              innsendingstidspunkt: '2021-08-19T11:50:21.894',
              journalpostId: '510536417',
              avklarteOpplysninger: null,
              overstyrteOpplysninger: null,
            },
          ],
        }}
        panelTittelKode="Søknadsfrist"
        vilkar={[
          {
            vilkarType: { kode: 'FP_VK_3', kodeverk: 'VILKAR_TYPE' },
            lovReferanse: null,
            overstyrbar: true,
            perioder: [
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                periode: { fom: '2021-04-28', tom: '2021-04-30' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                periode: { fom: '2021-05-01', tom: '2021-05-05' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
            ],
          },
        ]}
        {...props}
      />
    );
  },
};

export const visSoknadsfristAksjonspunkt5077Delvis: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        behandling={behandling}
        aksjonspunkter={[
          {
            aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
            begrunnelse: [
              'jsdfsdf ljksdlkfj sldjf lsdkjf lsjdf\n\n\n',
              'sdsdfs øjjølksdjfølkjsd fjsd s fløskjdflsjd f\n\n\n',
              'sdklfjsøl jølsdjfø lsjdfljsldøjf sdjf slødjf sld\n\n\n',
              'sldfj sljfølsjd fløsdlfj øsldjf lsøjdfølsdjfløsjd lsdfs',
            ].join(''),
            besluttersBegrunnelse: null,
            definisjon: { kode: '5077', kodeverk: 'AKSJONSPUNKT_DEF' },
            erAktivt: true,
            kanLoses: false,
            status: { kode: 'UTFO', kodeverk: 'AKSJONSPUNKT_STATUS' },
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: null,
            vilkarType: { kode: 'FP_VK_3', kodeverk: 'VILKAR_TYPE' },
            vurderPaNyttArsaker: null,
          },
        ]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={{
          dokumentStatus: [
            {
              type: 'SØKNAD',
              status: [
                {
                  periode: { fom: '2021-04-26', tom: '2021-04-27' },
                  status: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                },
                {
                  periode: { fom: '2021-04-28', tom: '2021-05-06' },
                  status: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                },
              ],
              innsendingstidspunkt: '2021-08-26T16:17:16.538',
              journalpostId: '510540058',
              avklarteOpplysninger: {
                godkjent: true,
                fraDato: '2021-04-27',
                begrunnelse: [
                  'jsdfsdf ljksdlkfj sldjf lsdkjf lsjdf\n\n\n',
                  'sdsdfs øjjølksdjfølkjsd fjsd s fløskjdflsjd f\n\n\n',
                  'sdklfjsøl jølsdjfø lsjdfljsldøjf sdjf slødjf sld\n\n\n',
                  'sldfj sljfølsjd fløsdlfj øsldjf lsøjdfølsdjfløsjd lsdfs',
                ].join(''),
                opprettetAv: 'saksbeh',
                opprettetTidspunkt: '2021-08-26T16:17:16.538',
              },
              overstyrteOpplysninger: null,
            },
          ],
        }}
        panelTittelKode="Søknadsfrist"
        vilkar={[
          {
            vilkarType: { kode: 'FP_VK_3', kodeverk: 'VILKAR_TYPE' },
            lovReferanse: null,
            overstyrbar: true,
            perioder: [
              {
                avslagKode: '1007',
                merknadParametere: {},
                vilkarStatus: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                periode: { fom: '2021-04-26', tom: '2021-04-27' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                periode: { fom: '2021-04-28', tom: '2021-04-30' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
                periode: { fom: '2021-05-01', tom: '2021-05-06' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
            ],
          },
        ]}
        {...props}
      />
    );
  },
};

export default meta;
