import { expect } from 'chai';
import { mapRader } from './UttakkPP';

describe('<UttakPP>', () => {
  const behandlinger = {
    123: {
      perioder: {
        '2020-01-01/2020-01-14': {
          grad: 50.0,
        },
        '2020-02-01/2020-02-14': {
          grad: 73.5,
        },
      },
    },
    456: {
      perioder: {
        '2020-01-01/2020-01-14': {
          grad: 50.0,
        },
        '2020-02-01/2020-02-14': {
          grad: 73.5,
        },
      },
    },
  };

  const behandlingPersonMap = {
    123: {
      kjønnkode: 'K',
    },
    456: {
      kjønnkode: 'M',
    },
  };

  it('mapper periodeformat', () => {
    const mappet = mapRader(behandlinger, behandlingPersonMap, { formatMessage: () => 'gradering' });
    const expected = [
      {
        ikon: {
          imageTextKey: 'Person.ImageText',
          titleKey: 'Person.Woman',
          src: {},
        },
        id: '123',
        perioder: [
          {
            fom: '2020-01-01',
            tom: '2020-01-14',
            id: '123-0',
            grad: 50,
            hoverText: '50% gradering',
            className: 'gradert',
          },
          {
            fom: '2020-02-01',
            tom: '2020-02-14',
            id: '123-1',
            grad: 73.5,
            hoverText: '73.5% gradering',
            className: 'gradert',
          },
        ],
      },
      {
        ikon: {
          imageTextKey: 'Person.ImageText',
          titleKey: 'Person.Man',
          src: {},
        },
        id: '456',
        perioder: [
          {
            fom: '2020-01-01',
            tom: '2020-01-14',
            id: '456-0',
            grad: 50,
            hoverText: '50% gradering',
            className: 'gradert',
          },
          {
            fom: '2020-02-01',
            tom: '2020-02-14',
            id: '456-1',
            grad: 73.5,
            hoverText: '73.5% gradering',
            className: 'gradert',
          },
        ],
      },
    ];
    expect(mappet).to.eql(expected);
  });
});
