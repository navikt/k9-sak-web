import type { BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { isValidDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import dayjs from 'dayjs';

export interface Gyldighetsperiode {
  fom?: string;
  tom?: string;
}

export interface RammevedtakForBarn {
  nøkkel: string;
  kroniskSykdom?: Gyldighetsperiode[];
  aleneomsorg?: Gyldighetsperiode;
  fosterbarn?: Gyldighetsperiode;
  utenlandskBarn?: Gyldighetsperiode;
  deltBosted?: Gyldighetsperiode;
}

export interface BarnMedRammevedtak {
  barn: BarnDto;
  rammevedtak?: RammevedtakForBarn;
}

const tilPeriode = ({ gyldigFraOgMed, gyldigTilOgMed }: RammevedtakDto): Gyldighetsperiode => ({
  fom: gyldigFraOgMed,
  tom: gyldigTilOgMed,
});

/**
 * Grupperer rammevedtak per koblingsnøkkel (fødselsnummer eller annen identifikator fra rammevedtaket), som i v1.
 *
 * Bruker et vanlig objekt og Object.values med vilje: nøkler som er gyldige array-indekser (f.eks. '150915') kommer
 * først i stigende numerisk rekkefølge, deretter øvrige nøkler i innsettingsrekkefølge. Rekkefølgen avgjør hvilken
 * gruppe som vinner i koblingen mot barn, og må derfor ikke erstattes med Map eller sortering.
 */
export const grupperRammevedtakPerNøkkel = (rammevedtak: RammevedtakDto[]): RammevedtakForBarn[] => {
  let perNøkkel: Record<string, RammevedtakForBarn> = {};

  const leggTil = (nøkkel: string | undefined, oppdatering: Omit<RammevedtakForBarn, 'nøkkel'>) => {
    if (!nøkkel) {
      return;
    }
    perNøkkel = { ...perNøkkel, [nøkkel]: { ...perNøkkel[nøkkel], ...oppdatering, nøkkel } };
  };

  for (const rv of rammevedtak) {
    switch (rv.type) {
      case 'UtvidetRett': {
        const nøkkel = rv.utvidetRettFor;
        const perioder = rammevedtak
          .filter(annet => annet.type === 'UtvidetRett' && annet.utvidetRettFor === nøkkel)
          .map(tilPeriode);
        leggTil(nøkkel, { kroniskSykdom: perioder });
        break;
      }
      case 'AleneOmOmsorgen':
        leggTil(rv.aleneOmOmsorgenFor, { aleneomsorg: tilPeriode(rv) });
        break;
      case 'Fosterbarn':
        leggTil(rv.mottaker, { fosterbarn: tilPeriode(rv) });
        break;
      case 'UtenlandskBarn':
        leggTil(rv.fødselsdato, { utenlandskBarn: tilPeriode(rv) });
        break;
      case 'DeltBosted':
        leggTil(rv.deltBostedMed, { deltBosted: tilPeriode(rv) });
        break;
      default:
        break;
    }
  }

  return Object.values(perNøkkel);
};

const SEKS_FØRSTE = 6;

const erKobletTilBarn = (nøkkel: string, personIdent: string | undefined) =>
  nøkkel === personIdent ||
  nøkkel.substring(0, SEKS_FØRSTE) === personIdent ||
  nøkkel === personIdent?.substring(0, SEKS_FØRSTE);

/**
 * Kobler hvert barn til en rammevedtaksgruppe med samme regler som v1: lik identifikator, eller at den ene siden er
 * nøyaktig de seks første tegnene i den andre. Ved flere treff vinner siste gruppe i rekkefølgen fra
 * grupperRammevedtakPerNøkkel.
 */
export const koblBarnOgRammevedtak = (barn: BarnDto[], rammevedtak: RammevedtakDto[]): BarnMedRammevedtak[] => {
  const grupper = grupperRammevedtakPerNøkkel(rammevedtak);
  return barn.map(b => ({
    barn: b,
    rammevedtak: grupper.findLast(gruppe => erKobletTilBarn(gruppe.nøkkel, b.personIdent)),
  }));
};

export interface UidentifiserteRammevedtak {
  type: RammevedtakDto['type'];
  tekst: (antall: number) => string;
  rammevedtak: RammevedtakDto[];
}

export const finnUidentifiserteRammevedtak = (rammevedtak: RammevedtakDto[]): UidentifiserteRammevedtak[] => [
  {
    type: 'UidentifisertRammevedtak',
    tekst: antall =>
      `Det finnes ${antall} automatisk utolkbare rammevedtak fra Infotrygd. Vennligst korriger i Infotrygd.`,
    rammevedtak: rammevedtak.filter(rv => rv.type === 'UidentifisertRammevedtak'),
  },
  {
    type: 'UtvidetRett',
    tekst: antall =>
      `Det finnes ${antall} rammevedtak om utvidet rett fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.`,
    rammevedtak: rammevedtak.filter(rv => rv.type === 'UtvidetRett' && !rv.utvidetRettFor),
  },
  {
    type: 'AleneOmOmsorgen',
    tekst: antall =>
      `Det finnes ${antall} rammevedtak om aleneomsorg fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.`,
    rammevedtak: rammevedtak.filter(rv => rv.type === 'AleneOmOmsorgen' && !rv.aleneOmOmsorgenFor),
  },
  {
    type: 'Fosterbarn',
    tekst: antall =>
      `Det finnes ${antall} rammevedtak om fosterbarn fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.`,
    rammevedtak: rammevedtak.filter(rv => rv.type === 'Fosterbarn' && !rv.mottaker),
  },
];

export const utolkbarTekst = (rv: RammevedtakDto): string | undefined =>
  'fritekst' in rv && typeof rv.fritekst === 'string' && rv.fritekst.trim() ? rv.fritekst : undefined;

export const finnMidlertidigAleneomsorg = (rammevedtak: RammevedtakDto[]) =>
  rammevedtak.find(rv => rv.type === 'MidlertidigAleneOmOmsorgen');

export const formaterDatoEllerStrek = (dato: string | undefined): string =>
  dato && isValidDate(dato) ? formatDate(dato) : '-';

export const beregnAlder = (fødselsdato: string | undefined): number | undefined =>
  fødselsdato && isValidDate(fødselsdato) ? dayjs().diff(fødselsdato, 'years') : undefined;
