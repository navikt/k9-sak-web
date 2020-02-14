import { expect } from 'chai';
import { mapRader } from './UttakkPP';
import { ResultattypeEnum } from './types/Resultattype';
import Behandlinger from './types/UttakTypes';
import BehandlingPersonMap from './types/BehandlingPersonMap';

describe('<UttakPP>', () => {
  const behandlinger: Behandlinger = {
    123: {
      perioder: {
        '2020-01-01/2020-01-14': {
          grad: 50.0,
          resultat_type: ResultattypeEnum.INNVILGET,
          årsak: '§45-10 første ledd: Lorem ipsum.',
        },
        '2020-02-01/2020-02-14': {
          grad: 73.5,
          resultat_type: ResultattypeEnum.INNVILGET,
          årsak: '§45-10 første ledd: Lorem ipsum.',
        },
      },
    },
    456: {
      perioder: {
        '2020-01-01/2020-01-14': {
          grad: 50.0,
          resultat_type: ResultattypeEnum.INNVILGET,
          årsak: '§45-10 første ledd: Lorem ipsum.',
        },
        '2020-02-01/2020-02-14': {
          grad: 73.5,
          resultat_type: ResultattypeEnum.INNVILGET,
          årsak: '§45-10 første ledd: Lorem ipsum.',
        },
      },
    },
  };

  const behandlingPersonMap: BehandlingPersonMap = {
    123: {
      kjønnkode: 'K',
      fnr: '12312312312',
    },
    456: {
      kjønnkode: 'M',
      fnr: '45645645645',
    },
  };

  it('mapper periodeformat', () => {
    const mappet = mapRader(behandlinger, behandlingPersonMap, { formatMessage: () => 'gradering' });
    const expected = [
      {
        ikon: { imageTextKey: 'Person.ImageText', titleKey: 'Person.Woman', src: {} },
        id: '123',
        perioder: [
          {
            fom: '2020-01-01',
            tom: '2020-01-14',
            id: '123-0',
            hoverText: '50% gradering',
            className: 'gradert godkjentPeriode',
            periodeinfo: {
              grad: 50,
              resultat_type: 'INNVILGET',
              årsak: '§45-10 første ledd: Lorem ipsum.',
              behandlingsId: '123',
            },
          },
          {
            fom: '2020-02-01',
            tom: '2020-02-14',
            id: '123-1',
            hoverText: '73.5% gradering',
            className: 'gradert godkjentPeriode',
            periodeinfo: {
              grad: 73.5,
              resultat_type: 'INNVILGET',
              årsak: '§45-10 første ledd: Lorem ipsum.',
              behandlingsId: '123',
            },
          },
        ],
      },
      {
        ikon: { imageTextKey: 'Person.ImageText', titleKey: 'Person.Man', src: {} },
        id: '456',
        perioder: [
          {
            fom: '2020-01-01',
            tom: '2020-01-14',
            id: '456-0',
            hoverText: '50% gradering',
            className: 'gradert godkjentPeriode',
            periodeinfo: {
              grad: 50,
              resultat_type: 'INNVILGET',
              årsak: '§45-10 første ledd: Lorem ipsum.',
              behandlingsId: '456',
            },
          },
          {
            fom: '2020-02-01',
            tom: '2020-02-14',
            id: '456-1',
            hoverText: '73.5% gradering',
            className: 'gradert godkjentPeriode',
            periodeinfo: {
              grad: 73.5,
              resultat_type: 'INNVILGET',
              årsak: '§45-10 første ledd: Lorem ipsum.',
              behandlingsId: '456',
            },
          },
        ],
      },
    ];
    expect(mappet).to.eql(expected);
  });
});
