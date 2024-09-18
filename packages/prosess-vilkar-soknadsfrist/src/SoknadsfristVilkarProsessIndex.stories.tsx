import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { Behandling, DokumentStatus, Vilkar } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
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

export default {
  title: 'prosess/prosess-vilkar-soknadsfrist',
  component: SoknadsfristVilkarProsessIndex,
};
const behandling = {
  id: 1,
  versjon: 1,
  type: { kode: behandlingType.FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE' },
} as Behandling;

export const visOverstyringspanelForSoknadsfrist = props => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
      behandling={behandling}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={soknadsStatus}
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
      vilkar={vilkarSoknadsfrist}
      visAllePerioder
      {...props}
    />
  );
};

visOverstyringspanelForSoknadsfrist.args = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
};

export const visOverstyringspanelForSoknadsfristUtenDokumenter = props => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
      behandling={behandling}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={{ dokumentStatus: [] }}
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
      vilkar={vilkarSoknadsfrist}
      visAllePerioder
      {...props}
    />
  );
};

visOverstyringspanelForSoknadsfristUtenDokumenter.args = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
};

export const visSoknadsfristAksjonspunkt5077 = props => {
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
      submitCallback={action('button-click')}
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
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
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
      visAllePerioder={false}
      {...props}
    />
  );
};

visSoknadsfristAksjonspunkt5077.args = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
};

export const visSoknadsfristAksjonspunkt5077Delvis = props => {
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
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
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
      visAllePerioder
      {...props}
    />
  );
};

visSoknadsfristAksjonspunkt5077Delvis.args = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
};

