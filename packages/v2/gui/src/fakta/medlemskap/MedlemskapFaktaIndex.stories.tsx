import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktDtoStatus,
  k9_kodeverk_person_PersonstatusType as AvklartPersonstatusOrginalPersonstatus,
  k9_kodeverk_behandling_BehandlingType as BehandlingDtoType,
  k9_kodeverk_medlem_MedlemskapDekningType as MedlemskapPerioderDtoDekningType,
  k9_kodeverk_medlem_MedlemskapKildeType as MedlemskapPerioderDtoKildeType,
  k9_kodeverk_geografisk_AdresseType as PersonadresseDtoAdresseType,
  k9_kodeverk_geografisk_Region as PersonopplysningDtoRegion,
  k9_kodeverk_person_SivilstandType as PersonopplysningDtoSivilstand,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { asyncAction } from '@k9-sak-web/gui/storybook/asyncAction.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent } from 'storybook/test';
import MedlemskapFaktaIndex from './MedlemskapFaktaIndex';
import type { Behandling } from './types/Behandling';
import type { Medlemskap } from './types/Medlemskap';
import type { Periode } from './types/Periode';
import type { Søknad } from './types/Søknad';

const behandling: Behandling = {
  id: 1,
  versjon: 1,
  type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
};

const soknad: Søknad = {
  oppgittTilknytning: {
    utlandsopphold: [
      {
        landNavn: 'SVERIGE',
        fom: '2010-01-01',
        tom: '2011-01-01',
      },
    ],
  },
  fodselsdatoer: [],
};

const medlemskap: Medlemskap = {
  medlemskapPerioder: [
    {
      fom: '2019-01-01',
      tom: '2021-10-13',
      medlemskapType: 'AVKLARES',
      dekningType: MedlemskapPerioderDtoDekningType.OPPHOR,
      kildeType: MedlemskapPerioderDtoKildeType.FS22,
      beslutningsdato: null,
    },
  ],
  fom: '2019-01-01',
  personopplysninger: {},
  perioder: [
    {
      vurderingsdato: '2019-11-07',
      personopplysninger: {
        avklartPersonstatus: {
          orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        },
        personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        navn: 'Mygg Robust',
        adresser: [
          {
            adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
            mottakerNavn: 'Mygg Robust',
            adresselinje1: 'Skogvegen 3',
            adresselinje2: undefined,
            adresselinje3: undefined,
            postNummer: '4353',
            poststed: 'Klepp Stasjon',
            land: 'NOR',
          },
        ],
        region: PersonopplysningDtoRegion.NORDEN,
        annenPart: undefined,
      },
      aksjonspunkter: ['5021'],
      årsaker: ['SKJÆRINGSTIDSPUNKT'],
      oppholdsrettVurdering: undefined,
      erEosBorger: false,
      lovligOppholdVurdering: undefined,
      bosattVurdering: undefined,
      medlemskapManuellVurderingType: '',
      begrunnelse: '',
      id: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
    },
    {
      vurderingsdato: '2018-11-07',
      personopplysninger: {
        avklartPersonstatus: {
          orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        },
        personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        navn: 'Mygg Robust',
        adresser: [],
        region: PersonopplysningDtoRegion.NORDEN,
        annenPart: undefined,
      },
      aksjonspunkter: ['5021'],
      årsaker: ['SKJÆRINGSTIDSPUNKT'],
      oppholdsrettVurdering: undefined,
      erEosBorger: false,
      lovligOppholdVurdering: undefined,
      bosattVurdering: undefined,
      medlemskapManuellVurderingType: '',
      begrunnelse: '',
      id: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
    },
  ],
};

const periodeMed5020: Periode = {
  id: '',
  vurderingsdato: '2018-11-07',
  personopplysninger: {
    avklartPersonstatus: {
      orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
      overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
    },
    personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
    sivilstand: PersonopplysningDtoSivilstand.UGIFT,
    navn: 'Mygg Robust',
    adresser: [],
    region: PersonopplysningDtoRegion.NORDEN,
    annenPart: undefined,
  },
  aksjonspunkter: ['5020'],
  årsaker: ['SKJÆRINGSTIDSPUNKT'],
  oppholdsrettVurdering: undefined,
  erEosBorger: false,
  lovligOppholdVurdering: undefined,
  bosattVurdering: undefined,
  medlemskapManuellVurderingType: '',
  begrunnelse: '',
  isBosattAksjonspunktClosed: false,
  isPeriodAksjonspunktClosed: false,
  vurdertAv: '',
  vurdertTidspunkt: '',
};

