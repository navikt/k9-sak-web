import type { AksjonspunktDto, BehandlingDto, EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react';
import VurderOverlappendeSak, { type BekreftVurderOverlappendeSakerAksjonspunktRequest } from './VurderOverlappendeSak';

import { HStack } from '@navikt/ds-react';
import { expect, fn, userEvent, within } from '@storybook/test';
import dayjs from 'dayjs';
import { FakeBehandlingUttakBackendApi } from '../../../storybook/mocks/FakeBehandlingUttakBackendApi';
import { stdDato, visnDato } from '../../../utils/formatters';

dayjs.locale('nb');

const fom1 = dayjs().subtract(4, 'week');
const tom1 = dayjs().subtract(3, 'week');
const fom2 = dayjs().subtract(2, 'week');
const tom2 = dayjs().subtract(1, 'week');
const splittFom = fom1.add(2, 'day');
const splittTom = splittFom.add(2, 'day');

const førstePeriodeMedOverlapp = {
  periode: { fom: fom1.toISOString(), tom: tom1.toISOString() },
  skalVurderes: true,
  saksnummer: ['ABCDE'],
};

const andrePeriodeMedOverlapp = {
  periode: { fom: fom2.toISOString(), tom: tom2.toISOString() },
  skalVurderes: true,
  saksnummer: ['FGHIJ'],
};

const egneOverlappendeSakerDtoer = [
  {
    // array index 0 matcher med sak med uuid 0 i testdataene
    perioderMedOverlapp: [
      {
        fastsattUttaksgrad: null,
        saksbehandler: null,
        vurdertTidspunkt: null,
        ...førstePeriodeMedOverlapp,
      },
      {
        fastsattUttaksgrad: null,
        saksbehandler: null,
        vurdertTidspunkt: null,
        ...andrePeriodeMedOverlapp,
      },
    ],
  },
  {
    // array index 1 matcher med sak med uuid 1 i testdataene
    perioderMedOverlapp: [
      {
        fastsattUttaksgrad: 60.0,
        saksbehandler: 'Sara Sak',
        vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
        valg: 'JUSTERT_GRAD',
        ...førstePeriodeMedOverlapp,
      },
      {
        fastsattUttaksgrad: 70.0,
        saksbehandler: 'Sara Sak',
        valg: 'JUSTERT_GRAD',
        vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
        ...andrePeriodeMedOverlapp,
      },
    ],
  },
  {
    // array index 2 matcher med sak med uuid 2 i testdataene
    perioderMedOverlapp: [
      {
        fastsattUttaksgrad: 50.0,
        saksbehandler: 'Sara Sak',
        vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
        valg: 'JUSTERT_GRAD',
        ...førstePeriodeMedOverlapp,
      },
      {
        fastsattUttaksgrad: 30.0,
        saksbehandler: 'Sara Sak',
        valg: 'JUSTERT_GRAD',
        vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
        ...andrePeriodeMedOverlapp,
      },
    ],
  },
];

const bekreftAksjonspunktRequest: BekreftVurderOverlappendeSakerAksjonspunktRequest = {
  behandlingId: '123',
  behandlingVersjon: 1,
  bekreftedeAksjonspunktDtoer: [
    {
      '@type': '9292',
      kode: '9292',
      begrunnelse: 'Dette er en grundig begrunnelse',
      perioder: [
        {
          // k9-sak påkrever begrunnelse i hver periode, og det kan ikke være en tom streng
          begrunnelse: 'Dette er en grundig begrunnelse',
          periode: { fom: stdDato(fom1), tom: stdDato(tom1) },
          valg: 'JUSTERT_GRAD',
          søkersUttaksgrad: 40,
        },
        {
          begrunnelse: 'Dette er en grundig begrunnelse',
          periode: { fom: stdDato(fom2), tom: stdDato(tom2) },
          valg: 'JUSTERT_GRAD',
          søkersUttaksgrad: 60,
        },
      ],
    },
  ],
};

const bekreftAksjonspunktMedSplittRequest: BekreftVurderOverlappendeSakerAksjonspunktRequest = {
  behandlingId: '123',
  behandlingVersjon: 1,
  bekreftedeAksjonspunktDtoer: [
    {
      '@type': '9292',
      kode: '9292',
      begrunnelse: 'Dette er en grundig begrunnelse',
      perioder: [
        {
          // k9-sak påkrever begrunnelse i hver periode, og det kan ikke være en tom streng
          begrunnelse: 'Dette er en grundig begrunnelse',
          periode: { fom: stdDato(fom1), tom: stdDato(splittFom.subtract(1, 'day')) },
          valg: 'JUSTERT_GRAD',
          søkersUttaksgrad: 40,
        },
        {
          // k9-sak påkrever begrunnelse i hver periode, og det kan ikke være en tom streng
          begrunnelse: 'Dette er en grundig begrunnelse',
          periode: { fom: stdDato(splittFom), tom: stdDato(splittTom) },
          valg: 'JUSTERT_GRAD',
          søkersUttaksgrad: 40,
        },
        {
          // k9-sak påkrever begrunnelse i hver periode, og det kan ikke være en tom streng
          begrunnelse: 'Dette er en grundig begrunnelse',
          periode: { fom: stdDato(splittTom.add(1, 'day')), tom: stdDato(tom1) },
          valg: 'JUSTERT_GRAD',
          søkersUttaksgrad: 40,
        },
        {
          begrunnelse: 'Dette er en grundig begrunnelse',
          periode: { fom: stdDato(fom2), tom: stdDato(tom2) },
          valg: 'INGEN_JUSTERING',
          søkersUttaksgrad: undefined,
        },
      ],
    },
  ],
};

const api = new FakeBehandlingUttakBackendApi(egneOverlappendeSakerDtoer as EgneOverlappendeSakerDto[]);
const meta = {
  title: 'gui/prosess/Uttak/Overlappende-Saker',
  component: VurderOverlappendeSak,
  beforeEach: () => {
    api.reset();
  },
} satisfies Meta<typeof VurderOverlappendeSak>;

type Story = StoryObj<typeof meta>;

const behandling: Omit<BehandlingDto, 'uuid' | 'status'> = {
  opprettet: dayjs().subtract(5, 'day').toISOString(),
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  type: 'BT-002',
  versjon: 1,
  id: 123,
};

const uløstBehandling: BehandlingDto = {
  uuid: '0', // match med array index for egneOverlappendeSaker endepunktet for å returnere riktig overlappende saker
  status: 'UTRED',
  ...behandling,
};

const løstBehandling: BehandlingDto = {
  uuid: '1', // match med array index for egneOverlappendeSaker endepunktet for å returnere riktig overlappende saker
  status: 'UTRED',
  ...behandling,
};

const avsluttetBehandling: BehandlingDto = {
  uuid: '1', // match med array index for egneOverlappendeSaker endepunktet for å returnere riktig overlappende saker
  status: 'AVSLU',
  ...behandling,
};

const redigerBehandling: BehandlingDto = {
  uuid: '2', // match med array index for egneOverlappendeSaker endepunktet for å returnere riktig overlappende saker
  status: 'UTRED',
  ...behandling,
};

const aksjonspunkt: AksjonspunktDto = {
  aksjonspunktType: 'MANU',
  erAktivt: true,
  besluttersBegrunnelse: undefined,
  definisjon: '9292',
  fristTid: undefined,
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: undefined,
  vilkarType: undefined,
  vurderPaNyttArsaker: undefined,
  venteårsak: '-',
  venteårsakVariant: undefined,
  opprettetAv: 'vtp',
};

const uløstAksjonspunkt: AksjonspunktDto = {
  begrunnelse: undefined,
  kanLoses: true,
  status: 'OPPR',
  ...aksjonspunkt,
};

const løstAksjonspunkt: AksjonspunktDto = {
  begrunnelse: 'Dette er en grundig begrunnelse',
  kanLoses: false,
  status: 'UTFO',
  ...aksjonspunkt,
};

const løstAksjonspunktFerdigstilt: AksjonspunktDto = {
  begrunnelse: 'Dette er en grundig begrunnelse',
  kanLoses: false,
  status: 'UTFO',
  ...aksjonspunkt,
};

const oppdaterBehandling = fn();

const vurderLabel = 'Vurder uttak i denne saken for perioden';

const gruppeEnNavn = `Vurder uttak i denne saken for perioden ${visnDato(fom1)} - ${visnDato(tom1)} Splitt periode`;
const gruppeToNavn = `Vurder uttak i denne saken for perioden ${visnDato(fom2)} - ${visnDato(tom2)} Splitt periode`;

export const Aksjonspunkt: Story = {
  args: { behandling: uløstBehandling, aksjonspunkt: uløstAksjonspunkt, readOnly: false, api, oppdaterBehandling },
  play: async ({ canvasElement, step }) => {
    const canvas = await within(canvasElement);

    await step('skal ha infoboks med detaljer om overlappende perioder og lenker til saker med overlapp', async () => {
      await expect(await canvas.findByRole('heading', { name: 'Uttaksgrad for overlappende perioder' }));
      await expect(await canvas.findByText('Perioder som overlapper med sak:'));
      await expect(await canvas.findByRole('link', { name: 'ABCDE' }));
      await expect(await canvas.findByRole('link', { name: 'FGHIJ' }));
    });

    const gruppeEn = within(canvas.getByRole('group', { name: gruppeEnNavn }));
    const gruppeTo = within(canvas.getByRole('group', { name: gruppeToNavn }));

    await step('skal ha skjema for å sette uttaksgrad for første overlappende sak', async () => {
      await expect(await gruppeEn.findByText(vurderLabel));
      await expect(await gruppeEn.findByRole('button', { name: 'Splitt periode' }));
      await expect(await gruppeEn.findByRole('radio', { name: 'Ingen uttak i perioden' }));
      await expect(await gruppeEn.findByRole('radio', { name: 'Vanlig uttak i perioden' }));
    });

    await step('skal ha skjema for å sette uttaksgrad for andre overlappende sak', async () => {
      await expect(await gruppeTo.findByText(vurderLabel));
      await expect(await gruppeTo.findByRole('button', { name: 'Splitt periode' }));
      await expect(await gruppeTo.findByRole('radio', { name: 'Ingen uttak i perioden' }));
      await expect(await gruppeTo.findByRole('radio', { name: 'Vanlig uttak i perioden' }));
      await expect(await gruppeTo.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
      await expect(await canvas.findByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    });
  },
  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export const LøsAksjonspunkt: Story = {
  args: { behandling: uløstBehandling, aksjonspunkt: uløstAksjonspunkt, readOnly: false, api, oppdaterBehandling },
  play: async ({ args, canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = await within(canvasElement);

    await step('skal ha infoboks med detaljer om overlappende perioder og lenker til saker med overlapp', async () => {
      await expect(await canvas.findByRole('heading', { name: 'Uttaksgrad for overlappende perioder' }));
      await expect(await canvas.findByText('Perioder som overlapper med sak:'));
      await expect(await canvas.findByRole('link', { name: 'ABCDE' }));
      await expect(await canvas.findByRole('link', { name: 'FGHIJ' }));
    });

    const gruppeEn = within(canvas.getByRole('group', { name: gruppeEnNavn }));
    const gruppeTo = within(canvas.getByRole('group', { name: gruppeToNavn }));

    await step('skal ha skjema for å sette uttaksgrad for første overlappende sak', async () => {
      await expect(await gruppeEn.findByText(vurderLabel));
      await expect(await gruppeEn.findByRole('button', { name: 'Splitt periode' }));
      await expect(await gruppeEn.findByRole('radio', { name: 'Ingen uttak i perioden' }));
      await expect(await gruppeEn.findByRole('radio', { name: 'Vanlig uttak i perioden' }));
    });

    await step('skal ha skjema for å sette uttaksgrad for andre overlappende sak', async () => {
      await expect(await gruppeTo.findByText(vurderLabel));
      await expect(await gruppeTo.findByRole('button', { name: 'Splitt periode' }));
      await expect(await gruppeTo.findByRole('radio', { name: 'Ingen uttak i perioden' }));
      await expect(await gruppeTo.findByRole('radio', { name: 'Vanlig uttak i perioden' }));
      await expect(await gruppeTo.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
    });

    await step('skal kunne løse aksjonspunkt for overlappende saker', async () => {
      await user.click(await gruppeEn.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
      await user.type(
        await canvas.findByRole('textbox', { name: 'Sett uttaksgrad for perioden (i prosent)' }),
        `${bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[0]?.søkersUttaksgrad}`,
      );

      await user.click(await gruppeTo.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
      const felt2 = (await canvas.findAllByRole('textbox', { name: 'Sett uttaksgrad for perioden (i prosent)' }))[1];
      await expect(felt2).toBeDefined();
      if (felt2)
        await user.type(
          felt2,
          `${bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[1]?.søkersUttaksgrad}`,
        );

      await user.type(
        await canvas.findByLabelText('Begrunnelse'),
        bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[0]?.begrunnelse || '',
      );

      await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(args.oppdaterBehandling).toHaveBeenCalled();
      await expect(api.sisteBekreftAksjonspunktResultat).toEqual(bekreftAksjonspunktRequest);
    });
  },
  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export const LøsAksjonspunktMedSplitt: Story = {
  args: { behandling: uløstBehandling, aksjonspunkt: uløstAksjonspunkt, readOnly: false, api, oppdaterBehandling },
  play: async ({ args, canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = await within(canvasElement);

    await step('skal kunne plitte perioder som overlapper', async () => {
      await step('skal kunne trykke på splitt periode-knapp', async () => {
        await expect(await canvas.findByRole('link', { name: 'ABCDE' }));
        await expect(await canvas.findByRole('link', { name: 'FGHIJ' }));
        const gruppeEn = within(canvas.getByRole('group', { name: gruppeEnNavn }));

        await user.click(await gruppeEn.findByRole('radio', { name: 'Tilpass uttaksgrad' }));

        await user.type(
          await canvas.findByRole('textbox', { name: 'Sett uttaksgrad for perioden (i prosent)' }),
          `${bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[0]?.søkersUttaksgrad}`,
        );
        await user.click(await gruppeEn.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
        await user.click(await gruppeEn.findByRole('button', { name: 'Splitt periode' }));
        await expect(await canvas.findByRole('grid', { name: `${fom1.format('MMMM YYYY')}` }));
      });

      await step('dagene før og etter perioden som skal splittes skal være disabled', async () => {
        const dagenFør = fom1.subtract(1, 'day');
        const dagenEtter = tom1.add(1, 'day');

        if (fom1.isSame(dagenFør, 'month')) {
          await expect(await canvas.findByRole('button', { name: `${dagenFør.format('dddd D')}` })).toBeDisabled();
        } else {
          await user.click(await canvas.findByRole('button', { name: 'Gå til forrige måned' }));
          await expect(await canvas.findByRole('button', { name: `${dagenFør.format('dddd D')}` })).toBeDisabled();
          await user.click(await canvas.findByRole('button', { name: 'Gå til neste måned' }));
        }

        if (fom1.isSame(dagenEtter, 'month')) {
          await expect(await canvas.findByRole('button', { name: `${dagenEtter.format('dddd D')}` })).toBeDisabled();
        } else {
          await user.click(await canvas.findByRole('button', { name: 'Gå til neste måned' }));
          await expect(await canvas.findByRole('button', { name: `${dagenEtter.format('dddd D')}` })).toBeDisabled();
          await user.click(await canvas.findByRole('button', { name: 'Gå til forrige måned' }));
        }
      });

      await step('skjemaet skal oppdatere seg når man velger en periode', async () => {
        if (splittFom.isAfter(fom1, 'month')) {
          await user.click(await canvas.findByRole('button', { name: `Gå til neste måned` }));
        }

        await user.click(await canvas.findByRole('button', { name: `${splittFom.format('dddd D')}` }));
        const splittTomButton = await canvas.findByRole('button', { name: `${splittTom.format('dddd D')}` });
        if (splittTomButton.className.includes('rdp-day_disabled')) {
          await user.click(await canvas.findByRole('button', { name: `Gå til neste måned` }));
          await user.click(await canvas.findByRole('button', { name: `${splittTom.format('dddd D')}` }));
        } else {
          await user.click(splittTomButton);
        }

        await expect(
          await canvas.findByRole('group', {
            name: `Vurder uttak i denne saken for perioden ${visnDato(fom1)} - ${visnDato(splittFom.subtract(1, 'day'))} Splitt periode Slett periode Hvor kommer dette fra?`,
          }),
        );

        await expect(
          await canvas.findByRole('group', {
            name: `Vurder uttak i denne saken for perioden ${visnDato(splittFom)} - ${visnDato(splittTom)} Splitt periode Slett periode Hvor kommer dette fra?`,
          }),
        );

        await expect(
          await canvas.findByRole('group', {
            name: `Vurder uttak i denne saken for perioden ${visnDato(splittTom.add(1, 'day'))} - ${visnDato(tom1)} Splitt periode Slett periode Hvor kommer dette fra?`,
          }),
        );

        await expect(
          await canvas.findByRole('group', {
            name: `Vurder uttak i denne saken for perioden ${visnDato(fom2)} - ${visnDato(tom2)} Splitt periode`,
          }),
        );
      });

      await step('Skal kunne sende inn skjemaet', async () => {
        const gruppeTo = within(canvas.getByRole('group', { name: gruppeToNavn }));
        await user.click(await gruppeTo.findByRole('radio', { name: 'Vanlig uttak i perioden' }));
        await user.type(
          await canvas.findByLabelText('Begrunnelse'),
          bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[0]?.begrunnelse || '',
        );
        await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));

        await expect(args.oppdaterBehandling).toHaveBeenCalled();
        await expect(api.sisteBekreftAksjonspunktResultat).toEqual(bekreftAksjonspunktMedSplittRequest);
      });
    });
  },
  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export const LøstAksjonspunkt: Story = {
  args: { behandling: løstBehandling, aksjonspunkt: løstAksjonspunkt, readOnly: false, api, oppdaterBehandling: fn() },

  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export const LøstAksjonspunktKanRedigeres: Story = {
  args: {
    behandling: redigerBehandling,
    aksjonspunkt: løstAksjonspunkt,
    readOnly: false,
    api,
    oppdaterBehandling: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await step('skal vise lesevisning av skjema for uttaksgrad for overlappende saker', async () => {
      await expect(await canvas.findByRole('heading', { name: 'Uttaksgrad for overlappende perioder' }));

      (await canvas.findAllByRole('radio', { name: 'Tilpass uttaksgrad' })).forEach(async radio => {
        await expect(radio).toBeChecked();
        await (await canvas.findAllByRole('radio', { name: 'Ingen uttak i perioden' })).forEach(r => user.click(r));
        await expect(radio).toBeChecked();
      });

      await expect(
        await canvas.findByDisplayValue(
          egneOverlappendeSakerDtoer[redigerBehandling.uuid as unknown as number]?.perioderMedOverlapp[0]
            ?.fastsattUttaksgrad || '',
        ),
      ).toHaveAttribute('readonly');

      await expect(
        await canvas.findByDisplayValue(
          egneOverlappendeSakerDtoer[redigerBehandling.uuid as unknown as number]?.perioderMedOverlapp[1]
            ?.fastsattUttaksgrad || '',
        ),
      ).toHaveAttribute('readonly');

      await expect(await canvas.findByRole('textbox', { name: 'Begrunnelse' })).toHaveAttribute('readonly');
    });

    await step('skal kunne redigere skjema for uttaksgrad for overlappende saker', async () => {
      await user.click(await canvas.findByRole('button', { name: 'Rediger' }));

      const gruppeEn = within(
        canvas.getByRole('group', {
          name: new RegExp(`Vurder uttak i denne saken for perioden ${visnDato(fom1)} - ${visnDato(tom1)}`, 'i'),
        }),
      );

      await user.click(await gruppeEn.findByRole('radio', { name: 'Vanlig uttak i perioden' }));
    });
  },
  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export const LøstAksjonspunktAvsluttetSak: Story = {
  args: {
    behandling: avsluttetBehandling,
    aksjonspunkt: løstAksjonspunktFerdigstilt,
    readOnly: true,
    api,
    oppdaterBehandling: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await step('skal vise leseversjon av skjema i avsluttet sak', async () => {
      await expect(await canvas.findByRole('heading', { name: 'Uttaksgrad for overlappende perioder' }));

      (await canvas.findAllByRole('radio', { name: 'Tilpass uttaksgrad' })).forEach(async radio => {
        await expect(radio).toBeChecked();
        await (await canvas.findAllByRole('radio', { name: 'Ingen uttak i perioden' })).forEach(r => user.click(r));
        await expect(radio).toBeChecked();
      });
      await expect(
        await canvas.findByDisplayValue(
          egneOverlappendeSakerDtoer[avsluttetBehandling.uuid as unknown as number]?.perioderMedOverlapp[0]
            ?.fastsattUttaksgrad || '',
        ),
      ).toHaveAttribute('readonly');

      await expect(
        await canvas.findByDisplayValue(
          egneOverlappendeSakerDtoer[avsluttetBehandling.uuid as unknown as number]?.perioderMedOverlapp[1]
            ?.fastsattUttaksgrad || '',
        ),
      ).toHaveAttribute('readonly');

      await expect(await canvas.queryByRole('button', { name: 'Rediger' })).not.toBeInTheDocument();
      await expect(await canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });
  },
  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export default meta;