export const VisSoknadsfristAksjonspunkt5077FlereSøknader = {
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
        behandling={{
          behandlendeEnhetId: '4487',
          behandlendeEnhetNavn: 'NAV AY sykdom i familien',
          behandlingÅrsaker: [
            {
              erAutomatiskRevurdering: false,
              behandlingArsakType: {
                kode: 'RE-END-FRA-BRUKER',
                kodeverk: 'BEHANDLING_AARSAK',
              },
              manueltOpprettet: false,
            },
            {
              erAutomatiskRevurdering: false,
              behandlingArsakType: {
                kode: 'RE_ANNEN_SAK',
                kodeverk: 'BEHANDLING_AARSAK',
              },
              manueltOpprettet: false,
            },
          ],
          behandlingKoet: false,
          behandlingPaaVent: false,
          behandlingsfristTid: '2024-10-17',
          behandlingsresultat: {
            erRevurderingMedUendretUtfall: false,
            type: {
              kode: 'IKKE_FASTSATT',
              kodeverk: 'BEHANDLING_RESULTAT_TYPE',
            },
            vilkårResultat: {
              SØKNADSFRIST: [
                {
                  periode: {
                    fom: '2024-03-04',
                    tom: '2024-03-08',
                  },
                  avslagsårsak: {
                    kode: '-',
                    kodeverk: 'AVSLAGSARSAK',
                  },
                  utfall: {
                    kode: '-',
                    kodeverk: 'VILKAR_UTFALL_TYPE',
                  },
                },
                {
                  periode: {
                    fom: '2024-03-25',
                    tom: '2024-03-29',
                  },
                  avslagsårsak: {
                    kode: '-',
                    kodeverk: 'AVSLAGSARSAK',
                  },
                  utfall: {
                    kode: '-',
                    kodeverk: 'VILKAR_UTFALL_TYPE',
                  },
                },
              ],
            },
          },
          behandlingResultatType: {
            kode: 'IKKE_FASTSATT',
            kodeverk: 'BEHANDLING_RESULTAT_TYPE',
          },
          endret: '2024-09-05T15:03:10.053',
          endretAvBrukernavn: 'k9-sak',
          erPaaVent: false,
          fagsakId: 1348202,
          sakstype: {
            kode: 'PSB',
            kodeverk: 'FAGSAK_YTELSE',
          },
          førsteÅrsak: {
            erAutomatiskRevurdering: false,
            behandlingArsakType: {
              kode: 'RE_ANNEN_SAK',
              kodeverk: 'BEHANDLING_AARSAK',
            },
            manueltOpprettet: false,
          },
          gjeldendeVedtak: false,
          id: 1355602,
          links: [],
          opprettet: '2024-09-05T15:01:53',
          sprakkode: {
            kode: 'NB',
            kodeverk: 'SPRAAK_KODE',
          },
          status: {
            kode: 'UTRED',
            kodeverk: 'BEHANDLING_STATUS',
          },
          stegTilstand: {
            stegType: {
              kode: 'VURDER_SØKNADSFRIST',
              kodeverk: 'BEHANDLING_STEG_TYPE',
            },
            stegStatus: {
              kode: 'UTGANG',
              kodeverk: 'BEHANDLING_STEG_STATUS',
            },
            tidsstempel: '2024-09-05T15:03:10.053+02:00',
          },
          toTrinnsBehandling: false,
          type: {
            kode: 'BT-002',
            kodeverk: 'BEHANDLING_TYPE',
          },
          uuid: '46bc4af0-d515-4d2d-bfe5-abce509194a9',
          behandlingHenlagt: false,
          versjon: 40,
        }}
        aksjonspunkter={[
          {
            aksjonspunktType: {
              kode: 'MANU',
              kodeverk: 'AKSJONSPUNKT_TYPE',
            },
            begrunnelse: null,
            besluttersBegrunnelse: null,
            definisjon: {
              kode: '5077',
              kodeverk: 'AKSJONSPUNKT_DEF',
            },
            erAktivt: true,
            fristTid: null,
            kanLoses: true,
            status: {
              kode: 'OPPR',
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: null,
            vilkarType: {
              kode: 'FP_VK_3',
              kodeverk: 'VILKAR_TYPE',
            },
            vurderPaNyttArsaker: null,
            venteårsak: {
              kanVelgesIGui: false,
              kode: '-',
              ventekategori: null,
              kodeverk: 'VENT_AARSAK',
            },
            venteårsakVariant: null,
            opprettetAv: 'k9-sak',
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
                  periode: {
                    fom: '2024-03-25',
                    tom: '2024-03-29',
                  },
                  status: {
                    kode: 'IKKE_VURDERT',
                    kodeverk: 'VILKAR_UTFALL_TYPE',
                  },
                },
              ],
              innsendingstidspunkt: '2024-09-05T13:01:56.322',
              journalpostId: '671129216',
              avklarteOpplysninger: null,
              overstyrteOpplysninger: null,
            },
            {
              type: 'SØKNAD',
              status: [
                {
                  periode: {
                    fom: '2024-03-04',
                    tom: '2024-03-08',
                  },
                  status: {
                    kode: 'IKKE_VURDERT',
                    kodeverk: 'VILKAR_UTFALL_TYPE',
                  },
                },
              ],
              innsendingstidspunkt: '2024-09-05T13:00:44.446',
              journalpostId: '671129199',
              avklarteOpplysninger: null,
              overstyrteOpplysninger: null,
            },
            {
              type: 'SØKNAD',
              status: [
                {
                  periode: {
                    fom: '2024-04-15',
                    tom: '2024-04-19',
                  },
                  status: {
                    kode: 'IKKE_VURDERT',
                    kodeverk: 'VILKAR_UTFALL_TYPE',
                  },
                },
              ],
              innsendingstidspunkt: '2024-09-05T13:03:07.003',
              journalpostId: '671129200',
              avklarteOpplysninger: null,
              overstyrteOpplysninger: null,
            },
          ],
        }}
        panelTittelKode="Søknadsfrist"
        vilkar={[
          {
            vilkarType: {
              kode: 'FP_VK_3',
              kodeverk: 'VILKAR_TYPE',
            },
            lovReferanse: '§ 22-13 tredje ledd',
            overstyrbar: true,
            perioder: [
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: {
                  kode: 'IKKE_VURDERT',
                  kodeverk: 'VILKAR_UTFALL_TYPE',
                },
                periode: {
                  fom: '2024-03-04',
                  tom: '2024-03-08',
                },
                begrunnelse: null,
                vurderesIBehandlingen: true,
                vurdersIBehandlingen: true,
                merknad: {
                  kode: '-',
                  kodeverk: 'VILKAR_UTFALL_MERKNAD',
                },
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: {
                  kode: 'IKKE_VURDERT',
                  kodeverk: 'VILKAR_UTFALL_TYPE',
                },
                periode: {
                  fom: '2024-03-25',
                  tom: '2024-03-29',
                },
                begrunnelse: null,
                vurderesIBehandlingen: true,
                vurdersIBehandlingen: true,
                merknad: {
                  kode: '-',
                  kodeverk: 'VILKAR_UTFALL_MERKNAD',
                },
              },
            ],
          },
        ]}
        {...props}
      />
    );
  },
};