const periodeMed5023: Periode = {
  id: '',
  vurderingsdato: '2018-11-07',
  personopplysninger: {
    avklartPersonstatus: {
      orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
      overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
    },
    personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
    sivilstand: PersonopplysningDtoSivilstand.UGIFT,
    navn: 'Mygg Robust',
    adresser: [],
    region: PersonopplysningDtoRegion.NORDEN,
    annenPart: undefined,
  },
  aksjonspunkter: ['5023'],
  årsaker: ['SKJÆRINGSTIDSPUNKT'],
  oppholdsrettVurdering: undefined,
  erEosBorger: true,
  lovligOppholdVurdering: undefined,
  bosattVurdering: undefined,
  medlemskapManuellVurderingType: '',
  begrunnelse: '',
  isBosattAksjonspunktClosed: false,
  isPeriodAksjonspunktClosed: false,
  vurdertAv: '',
  vurdertTidspunkt: '',
};

const medlemskapAp5020 = { ...medlemskap, perioder: [periodeMed5020] };
const medlemskapAp5023 = { ...medlemskap, perioder: [periodeMed5023] };

const fagsakPerson = {};

const merknaderFraBeslutter = {
  notAccepted: false,
};

const meta = {
  title: 'gui/fakta/medlemskap',
  component: MedlemskapFaktaIndex,
  args: {
    submitCallback: asyncAction('Løser aksjonspunkt'),
  },
  decorators: [withKodeverkContext({ behandlingType: behandlingType.FØRSTEGANGSSØKNAD })],
} satisfies Meta<typeof MedlemskapFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisAksjonspunktForAvklaringOmBrukerErBosatt: Story = {
  args: {
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT,
        status: AksjonspunktDtoStatus.OPPRETTET,
        erAktivt: true,
      },
    ],
    behandling,
    medlemskap: medlemskapAp5020,
    soknad,
    fagsakPerson,
    alleMerknaderFraBeslutter: {
      [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: merknaderFraBeslutter,
    },
    readOnly: false,
    submittable: true,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise editeringsmuligheter når det finnes aksjonspunkter', async () => {
      await expect(canvas.getByText('Vurder om søker er bosatt i Norge')).toBeInTheDocument();
      await expect(canvas.getByText('Opplysninger oppgitt i søknaden')).toBeInTheDocument();
      await expect(canvas.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Oppdater' })).toBeDisabled();
      await userEvent.type(canvas.getByRole('textbox', { name: 'Begrunn endringene' }), 'Dette er en begrunnelse');
      await expect(canvas.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
    });
  },
};

export const VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter: Story = {
  args: {
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT,
        status: aksjonspunktStatus.OPPRETTET,
        erAktivt: true,
      },
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_FORTSATT_MEDLEMSKAP,
        status: AksjonspunktDtoStatus.OPPRETTET,
        erAktivt: true,
      },
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
        status: AksjonspunktDtoStatus.OPPRETTET,
        erAktivt: true,
      },
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_OPPHOLDSRETT,
        status: AksjonspunktDtoStatus.OPPRETTET,
        erAktivt: true,
      },
    ],
    behandling,
    medlemskap,
    soknad,
    fagsakPerson,
    alleMerknaderFraBeslutter: {
      [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: merknaderFraBeslutter,
      [AksjonspunktDtoDefinisjon.AVKLAR_FORTSATT_MEDLEMSKAP]: merknaderFraBeslutter,
      [AksjonspunktDtoDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE]: merknaderFraBeslutter,
      [AksjonspunktDtoDefinisjon.AVKLAR_OPPHOLDSRETT]: merknaderFraBeslutter,
    },
    readOnly: false,
    submittable: true,
    submitCallback: fn(),
  },
  play: async ({ canvas, step, args }) => {
    await step('skal formatere data ved innsending', async () => {
      await expect(canvas.getByText('Skogvegen 3, 4353 Klepp Stasjon')).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('radio', { name: 'Periode med medlemskap' }));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Begrunn endringene' }), 'Dette er en begrunnelse');
      await expect(canvas.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
      await userEvent.click(canvas.getByRole('button', { name: 'Oppdater' }));
      await userEvent.click(canvas.getByText('07.11.2018'));
      await expect(canvas.queryByText('Skogvegen 3, 4353 Klepp Stasjon')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole('radio', { name: 'Periode med unntak fra medlemskap' }));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Begrunn endringene' }), 'Dette er en begrunnelse');
      await expect(canvas.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
      await userEvent.click(canvas.getByRole('button', { name: 'Oppdater' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(args.submitCallback).toHaveBeenCalledWith([
        {
          bekreftedePerioder: [],
          kode: '5020',
        },
        {
          bekreftedePerioder: [
            {
              aksjonspunkter: ['5021'],
              begrunnelse: 'Dette er en begrunnelse',
              erEosBorger: false,
              lovligOppholdVurdering: undefined,
              medlemskapManuellVurderingType: 'UNNTAK',
              oppholdsrettVurdering: undefined,
              vurderingsdato: '2018-11-07',
              bosattVurdering: undefined,
            },
            {
              aksjonspunkter: ['5021'],
              begrunnelse: 'Dette er en begrunnelse',
              erEosBorger: false,
              lovligOppholdVurdering: undefined,
              medlemskapManuellVurderingType: 'MEDLEM',
              oppholdsrettVurdering: undefined,
              vurderingsdato: '2019-11-07',
              bosattVurdering: undefined,
            },
          ],
          kode: '5053',
        },
        {
          bekreftedePerioder: [
            {
              aksjonspunkter: ['5021'],
              begrunnelse: 'Dette er en begrunnelse',
              erEosBorger: false,
              lovligOppholdVurdering: undefined,
              medlemskapManuellVurderingType: 'UNNTAK',
              oppholdsrettVurdering: undefined,
              vurderingsdato: '2018-11-07',
              bosattVurdering: undefined,
            },
            {
              aksjonspunkter: ['5021'],
              begrunnelse: 'Dette er en begrunnelse',
              erEosBorger: false,
              lovligOppholdVurdering: undefined,
              medlemskapManuellVurderingType: 'MEDLEM',
              oppholdsrettVurdering: undefined,
              vurderingsdato: '2019-11-07',
              bosattVurdering: undefined,
            },
          ],
          kode: '5021',
        },
        {
          bekreftedePerioder: [],
          kode: '5023',
        },
      ]);
    });

    await step('skal kunne avklare perioder når en har dette aksjonspunktet', async () => {
      await expect(canvas.getByText('Vurder om søker har gyldig medlemskap i perioden')).toBeInTheDocument();
      await expect(canvas.getByText('Perioder med medlemskap')).toBeInTheDocument();
      await expect(canvas.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Ikke relevant periode' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Periode med medlemskap' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Periode med unntak fra medlemskap' })).toBeInTheDocument();
    });

    await step('skal vise informasjon om opphold og bosatt informasjon', async () => {
      await expect(canvas.getByText('Opphold utenfor Norge')).toBeInTheDocument();
      await expect(canvas.getByText('Sverige')).toBeInTheDocument();
      await expect(canvas.getByText('Mygg Robust')).toBeInTheDocument();
    });
  },
};

export const VisPanelUtenAksjonspunkt: Story = {
  args: {
    aksjonspunkter: [],
    behandling,
    medlemskap,
    soknad,
    fagsakPerson,
    alleMerknaderFraBeslutter: {
      [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: merknaderFraBeslutter,
    },
    readOnly: true,
    submittable: false,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise informasjon uten editeringsmuligheter når det ikke finnes aksjonspunkter', async () => {
      await expect(canvas.getByText('Opplysninger oppgitt i søknaden')).toBeInTheDocument();
      await expect(canvas.getByText('Perioder med medlemskap')).toBeInTheDocument();
      await expect(canvas.queryByText('textbox')).not.toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: 'Oppdater' })).not.toBeInTheDocument();
    });
  },
};

