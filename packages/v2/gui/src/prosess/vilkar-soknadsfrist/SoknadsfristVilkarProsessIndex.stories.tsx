import React from 'react';

import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { kravDokumentStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/KravDokumentStatus.js';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor } from '@storybook/test';
import SoknadsfristVilkarProsessIndex from './SoknadsfristVilkarProsessIndex';

const vilkarSoknadsfrist = [
  {
    vilkarType: vilkarType.SØKNADSFRIST, // kodeverk: 'test'
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
  title: 'gui/prosess/vilkar-soknadsfrist',
  component: SoknadsfristVilkarProsessIndex,
};

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  panelTittelKode: 'Søknadsfrist',
  kanEndrePåSøknadsopplysninger: true,
};

export const visOverstyringspanelForSoknadsfrist: Story = {
  args: {
    ...defaultArgs,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise overskrift og lovparagraf', async () => {
      await userEvent.click(canvas.getByText('26.02.2020 - 27.02.2020'));
      await userEvent.click(canvas.getByRole('button', { name: 'Overstyring av søknadsfristvilkåret' }));
      expect(
        canvas.getAllByText(
          (_, element) => element?.textContent === 'SØKNAD innsendt 01.06.2020 (journalpostId: 23456)',
        )[0],
      ).toBeInTheDocument();
      expect(canvas.getAllByText('Vilkåret er oppfylt for hele perioden').length).toBe(2);
      expect(canvas.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
    });
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        aksjonspunkter={[]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={soknadsStatus}
        vilkar={vilkarSoknadsfrist}
      />
    );
  },
};

export const visOverstyringspanelForSoknadsfristUtenDokumenter: Story = {
  args: {
    ...defaultArgs,
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        aksjonspunkter={[]}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
        erOverstyrt={erOverstyrt}
        soknadsfristStatus={{ dokumentStatus: [] }}
        vilkar={vilkarSoknadsfrist}
      />
    );
  },
};

export const VisSoknadsfristAksjonspunkt5077: Story = {
  args: {
    ...defaultArgs,
    submitCallback: fn(),
  },

  play: async ({ canvas, step, args }) => {
    await step('skal vise overskrift og lovparagraf', () => {
      expect(canvas.getByRole('heading', { name: 'Søknadsfrist' })).toBeInTheDocument();
      expect(canvas.getByText('§')).toBeInTheDocument();
      expect(canvas.getByText('22-13')).toBeInTheDocument();
    });

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
      />
    );
  },
};

export const visSoknadsfristAksjonspunkt5077Delvis: Story = {
  args: {
    ...defaultArgs,
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
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
      />
    );
  },
};

export const VisSoknadsfristAksjonspunkt5077FlereSøknader: Story = {
  args: {
    ...defaultArgs,
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
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
      />
    );
  },
};

export const EnSpesiellHistorie: Story = {
  args: {
    ...defaultArgs,
    aksjonspunkter: [
      {
        aksjonspunktType: 'SAOV',
        begrunnelse:
          'bebebebe\ngbegbebebe\nbebebebebe\nbebebebe\nekte\nbebebebebebbe\nbebebebe\nbebebebebe\nbebebebebebebebe',
        besluttersBegrunnelse: null,
        definisjon: '6006',
        erAktivt: true,
        fristTid: null,
        kanLoses: false,
        status: 'UTFO',
        toTrinnsBehandling: true,
        toTrinnsBehandlingGodkjent: null,
        vilkarType: 'FP_VK_3',
        vurderPaNyttArsaker: null,
        venteårsak: {
          kanVelgesIGui: false,
          kode: '-',
          ventekategori: null,
          kodeverk: 'VENT_AARSAK',
        },
        venteårsakVariant: null,
        opprettetAv: 'Z994588',
      },
    ],
    erOverstyrt: false,
    kanEndrePåSøknadsopplysninger: true,
    soknadsfristStatus: {
      dokumentStatus: [
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-09-17',
                tom: '2024-09-18',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:47:00',
          journalpostId: '453905499',
          avklarteOpplysninger: null,
          overstyrteOpplysninger: null,
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-04-11',
                tom: '2024-04-11',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:16:00',
          journalpostId: '453905477',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'bebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.667',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-04-10',
            begrunnelse: 'bebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-05-06',
                tom: '2024-05-16',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:22:00',
          journalpostId: '453905500',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'bebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.667',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-05-05',
            begrunnelse: 'bebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-03-26',
                tom: '2024-03-27',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:05:00',
          journalpostId: '453905481',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'bebebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.668',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-03-25',
            begrunnelse: 'bebebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-03-07',
                tom: '2024-12-31',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-11-20T09:24:00',
          journalpostId: '453905495',
          avklarteOpplysninger: {
            godkjent: true,
            fraDato: '2024-07-31',
            begrunnelse: 'bababababa',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.667',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-03-06',
            begrunnelse: 'ekte',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-05-21',
                tom: '2024-05-21',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:27:00',
          journalpostId: '453905479',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'gbegbebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.668',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-05-20',
            begrunnelse: 'gbegbebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-06-16',
                tom: '2024-06-19',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:40:00',
          journalpostId: '453905497',
          avklarteOpplysninger: null,
          overstyrteOpplysninger: null,
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-05-02',
                tom: '2024-05-03',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:15:00',
          journalpostId: '453905498',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'bebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.667',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-05-01',
            begrunnelse: 'bebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-04-15',
                tom: '2024-04-23',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:10:00',
          journalpostId: '453905483',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'bebebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.667',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-04-14',
            begrunnelse: 'bebebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-03-20',
                tom: '2024-03-20',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:02:00',
          journalpostId: '453905496',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'bebebebebebbe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.667',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-03-19',
            begrunnelse: 'bebebebebebbe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-05-28',
                tom: '2024-05-31',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:31:00',
          journalpostId: '453905501',
          avklarteOpplysninger: {
            godkjent: false,
            fraDato: '2024-05-31',
            begrunnelse: 'bebebebebebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:21:56.668',
          },
          overstyrteOpplysninger: {
            godkjent: true,
            fraDato: '2024-05-27',
            begrunnelse: 'bebebebebebebebe',
            opprettetAv: 'Z994588',
            opprettetTidspunkt: '2024-12-06T09:52:32.476',
          },
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-09-09',
                tom: '2024-09-12',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:44:00',
          journalpostId: '453905494',
          avklarteOpplysninger: null,
          overstyrteOpplysninger: null,
        },
        {
          type: 'SØKNAD',
          status: [
            {
              periode: {
                fom: '2024-08-01',
                tom: '2024-08-01',
              },
              status: 'OPPFYLT',
            },
          ],
          innsendingstidspunkt: '2024-09-27T10:42:00',
          journalpostId: '453905391',
          avklarteOpplysninger: null,
          overstyrteOpplysninger: null,
        },
      ],
    },
    vilkar: [
      {
        vilkarType: 'FP_VK_3',
        lovReferanse: '§ 22-13 tredje ledd',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: null,
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2024-03-07',
              tom: '2024-12-31',
            },
            begrunnelse: null,
            vurderesIBehandlingen: true,
            vurdersIBehandlingen: true,
            merknad: '-',
          },
        ],
      },
    ],
    visAllePerioder: false,
  },
  render: props => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <SoknadsfristVilkarProsessIndex
        {...props}
        submitCallback={action('button-click')}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      />
    );
  },
};

export default meta;
