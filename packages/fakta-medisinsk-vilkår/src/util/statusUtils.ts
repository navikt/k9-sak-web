import StatusResponse from '../types/SykdomsstegStatusResponse';
import Step, {
  dokumentSteg,
  langvarigSykdomSteg,
  livetsSluttfaseSteg,
  opplæringspengerDokumentSteg,
  sluttfaseDokumentSteg,
  tilsynOgPleieSteg,
  toOmsorgspersonerSteg,
} from '../types/Step';
import FagsakYtelseType from '../constants/FagsakYtelseType';

type Steg = typeof dokumentSteg | typeof tilsynOgPleieSteg | typeof toOmsorgspersonerSteg;

export const stegForSakstype = (fagsakYtelseType: FagsakYtelseType): Step[] => {
  if (fagsakYtelseType === FagsakYtelseType.OPPLÆRINGSPENGER) {
    return [opplæringspengerDokumentSteg, langvarigSykdomSteg];
  }
  if (fagsakYtelseType === FagsakYtelseType.PLEIEPENGER_SLUTTFASE) {
    return [sluttfaseDokumentSteg, livetsSluttfaseSteg];
  }
  return [dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg];
};

export const finnNesteStegForPleiepenger = (
  {
    kanLøseAksjonspunkt,
    harUklassifiserteDokumenter,
    manglerDiagnosekode,
    manglerVurderingAvKontinuerligTilsynOgPleie,
    manglerVurderingAvToOmsorgspersoner,
    manglerGodkjentLegeerklæring,
    nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
  }: StatusResponse,
  isOnMount?: boolean,
): Steg => {
  if (harUklassifiserteDokumenter || manglerDiagnosekode || manglerGodkjentLegeerklæring) {
    return dokumentSteg;
  }

  if (manglerVurderingAvKontinuerligTilsynOgPleie || nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
    return tilsynOgPleieSteg;
  }

  if (manglerVurderingAvToOmsorgspersoner) {
    return toOmsorgspersonerSteg;
  }

  if (kanLøseAksjonspunkt && !isOnMount) {
    return tilsynOgPleieSteg;
  }

  return null;
};

export const finnNesteStegForLivetsSluttfase = (
  {
    kanLøseAksjonspunkt,
    harUklassifiserteDokumenter,
    manglerGodkjentLegeerklæring,
    manglerVurderingAvILivetsSluttfase,
    nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
  }: StatusResponse,
  isOnMount?: boolean,
): Steg => {
  if (harUklassifiserteDokumenter || manglerGodkjentLegeerklæring) {
    return sluttfaseDokumentSteg;
  }

  if (manglerVurderingAvILivetsSluttfase || nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
    return livetsSluttfaseSteg;
  }

  if (kanLøseAksjonspunkt && !isOnMount) {
    return livetsSluttfaseSteg;
  }

  return null;
};
export const finnNesteStegForOpplæringspenger = (
  {
    kanLøseAksjonspunkt,
    harUklassifiserteDokumenter,
    manglerGodkjentLegeerklæring,
    manglerVurderingAvLangvarigSykdom,
    nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
  }: StatusResponse,
  isOnMount?: boolean,
): Steg => {
  if (harUklassifiserteDokumenter || manglerGodkjentLegeerklæring) {
    return opplæringspengerDokumentSteg;
  }

  if (manglerVurderingAvLangvarigSykdom || nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
    return langvarigSykdomSteg;
  }

  if (kanLøseAksjonspunkt && !isOnMount) {
    return langvarigSykdomSteg;
  }

  return opplæringspengerDokumentSteg;
};

export const nesteStegErVurderingForPleiepenger = (sykdomsstegStatus: StatusResponse): boolean => {
  const nesteSteg = finnNesteStegForPleiepenger(sykdomsstegStatus);
  return nesteSteg === tilsynOgPleieSteg || nesteSteg === toOmsorgspersonerSteg;
};

export const nesteStegErLivetssluttfase = (sykdomsstegStatus: StatusResponse): boolean => {
  const nesteSteg = finnNesteStegForLivetsSluttfase(sykdomsstegStatus);
  return nesteSteg === livetsSluttfaseSteg;
};

export const nesteStegErOpplæringspenger = (sykdomsstegStatus: StatusResponse): boolean => {
  const nesteSteg = finnNesteStegForOpplæringspenger(sykdomsstegStatus);
  return nesteSteg === langvarigSykdomSteg;
};
