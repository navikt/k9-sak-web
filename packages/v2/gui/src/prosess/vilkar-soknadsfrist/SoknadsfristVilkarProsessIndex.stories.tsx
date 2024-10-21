import React from 'react';

import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { kravDokumentStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/KravDokumentStatus.js';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import SoknadsfristVilkarProsessIndex from './SoknadsfristVilkarProsessIndex';

const vilkarSoknadsfrist = [
  {
    vilkarType: vilkarType.SOKNADSFRISTVILKARET, // kodeverk: 'test'
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: vilkårStatus.IKKE_OPPFYLT, // kodeverk: 'test'
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-20',
          tom: '2020-02-25',
        },
      },
      {
        vilkarStatus: vilkårStatus.IKKE_OPPFYLT, // kodeverk: 'test'
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-26',
          tom: '2020-02-27',
        },
      },
      {
        vilkarStatus: vilkårStatus.OPPFYLT, // kodeverk: 'test'
        vurderesIBehandlingen: true,
        periode: {
          fom: '2020-02-28',
          tom: '2020-02-29',
        },
      },
    ],
  },
];

const soknadsStatus = {
  dokumentStatus: [
    {
      type: kravDokumentStatusType.SØKNAD, // kodeverk: 'test'
      status: [
        {
          periode: { fom: '2020-02-20', tom: '2020-02-25' },
          status: vilkårStatus.IKKE_OPPFYLT, // kodeverk: 'test'
        },
      ],
      innsendingstidspunkt: '2020-06-01',
      journalpostId: '12345',
    },
    {
      type: kravDokumentStatusType.SØKNAD, // kodeverk: 'test'
      status: [
        {
          periode: { fom: '2020-02-26', tom: '2020-02-27' },
          status: vilkårStatus.IKKE_OPPFYLT, // kodeverk: 'test'
        },
      ],
      innsendingstidspunkt: '2020-06-01',
      journalpostId: '23456',
    },
  ],
};

const meta: Meta<typeof SoknadsfristVilkarProsessIndex> = {
  title: 'prosess/prosess-vilkar-soknadsfrist-v2',
  component: SoknadsfristVilkarProsessIndex,
};

type Story = StoryObj<typeof meta>;

const behandling = {
  versjon: 1,
};

export const visOverstyringspanelForSoknadsfrist: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      employeeHasAccess: true,
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        behandling={behandling}
        aksjonspunkter={[]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={soknadsStatus}
        panelTittelKode="Søknadsfrist"
        vilkar={vilkarSoknadsfrist}
        kanEndrePåSøknadsopplysninger
      />
    );
  },
};

export const visOverstyringspanelForSoknadsfristUtenDokumenter: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      employeeHasAccess: true,
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        behandling={behandling}
        aksjonspunkter={[]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={{ dokumentStatus: [] }}
        panelTittelKode="Søknadsfrist"
        vilkar={vilkarSoknadsfrist}
        kanEndrePåSøknadsopplysninger
      />
    );
  },
};

