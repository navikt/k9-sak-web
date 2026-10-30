import { RettVedDødType } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/RettVedDødType.js';

export const rett6UkerTekst =
  'Søker har mottatt pleiepenger i mindre enn 3 år og har rett på 30 dager (6 uker) med pleiepenger jf § 9-10, fjerde ledd, første punktum.';

export const rett12UkerTekst =
  'Søker har mottatt 100 % pleiepenger i 3 år eller mer og har rett på 3 måneder med pleiepenger jf § 9-10, fjerde ledd, andre punktum.';

export const rettVedDødUtfallTekst = (rettVedDødType: RettVedDødType | undefined): string | undefined => {
  switch (rettVedDødType) {
    case RettVedDødType.RETT_6_UKER:
      return rett6UkerTekst;
    case RettVedDødType.RETT_12_UKER:
      return rett12UkerTekst;
    default:
      return undefined;
  }
};
