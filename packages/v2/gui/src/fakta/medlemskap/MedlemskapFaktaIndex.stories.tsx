import {
  AksjonspunktDtoDefinisjon,
  AksjonspunktDtoStatus,
  AvklartPersonstatusOrginalPersonstatus,
  BehandlingDtoType,
  MedlemskapPerioderDtoDekningType,
  MedlemskapPerioderDtoKildeType,
  PersonadresseDtoAdresseType,
  PersonopplysningDtoRegion,
  PersonopplysningDtoSivilstand,
} from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../storybook/asyncAction';
import withKodeverkContext from '../../storybook/decorators/withKodeverkContext';
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
  aksjonspunkter: ['5023'],
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

const medlemskapAp5020 = { ...medlemskap, perioder: [periodeMed5020] };

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
