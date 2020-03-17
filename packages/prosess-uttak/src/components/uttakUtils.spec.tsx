import { expect } from 'chai';
import PerioderDto from './dto/PerioderDto';
import { mapDtoPerioder } from './uttakUtils';
import { InnvilgetÅrsakEnum } from './dto/InnvilgetÅrsakType';
import { AvslåttÅrsakEnum } from './dto/AvslåttÅrsakType';

describe('uttakUtils', () => {
  it('mapper perioder fra dto til periodeliste', () => {
    const perioder: PerioderDto = {
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
    };

    const mappet = mapDtoPerioder(perioder);

    expect(mappet).to.have.length(2);

    const periode0 = perioder['2020-01-15/2020-02-07'];
    expect(mappet[0]).to.eql({
      fom: '2020-01-15',
      tom: '2020-02-07',
      grad: periode0.grad,
      hjemler: periode0.hjemler,
      utfall: periode0.utfall,
      årsak: periode0.årsak,
    });

    const periode1 = perioder['2020-02-16/2020-02-25'];
    expect(mappet[1]).to.eql({
      fom: '2020-02-16',
      tom: '2020-02-25',
      utfall: periode1.utfall,
      årsaker: periode1.årsaker,
    });
  });
});