export const VisPanelNårEØSBorgerOgAP5023: Story = {
  args: {
    ...VisAksjonspunktForAvklaringOmBrukerErBosatt.args,
    medlemskap: medlemskapAp5023,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise radioknapper for vurdering av oppholdsrett', async () => {
      await expect(canvas.getAllByRole('radio').length).toBe(4);
      await expect(canvas.getByRole('radio', { name: 'EØS borger' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Utenlandsk borger utenfor EØS' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Søker har oppholdsrett' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Søker har ikke oppholdsrett' })).toBeInTheDocument();
    });
  },
};

export const VisPanelUtenPerioder: Story = {
  args: {
    aksjonspunkter: [],
    behandling: {
      id: 1353953,
      type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
      versjon: 234,
    },
    medlemskap: {
      fom: '',
      medlemskapPerioder: [],
      perioder: [],
      personopplysninger: {
        '2024-06-03': {
          adresser: [
            {
              adresselinje1: 'Skippergata 81',
              adresselinje2: undefined,
              adresselinje3: undefined,
              adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
              land: 'NOR',
              mottakerNavn: 'Familie Ordknapp',
              postNummer: '4614',
              poststed: undefined,
            },
          ],
          avklartPersonstatus: {
            orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          },
          navn: 'Familie Ordknapp',
          personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          region: PersonopplysningDtoRegion.NORDEN,
          sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        },
        '2024-08-10': {
          adresser: [
            {
              adresselinje1: 'Fergegata 1',
              adresselinje2: undefined,
              adresselinje3: undefined,
              adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
              land: 'NOR',
              mottakerNavn: 'Leverpostei Kjent',
              postNummer: '4614',
              poststed: undefined,
            },
          ],
          avklartPersonstatus: {
            orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          },
          navn: 'Pusekatt Ökänd',
          personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          region: PersonopplysningDtoRegion.NORDEN,
          sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        },
      },
    },
    soknad: {
      oppgittTilknytning: {
        utlandsopphold: [
          {
            landNavn: 'SVERIGE',
            fom: '2010-01-01',
            tom: '2011-01-01',
          },
        ],
      },

      fodselsdatoer: [],
    },
    fagsakPerson,
    alleMerknaderFraBeslutter: {},
    readOnly: false,
    submittable: true,
  },
};