export const VisSoknadsfristAksjonspunkt5077: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      employeeHasAccess: true,
      isEnabled: true,
    },
    submitCallback: fn(),
  },

  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    await step('skal formatere data ved innsending ved oppfylt vilkår', async () => {
      await userEvent.click(canvas.getByText('28.04.2021 - 30.04.2021'));
      await userEvent.click(canvas.getByText('Vilkåret er oppfylt for hele perioden'));
      await userEvent.type(
        canvas.getByLabelText('Vurder om det har vært fristavbrytende kontakt'),
        'Dette er en begrunnelse',
      );
      await waitFor(() => expect(canvas.getByText('Bekreft og gå videre')).toBeEnabled());
      await userEvent.click(canvas.getByText('Bekreft og gå videre'));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      expect(args.submitCallback).toHaveBeenNthCalledWith(1, [
        {
          avklarteKrav: [
            {
              begrunnelse: 'Dette er en begrunnelse',
              erVilkarOk: true,
              fraDato: '2021-04-27',
              godkjent: true,
              journalpostId: '510536417',
            },
          ],
          begrunnelse: 'Dette er en begrunnelse',
          erVilkarOk: true,
          kode: '5077',
          periode: {
            fom: '2021-04-28',
            tom: '2021-04-30',
          },
        },
      ]);
    });

    await step('skal formatere data ved innsending ved delvis oppfylt vilkår', async () => {
      await userEvent.click(canvas.getByText('28.04.2021 - 30.04.2021'));
      await userEvent.click(canvas.getByText('Vilkåret er oppfylt for deler av perioden'));
      await userEvent.type(canvas.getByLabelText('Oppgi dato søknadsfristvilkåret er oppfylt fra'), '03.05.2021');
      await waitFor(() => expect(canvas.getByText('Bekreft og gå videre')).toBeEnabled());
      await userEvent.click(canvas.getByText('Bekreft og gå videre'));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(2));
      expect(args.submitCallback).toHaveBeenNthCalledWith(2, [
        {
          avklarteKrav: [
            {
              begrunnelse: 'Dette er en begrunnelse',
              erVilkarOk: true,
              fraDato: '2021-05-02',
              godkjent: true,
              journalpostId: '510536417',
            },
          ],
          begrunnelse: 'Dette er en begrunnelse',
          erVilkarOk: true,
          kode: '5077',
          periode: {
            fom: '2021-04-28',
            tom: '2021-04-30',
          },
        },
      ]);
    });

    await step('skal formatere data ved innsending ved ikke oppfylt vilkår', async () => {
      await userEvent.click(canvas.getByText('28.04.2021 - 30.04.2021'));
      await userEvent.click(canvas.getByLabelText('ikke', { exact: false }));
      await waitFor(() => expect(canvas.getByText('Bekreft og gå videre')).toBeEnabled());
      await userEvent.click(canvas.getByText('Bekreft og gå videre'));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(3));
      expect(args.submitCallback).toHaveBeenNthCalledWith(3, [
        {
          avklarteKrav: [
            {
              begrunnelse: 'Dette er en begrunnelse',
              erVilkarOk: false,
              fraDato: '2021-04-30',
              godkjent: false,
              journalpostId: '510536417',
            },
          ],
          begrunnelse: 'Dette er en begrunnelse',
          erVilkarOk: false,
          kode: '5077',
          periode: {
            fom: '2021-04-28',
            tom: '2021-04-30',
          },
        },
      ]);
    });
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        behandling={behandling}
        aksjonspunkter={[
          {
            aksjonspunktType: aksjonspunktType.MANUELL,
            definisjon: '5077', // kodeverk: 'AKSJONSPUNKT_DEF'
            kanLoses: true,
            status: aksjonspunktStatus.OPPRETTET, // kodeverk: 'AKSJONSPUNKT_STATUS'
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
                  status: 'IKKE_VURDERT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                },
                {
                  periode: { fom: '2021-05-01', tom: '2021-05-05' },
                  status: 'OPPFYLT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                },
              ],
              innsendingstidspunkt: '2021-08-19T11:50:21.894',
              journalpostId: '510536417',
            },
          ],
        }}
        panelTittelKode="Søknadsfrist"
        vilkar={[
          {
            perioder: [
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: 'IKKE_VURDERT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                periode: { fom: '2021-04-28', tom: '2021-04-30' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: 'OPPFYLT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                periode: { fom: '2021-05-01', tom: '2021-05-05' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
            ],
          },
        ]}
        kanEndrePåSøknadsopplysninger
      />
    );
  },
};

