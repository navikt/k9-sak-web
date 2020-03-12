import BehandlingPersonMap from './BehandlingPersonMap';
import Uttaksplaner from './Uttaksplaner';
import {InnvilgetÅrsakEnum} from '../dto/InnvilgetÅrsak';
import {AvslåttÅrsakEnum} from '../dto/AvslåttÅrsak';

export const uttaksplaner: Uttaksplaner = {
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
      '2020-01-15/2020-01-28': {
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
      '2020-01-09/2020-01-14': {
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
    kjønnkode: 'K',
    fnr: '12121250458',
  },
  321: {
    kjønnkode: 'M',
    fnr: '21035489154',
  },
  456: {
    kjønnkode: 'K',
    fnr: '30108965157',
  },
  789: {
    kjønnkode: 'M',
    fnr: '04040454120',
  },
};
