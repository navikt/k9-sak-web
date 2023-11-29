import { Period } from '@fpsak-frontend/utils';
import EtablertTilsynType from '../types/EtablertTilsynType';

const mapTilEtablertTilsynType = v => new EtablertTilsynType(v);
const mapPeriode = v => new Period(v.fom, v.tom);

export const toPerioderSammeUke = () => {
  const etablertTilsynData = [
    {
      periode: {
        fom: '2022-09-05',
        tom: '2022-09-06',
      },
      tidPerDag: 'PT2H',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-07',
        tom: '2022-09-08',
      },
      tidPerDag: 'PT5H',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-09',
        tom: '2022-09-09',
      },
      tidPerDag: 'PT6H',
      kilde: 'SØKER',
    },
  ].map(mapTilEtablertTilsynType);

  const smurtEtablertTilsynPerioder = [
    {
      periode: {
        fom: '2022-09-05',
        tom: '2022-09-05',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-06',
        tom: '2022-09-06',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-07',
        tom: '2022-09-07',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-08',
        tom: '2022-09-08',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-09',
        tom: '2022-09-09',
      },
      tidPerDag: 'PT2H36M',
    },
  ].map(mapTilEtablertTilsynType);

  const avslaattePerioder = [
    {
      fom: '2022-09-08',
      tom: '2022-09-08',
    },
  ].map(mapPeriode);

  const innleggelsesperioder = [].map(mapPeriode);

  return { etablertTilsynData, smurtEtablertTilsynPerioder, avslaattePerioder, innleggelsesperioder };
};
export const dagOverstyrt = () => {
  const etablertTilsynData = [
    {
      periode: {
        fom: '2022-09-05',
        tom: '2022-09-06',
      },
      tidPerDag: 'PT2H',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-07',
        tom: '2022-09-08',
      },
      tidPerDag: 'PT5H',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-09',
        tom: '2022-09-09',
      },
      tidPerDag: 'PT6H',
      kilde: 'SØKER',
    },
  ].map(mapTilEtablertTilsynType);

  const smurtEtablertTilsynPerioder = [
    {
      periode: {
        fom: '2022-09-05',
        tom: '2022-09-05',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-06',
        tom: '2022-09-06',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-07',
        tom: '2022-09-07',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-08',
        tom: '2022-09-08',
      },
      tidPerDag: 'PT2H36M',
    },
    {
      periode: {
        fom: '2022-09-09',
        tom: '2022-09-09',
      },
      tidPerDag: 'PT2H36M',
    },
  ].map(mapTilEtablertTilsynType);

  const avslaattePerioder = [].map(mapPeriode);

  const innleggelsesperioder = [
    {
      fom: '2022-09-08',
      tom: '2022-09-08',
    },
  ].map(mapPeriode);

  return { etablertTilsynData, smurtEtablertTilsynPerioder, avslaattePerioder, innleggelsesperioder };
};

export const treEnkeltdager = () => {
  const etablertTilsynData = [
    {
      periode: {
        fom: '2022-09-19',
        tom: '2022-09-19',
      },
      tidPerDag: 'PT5H30M',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-20',
        tom: '2022-09-20',
      },
      tidPerDag: 'PT0H',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-21',
        tom: '2022-09-21',
      },
      tidPerDag: 'PT5H30M',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-22',
        tom: '2022-09-22',
      },
      tidPerDag: 'PT0H',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-09-23',
        tom: '2022-09-23',
      },
      tidPerDag: 'PT5H30M',
      kilde: 'SØKER',
    },
  ].map(mapTilEtablertTilsynType);

  const smurtEtablertTilsynPerioder = [
    {
      periode: {
        fom: '2022-09-19',
        tom: '2022-09-19',
      },
      tidPerDag: 'PT5H30M',
    },
    {
      periode: {
        fom: '2022-09-20',
        tom: '2022-09-20',
      },
      tidPerDag: 'PT0H',
    },
    {
      periode: {
        fom: '2022-09-21',
        tom: '2022-09-21',
      },
      tidPerDag: 'PT5H30M',
    },
    {
      periode: {
        fom: '2022-09-22',
        tom: '2022-09-22',
      },
      tidPerDag: 'PT0H',
    },
    {
      periode: {
        fom: '2022-09-23',
        tom: '2022-09-23',
      },
      tidPerDag: 'PT5H30M',
    },
  ].map(mapTilEtablertTilsynType);

  const avslaattePerioder = [
    {
      fom: '2022-09-20',
      tom: '2022-09-20',
    },
    {
      fom: '2022-09-22',
      tom: '2022-09-22',
    },
  ].map(mapPeriode);

  return { etablertTilsynData, smurtEtablertTilsynPerioder, avslaattePerioder, innleggelsesperioder: [] };
};

export const toSmøringer = () => {
  const etablertTilsynData = [
    {
      periode: {
        fom: '2022-10-03',
        tom: '2022-10-03',
      },
      tidPerDag: 'PT7H',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-10-04',
        tom: '2022-10-04',
      },
      tidPerDag: 'PT1H30M',
      kilde: 'ANDRE',
    },
    {
      periode: {
        fom: '2022-10-05',
        tom: '2022-10-05',
      },
      tidPerDag: 'PT4H33M',
      kilde: 'SØKER',
    },
    {
      periode: {
        fom: '2022-10-06',
        tom: '2022-10-06',
      },
      tidPerDag: 'PT2H33M',
      kilde: 'ANDRE',
    },
    {
      periode: {
        fom: '2022-10-07',
        tom: '2022-10-07',
      },
      tidPerDag: 'PT6H',
      kilde: 'SØKER',
    },
  ].map(mapTilEtablertTilsynType);

  const smurtEtablertTilsynPerioder = [
    {
      periode: {
        fom: '2022-10-03',
        tom: '2022-10-03',
      },
      tidPerDag: 'PT4H15M',
    },
    {
      periode: {
        fom: '2022-10-04',
        tom: '2022-10-04',
      },
      tidPerDag: 'PT4H15M',
    },
    {
      periode: {
        fom: '2022-10-05',
        tom: '2022-10-05',
      },
      tidPerDag: 'PT4H33M',
    },
    {
      periode: {
        fom: '2022-10-06',
        tom: '2022-10-06',
      },
      tidPerDag: 'PT4H16M30S',
    },
    {
      periode: {
        fom: '2022-10-07',
        tom: '2022-10-07',
      },
      tidPerDag: 'PT4H16M30S',
    },
  ].map(mapTilEtablertTilsynType);

  const avslaattePerioder = [
    {
      id: '999999',
      resultat: 'IKKE_OPPFYLT',
      periode: {
        fom: '2022-10-05',
        tom: '2022-10-05',
      },
    },
  ].map(mapPeriode);

  return { etablertTilsynData, smurtEtablertTilsynPerioder, avslaattePerioder, innleggelsesperioder: [] };
};
