import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export type Retning = 'inn' | 'ut';

export type Overføringstype = 'fordeling' | 'overføring' | 'koronaoverføring';

export interface Overføring {
  antallDager: number;
  mottakerAvsenderFnr?: string;
  fom?: string;
  tom?: string;
}

export interface Overføringsgruppe {
  retning: Retning;
  type: Overføringstype;
  overføringer: Overføring[];
  totaltAntallDager: number;
}

const rammevedtakstyper = {
  inn: {
    fordeling: 'FordelingFår',
    overføring: 'OverføringFår',
    koronaoverføring: 'KoronaOverføringFår',
  },
  ut: {
    fordeling: 'FordelingGir',
    overføring: 'OverføringGir',
    koronaoverføring: 'KoronaOverføringGir',
  },
} as const satisfies Record<Retning, Record<Overføringstype, RammevedtakDto['type']>>;

const retninger: Retning[] = ['inn', 'ut'];
const overføringstyper: Overføringstype[] = ['fordeling', 'overføring', 'koronaoverføring'];

const tilOverføring = (rammevedtak: RammevedtakDto): Overføring => {
  const lengde = 'lengde' in rammevedtak ? rammevedtak.lengde : undefined;
  const mottaker = 'mottaker' in rammevedtak ? rammevedtak.mottaker : undefined;
  const avsender = 'avsender' in rammevedtak ? rammevedtak.avsender : undefined;
  return {
    antallDager: lengde ? dayjs.duration(lengde).asDays() : 0,
    mottakerAvsenderFnr: mottaker || avsender,
    fom: rammevedtak.gyldigFraOgMed,
    tom: rammevedtak.gyldigTilOgMed,
  };
};

export const grupperOverføringer = (rammevedtak: RammevedtakDto[]): Overføringsgruppe[] =>
  retninger.flatMap(retning =>
    overføringstyper.map(type => {
      const overføringer = rammevedtak.filter(rv => rv.type === rammevedtakstyper[retning][type]).map(tilOverføring);
      return {
        retning,
        type,
        overføringer,
        totaltAntallDager: overføringer.reduce((sum, { antallDager }) => sum + antallDager, 0),
      };
    }),
  );
