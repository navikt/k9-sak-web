import BehandlingPersonMap from './BehandlingPersonMap';
import UttaksplanerDto from '../dto/UttaksplanerDto';
import { InnvilgetÅrsakEnum } from '../dto/InnvilgetÅrsakType';
import { AvslåttÅrsakEnum } from '../dto/AvslåttÅrsakType';

export const uttaksplaner: UttaksplanerDto = {
  '123': {
    perioder: {
      '2020-01-01/2020-01-08': {
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
      },
      '2020-01-15/2020-02-07': {
        utfall: 'Innvilget',
        årsak: InnvilgetÅrsakEnum.AVKORTET_MOT_INNTEKT,
        hjemler: [],
        grad: 80,
        utbetalingsgrader: [
          {
            arbeidsforhold: {
              type: 'Arbeidstaker',
              organisasjonsnummer: '999999999',
              aktørId: null,
              arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            },
            utbetalingsgrad: 80.0,
          },
        ],
      },
      '2020-02-16/2020-02-25': {
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
        ],
      },
    },
  },
  '456': {
    perioder: {
      '2020-01-01/2020-01-14': {
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
      },
      '2020-01-29/2020-02-15': {
        utfall: 'Innvilget',
        årsak: InnvilgetÅrsakEnum.AVKORTET_MOT_INNTEKT,
        hjemler: [],
        grad: 80,
        utbetalingsgrader: [
          {
            arbeidsforhold: {
              type: 'Arbeidstaker',
              organisasjonsnummer: '999999999',
              aktørId: null,
              arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            },
            utbetalingsgrad: 80.0,
          },
        ],
      },
      '2020-02-26/2020-02-29': {
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
        ],
      },
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
      fornavn: 'Geir',
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
  789: {
    kjønn: 'M',
    navn: {
      fornavn: 'Arne',
      etternavn: 'Arnesen',
    },
  },
};