export const visSoknadsfristAksjonspunkt5077Delvis: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      employeeHasAccess: true,
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        behandling={behandling}
        aksjonspunkter={[
          {
            aksjonspunktType: 'MANU', // kodeverk: 'AKSJONSPUNKT_TYPE'
            begrunnelse: [
              'jsdfsdf ljksdlkfj sldjf lsdkjf lsjdf\n\n\n',
              'sdsdfs øjjølksdjfølkjsd fjsd s fløskjdflsjd f\n\n\n',
              'sdklfjsøl jølsdjfø lsjdfljsldøjf sdjf slødjf sld\n\n\n',
              'sldfj sljfølsjd fløsdlfj øsldjf lsøjdfølsdjfløsjd lsdfs',
            ].join(''),
            definisjon: '5077', // kodeverk: 'AKSJONSPUNKT_DEF'
            kanLoses: false,
            status: 'UTFO', // kodeverk: 'AKSJONSPUNKT_STATUS'
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
                  status: 'IKKE_OPPFYLT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                },
                {
                  periode: { fom: '2021-04-28', tom: '2021-05-06' },
                  status: 'OPPFYLT', // kodeverk: 'VILKAR_UTFALL_TYPE'
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
            },
          ],
        }}
        panelTittelKode="Søknadsfrist"
        vilkar={[
          {
            perioder: [
              {
                avslagKode: '1007',
                merknadParametere: {},
                vilkarStatus: 'IKKE_OPPFYLT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                periode: { fom: '2021-04-26', tom: '2021-04-27' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: 'OPPFYLT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                periode: { fom: '2021-04-28', tom: '2021-04-30' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: 'OPPFYLT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                periode: { fom: '2021-05-01', tom: '2021-05-06' },
                begrunnelse: null,
                vurderesIBehandlingen: true,
              },
            ],
          },
        ]}
        kanEndrePåSøknadsopplysninger
      />
    );
  },
};

export const VisSoknadsfristAksjonspunkt5077FlereSøknader: Story = {
  args: {
    overrideReadOnly: false,
    kanOverstyreAccess: {
      employeeHasAccess: true,
      isEnabled: true,
    },
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        behandling={{
          versjon: 40,
        }}
        aksjonspunkter={[
          {
            aksjonspunktType: 'MANU', // kodeverk: 'AKSJONSPUNKT_TYPE'
            definisjon: '5077', // kodeverk: 'AKSJONSPUNKT_DEF'
            kanLoses: true,
            status: 'OPPR', // kodeverk: 'AKSJONSPUNKT_STATUS'
          },
        ]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={{
          dokumentStatus: [
            {
              type: 'SØKNAD', // kodeverk: 'dokumentStatus'
              status: [
                {
                  periode: {
                    fom: '2024-03-25',
                    tom: '2024-03-29',
                  },
                  status: 'IKKE_VURDERT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                },
              ],
              innsendingstidspunkt: '2024-09-05T13:01:56.322',
              journalpostId: '671129216',
            },
            {
              type: 'SØKNAD', // kodeverk: 'dokumentStatus'
              status: [
                {
                  periode: {
                    fom: '2024-03-04',
                    tom: '2024-03-08',
                  },
                  status: 'IKKE_VURDERT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                },
              ],
              innsendingstidspunkt: '2024-09-05T13:00:44.446',
              journalpostId: '671129199',
            },
            {
              type: 'SØKNAD',
              status: [
                {
                  periode: {
                    fom: '2024-04-15',
                    tom: '2024-04-19',
                  },
                  status: 'IKKE_VURDERT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                },
              ],
              innsendingstidspunkt: '2024-09-05T13:03:07.003',
              journalpostId: '671129200',
            },
          ],
        }}
        panelTittelKode="Søknadsfrist"
        vilkar={[
          {
            lovReferanse: '§ 22-13 tredje ledd',
            perioder: [
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: 'IKKE_VURDERT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                periode: {
                  fom: '2024-03-04',
                  tom: '2024-03-08',
                },
                begrunnelse: null,
                vurderesIBehandlingen: true,
                vurdersIBehandlingen: true,
              },
              {
                avslagKode: null,
                merknadParametere: {},
                vilkarStatus: 'IKKE_VURDERT', // kodeverk: 'VILKAR_UTFALL_TYPE'
                periode: {
                  fom: '2024-03-25',
                  tom: '2024-03-29',
                },
                begrunnelse: null,
                vurderesIBehandlingen: true,
                vurdersIBehandlingen: true,
              },
            ],
          },
        ]}
        kanEndrePåSøknadsopplysninger
      />
    );
  },
};

export default meta;
