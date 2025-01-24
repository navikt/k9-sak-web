import type { Meta, StoryObj } from '@storybook/react';
import type { AksjonspunktDto, BehandlingDto, EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/generated';
import VurderOverlappendeSak, { type BekreftVurderOverlappendeSakerAksjonspunktRequest } from './VurderOverlappendeSak';
import { FakeBehandlingUttakBackendApi } from '../../../storybook/mocks/FakeBehandlingUttakBackendApi';
import { formatDate, subDays, subWeeks } from 'date-fns';
import { userEvent, within, expect, fireEvent, fn } from '@storybook/test';
import { HStack } from '@navikt/ds-react';

const fom1 = subWeeks(new Date(), 4);
const tom1 = subWeeks(new Date(), 3);
const fom2 = subWeeks(new Date(), 2);
const tom2 = subWeeks(new Date(), 1);

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
        vurdertTidspunkt: subDays(new Date(), 2).toISOString(),
        ...førstePeriodeMedOverlapp,
      },
      {
        fastsattUttaksgrad: 70.0,
        saksbehandler: 'Sara Sak',
        vurdertTidspunkt: subDays(new Date(), 2).toISOString(),
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
          periode: { fom: fom1.toISOString(), tom: tom1.toISOString() },
          søkersUttaksgrad: 40,
        },
        {
          begrunnelse: 'Dette er en grundig begrunnelse',
          periode: { fom: fom2.toISOString(), tom: tom2.toISOString() },
          søkersUttaksgrad: 60,
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
  opprettet: subDays(new Date(), 5).toISOString(),
  sakstype: 'PSB',
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

const feltEnLabel = `Sett uttaksgrad i prosent for perioden ${formatDate(fom1, 'dd.MM.yyyy')} - ${formatDate(tom1, 'dd.MM.yyyy')}`;
const feltToLabel = `Sett uttaksgrad i prosent for perioden ${formatDate(fom2, 'dd.MM.yyyy')} - ${formatDate(tom2, 'dd.MM.yyyy')}`;

export const Aksjonspunkt: Story = {
  args: { behandling: uløstBehandling, aksjonspunkt: uløstAksjonspunkt, api, oppdaterBehandling },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal ha skjema for å sette uttaksgrad for overlappende saker', async () => {
      await expect(canvas.getByText('Uttaksgrad for overlappende perioder'));
      await expect(await canvas.findByLabelText(feltEnLabel));
      await expect(await canvas.findByLabelText(feltToLabel));
    });

    await step('skal kunne løse aksjonspunkt for overlappende saker', async () => {
      /**
       * .type() ser ikke ut til å oppdatere value på elementene riktig, bruker fireEvent isteden
       * await userEvent.type(canvas.getByLabelText(feltEnLabel), '40');
       *  */
      await fireEvent.change(await canvas.getByLabelText(feltEnLabel), {
        target: { value: bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[0]?.søkersUttaksgrad },
      });
      await fireEvent.change(await canvas.getByLabelText(feltToLabel), {
        target: { value: bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[1]?.søkersUttaksgrad },
      });
      await fireEvent.change(await canvas.getByLabelText('Begrunnelse'), {
        target: {
          value: 'Dette er en grundig begrunnelse',
        },
      });

      await userEvent.click(await canvas.getByRole('button'));
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

export const LøstAksjonspunktKanRedigeres: Story = {
  args: { behandling: løstBehandling, aksjonspunkt: løstAksjonspunkt, api, oppdaterBehandling: fn() },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal vise lesevisning av skjema for uttaksgrad for overlappende saker', async () => {
      const feltEn = await canvas.findByLabelText(feltEnLabel);
      const feltTo = await canvas.findByLabelText(feltToLabel);
      const begrunnelseFelt = await canvas.getByLabelText('Begrunnelse');
      const knapp = await canvas.getByRole('button');

      await expect(canvas.getByText('Uttaksgrad for overlappende perioder'));

      await expect(feltEn);
      await expect(await canvas.findByLabelText(feltEnLabel)).toHaveValue('60');
      await expect(await canvas.findByLabelText(feltEnLabel)).toHaveAttribute('readonly');

      await expect(feltTo);
      await expect(feltTo).toHaveValue('70');
      await expect(feltTo).toHaveAttribute('readonly');

      await expect(begrunnelseFelt).toHaveValue('Dette er en grundig begrunnelse');
      await expect(begrunnelseFelt).toHaveAttribute('readonly');

      await expect(knapp).toHaveTextContent('Rediger');
      await userEvent.click(knapp);
      await expect(feltEn.getAttribute('readonly')).toEqual('');
      await expect(feltTo.getAttribute('readonly')).toEqual('');
      await expect(begrunnelseFelt.getAttribute('readonly')).toEqual('');

      await userEvent.click(await canvas.getByRole('button', { name: /Avbryt/i }));
      await expect(feltTo).toHaveAttribute('readonly');
      await expect(feltTo).toHaveAttribute('readonly');
    });
  },
  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export const LøstAksjonspunktAvsluttetSak: Story = {
  args: { behandling: avsluttetBehandling, aksjonspunkt: løstAksjonspunktFerdigstilt, api, oppdaterBehandling: fn() },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal vise leseversjon av skjema i avsluttet sak', async () => {
      const feltEn = await canvas.findByLabelText(feltEnLabel);
      const feltTo = await canvas.findByLabelText(feltToLabel);
      const begrunnelseFelt = await canvas.getByLabelText('Begrunnelse');

      await expect(canvas.getByText('Uttaksgrad for overlappende perioder'));

      await expect(feltEn);
      await expect(feltEn).toHaveValue('60');
      await expect(feltEn).toHaveAttribute('readonly');

      await expect(feltTo);
      await expect(feltTo).toHaveValue('70');
      await expect(feltTo).toHaveAttribute('readonly');

      await expect(begrunnelseFelt).toHaveValue('Dette er en grundig begrunnelse');
      await expect(begrunnelseFelt).toHaveAttribute('readonly');
    });
  },
  render: props => (
    <HStack>
      <VurderOverlappendeSak {...props} />
    </HStack>
  ),
};

export default meta;
