import { expect } from 'chai';
import { KjønnkodeEnum } from '@k9-sak-web/types/src/Kjønnkode';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';
import { mapRader } from './Uttak';
import { InnvilgetÅrsakEnum } from './dto/InnvilgetÅrsakType';
import { AvslåttÅrsakEnum } from './dto/AvslåttÅrsakType';
import Uttaksplan from './types/Uttaksplan';
import { UtfallEnum } from './dto/Utfall';
import Uttaksperiode from './types/Uttaksperiode';

describe('<Uttak>', () => {
  const uttaksplaner: Uttaksplan[] = [
    {
      behandlingId: '123',
      person: {
        kjønn: KjønnkodeEnum.KVINNE,
        navn: {
          fornavn: 'Andrea',
          etternavn: 'sas',
        },
      },
      perioder: [
        {
          utfall: UtfallEnum.INNVILGET,
          fom: '2020-01-01',
          tom: '2020-01-08',
          grad: 100,
          behandlingId: '123',
        },
        {
          utfall: UtfallEnum.AVSLÅTT,
          fom: '2020-02-16',
          tom: '2020-02-25',
          årsaker: [
            {
              årsakstype: AvslåttÅrsakEnum.IKKE_MEDLEM_I_FOLKETRYGDEN,
            },
          ],
          behandlingId: '123',
        },
      ],
    },
    {
      behandlingId: '456',
      person: {
        kjønn: KjønnkodeEnum.MANN,
        navn: {
          fornavn: 'Anders',
          etternavn: 'vb',
        },
      },
      perioder: [
        {
          utfall: UtfallEnum.INNVILGET,
          fom: '2020-01-29',
          tom: '2020-02-15',
          grad: 80,
          årsaker: [
            {
              årsakstype: InnvilgetÅrsakEnum.AVKORTET_MOT_INNTEKT,
            },
          ],
          behandlingId: '456',
        },
      ],
    },
  ];

  it('mapper periodeformat', () => {
    const mappet: TidslinjeRad<Uttaksperiode>[] = mapRader(uttaksplaner, { formatMessage: () => 'gradering' });

    const expected: TidslinjeRad<Uttaksperiode>[] = [
      {
        id: '123',
        perioder: [
          {
            fom: '2020-01-01',
            tom: '2020-01-08',
            id: '123-0',
            hoverText: '100% gradering',
            className: 'godkjentPeriode',
            periodeinfo: uttaksplaner[0].perioder[0],
          },
          {
            fom: '2020-02-16',
            tom: '2020-02-25',
            id: '123-1',
            hoverText: 'gradering',
            className: 'avvistPeriode',
            periodeinfo: uttaksplaner[0].perioder[1],
          },
        ],
      },
      {
        id: '456',
        perioder: [
          {
            fom: '2020-01-29',
            tom: '2020-02-15',
            id: '456-0',
            hoverText: '80% gradering',
            className: 'gradert godkjentPeriode',
            periodeinfo: uttaksplaner[1].perioder[0],
          },
        ],
      },
    ];
    expect(mappet).to.eql(expected);
  });
});
