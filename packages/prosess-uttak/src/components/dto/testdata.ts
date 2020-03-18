import BehandlingPersonMap from '../types/BehandlingPersonMap';
import UttaksplanerDto from './UttaksplanerDto';
import { InnvilgetÅrsakEnum } from './InnvilgetÅrsakType';
import { AvslåttÅrsakEnum } from './AvslåttÅrsakType';
import UttaksperiodeDto from './UttaksperiodeDto';

const innvilgetPeriodeUtenÅrsak: UttaksperiodeDto = {
  utfall: 'Innvilget',
  grad: 100,
  utbetalingsgrader: [
    {
      arbeidsforhold: {
        type: 'Arbeidstaker',
        organisasjonsnummer: '999999999',
        aktørId: null,
        arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
      utbetalingsgrad: 75.0,
    },
  ],
};

const innvilgetPeriodeMedÅrsak: UttaksperiodeDto = {
  ...innvilgetPeriodeUtenÅrsak,
  årsak: InnvilgetÅrsakEnum.AVKORTET_MOT_INNTEKT,
};

const avslåttPeriode: UttaksperiodeDto = {
  utfall: 'Avslått',
  årsaker: [
    {
      årsak: AvslåttÅrsakEnum.IKKE_MEDLEM_I_FOLKETRYGDEN,
      hjemler: [
        {
          henvisning: 'Folketrygdloven LOV-1997-02-28-19 Kapittel 2',
          anvendelse: 'Fastsatt at personen ikke er medlem av folketrygden i perioden.',
        },
      ],
    },
    {
      årsak: AvslåttÅrsakEnum.FOR_HØY_TILSYNSGRAD,
      hjemler: [
        {
          henvisning: 'Folketrygdloven LOV-1997-02-28-19 Kapittel 2',
          anvendelse: 'Fastsatt at personen ikke er medlem av folketrygden i perioden.',
        },
      ],
    },
  ],
};

export const uttaksplaner: UttaksplanerDto = {
  '123': {
    perioder: {
      '2020-01-01/2020-01-08': innvilgetPeriodeUtenÅrsak,
      '2020-01-15/2020-02-07': innvilgetPeriodeMedÅrsak,
      '2020-02-16/2020-02-25': avslåttPeriode,
    },
  },
  '321': {
    perioder: {
      '2020-01-01/2020-01-08': avslåttPeriode,
      '2020-01-15/2020-02-07': avslåttPeriode,
      '2020-02-16/2020-02-25': innvilgetPeriodeMedÅrsak,
    },
  },
  '456': {
    perioder: {
      '2020-01-01/2020-01-14': innvilgetPeriodeUtenÅrsak,
      '2020-02-04/2020-02-20': avslåttPeriode,
      '2020-02-26/2020-02-29': innvilgetPeriodeMedÅrsak,
    },
  },
};

export const behandlingPersonMap: BehandlingPersonMap = {
  123: {
    kjønn: 'K',
    navn: {
      fornavn: 'Anne',
      etternavn: 'Annesen',
    },
  },
  321: {
    kjønn: 'M',
    navn: {
      fornavn: 'Alexander-Preben-Christopher',
      etternavn: 'Geirsen',
    },
  },
  456: {
    kjønn: 'K',
    navn: {
      fornavn: 'Marie',
      etternavn: 'Mariesen',
    },
  },
};
