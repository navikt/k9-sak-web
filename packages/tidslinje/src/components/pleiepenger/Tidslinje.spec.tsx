import { ISO_DATE_FORMAT } from '@k9-sak-web/utils';
import moment from 'moment';
import { createGroups, createItems } from './Tidslinje';
import Periode from './types/Periode';
import TidslinjeRad from './types/TidslinjeRad';

describe('<Tidslinje>', () => {
  it('konverterer props til Timeline config', () => {
    const rader: TidslinjeRad<Periode<any>>[] = [
      {
        ikon: {
          src: null,
          imageText: '',
          title: '',
        },
        id: '1',
        perioder: [
          {
            id: '1-1',
            fom: '2019-10-10',
            tom: '2019-11-10',
            hoverText: '',
          },
          {
            id: '1-2',
            fom: '2017-10-10',
            tom: '2017-11-10',
            hoverText: '',
          },
        ],
      },
      {
        ikon: {
          src: null,
          imageText: '',
          title: '',
        },
        id: '2',
        perioder: [
          {
            id: '2-1',
            fom: '2018-10-10',
            tom: '2018-11-10',
            hoverText: '',
          },
        ],
      },
    ];
    const momentDate = dateString => moment(dateString, ISO_DATE_FORMAT);

    const items = createItems(
      rader.flatMap(rad => rad.perioder).sort((p1, p2) => momentDate(p1.fom).diff(momentDate(p2.fom))),
    );
    expect(items).toHaveLength(3);
    expect(items[0].id).toBe('1-2');
    expect(items[1].id).toBe('2-1');
    expect(items[2].id).toBe('1-1');
    expect(createGroups(rader)).toEqual([
      { id: '1', content: '' },
      { id: '2', content: '' },
    ]);
  });
});
