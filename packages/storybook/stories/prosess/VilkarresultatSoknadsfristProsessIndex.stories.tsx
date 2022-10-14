import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';

import { DokumentStatus, Behandling, Vilkar } from '@k9-sak-web/types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-soknadsfrist';

import withReduxProvider from '../../decorators/withRedux';

const vilkarSoknadsfrist = [
  {
    vilkarType: vilkarType.SOKNADSFRISTVILKARET,
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-20',
          tom: '2020-02-25',
        },
      },
      {
        vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-26',
          tom: '2020-02-27',
        },
      },
      {
        vilkarStatus: vilkarUtfallType.OPPFYLT,
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
          status: vilkarUtfallType.IKKE_OPPFYLT,
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
          status: vilkarUtfallType.IKKE_OPPFYLT,
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
          type: behandlingType.FORSTEGANGSSOKNAD,
        } as Behandling
      }
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={soknadsStatus}
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
      vilkar={vilkarSoknadsfrist}
      visAllePerioder
    />
  );
};

export const visOverstyringspanelForSoknadsfristUtenDokumenter = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: behandlingType.FORSTEGANGSSOKNAD,
        } as Behandling
      }
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={{ dokumentStatus: [] }}
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
      vilkar={vilkarSoknadsfrist}
      visAllePerioder
    />
  );
};

export const visSoknadsfristAksjonspunkt5077 = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: behandlingType.FORSTEGANGSSOKNAD,
        } as Behandling
      }
      aksjonspunkter={[
        {
          aksjonspunktType: 'MANU',
          begrunnelse: null,
          besluttersBegrunnelse: null,
          definisjon: '5077',
          erAktivt: true,
          kanLoses: true,
          status: 'OPPR',
          toTrinnsBehandling: true,
          toTrinnsBehandlingGodkjent: null,
          vilkarType: 'FP_VK_3',
          vurderPaNyttArsaker: null,
        },
      ]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={{
        dokumentStatus: [
          {
            type: 'SØKNAD',
            status: [
              {
                periode: { fom: '2021-04-28', tom: '2021-04-30' },
                status: 'IKKE_VURDERT',
              },
              // {
              //   periode: { fom: '2021-05-01', tom: '2021-05-05' },
              //   status: 'OPPFYLT',
              // },
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
          vilkarType: 'FP_VK_3',
          lovReferanse: null,
          overstyrbar: true,
          perioder: [
            {
              avslagKode: null,
              merknadParametere: {},
              vilkarStatus: 'IKKE_VURDERT',
              periode: { fom: '2021-04-28', tom: '2021-04-30' },
              begrunnelse: null,
              vurderesIBehandlingen: true,
            },
            // {
            //   avslagKode: null,
            //   merknadParametere: {},
            //   vilkarStatus: 'OPPFYLT',
            //   periode: { fom: '2021-05-01', tom: '2021-05-05' },
            //   begrunnelse: null,
            //   vurderesIBehandlingen: true,
            // },
          ],
        },
      ]}
      visAllePerioder
    />
  );
};

export const visSoknadsfristAksjonspunkt5077Delvis = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: behandlingType.FORSTEGANGSSOKNAD,
        } as Behandling
      }
      aksjonspunkter={[
        {
          aksjonspunktType: 'MANU',
          begrunnelse: [
            'jsdfsdf ljksdlkfj sldjf lsdkjf lsjdf\n\n\n',
            'sdsdfs øjjølksdjfølkjsd fjsd s fløskjdflsjd f\n\n\n',
            'sdklfjsøl jølsdjfø lsjdfljsldøjf sdjf slødjf sld\n\n\n',
            'sldfj sljfølsjd fløsdlfj øsldjf lsøjdfølsdjfløsjd lsdfs',
          ].join(''),
          besluttersBegrunnelse: null,
          definisjon: '5077',
          erAktivt: true,
          kanLoses: false,
          status: 'UTFO',
          toTrinnsBehandling: true,
          toTrinnsBehandlingGodkjent: null,
          vilkarType: 'FP_VK_3',
          vurderPaNyttArsaker: null,
        },
      ]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={{
        dokumentStatus: [
          {
            type: 'SØKNAD',
            status: [
              {
                periode: { fom: '2021-04-26', tom: '2021-04-27' },
                status: 'IKKE_OPPFYLT',
              },
              {
                periode: { fom: '2021-04-28', tom: '2021-05-06' },
                status: 'OPPFYLT',
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
            },
            overstyrteOpplysninger: null,
          },
        ],
      }}
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
      vilkar={[
        {
          vilkarType: 'FP_VK_3',
          lovReferanse: null,
          overstyrbar: true,
          perioder: [
            {
              avslagKode: '1007',
              merknadParametere: {},
              vilkarStatus: 'IKKE_OPPFYLT',
              periode: { fom: '2021-04-26', tom: '2021-04-27' },
              begrunnelse: null,
              vurderesIBehandlingen: true,
            },
            {
              avslagKode: null,
              merknadParametere: {},
              vilkarStatus: 'OPPFYLT',
              periode: { fom: '2021-04-28', tom: '2021-04-30' },
              begrunnelse: null,
              vurderesIBehandlingen: true,
            },
            {
              avslagKode: null,
              merknadParametere: {},
              vilkarStatus: 'OPPFYLT',
              periode: { fom: '2021-05-01', tom: '2021-05-06' },
              begrunnelse: null,
              vurderesIBehandlingen: true,
            },
          ],
        },
      ]}
      visAllePerioder
    />
  );
};
