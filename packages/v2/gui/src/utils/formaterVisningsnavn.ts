import { ung_sak_kontrakt_behandling_BehandlingVisningsnavn } from '@k9-sak-web/backend/ungsak/generated/types.js';

export const formaterVisningsnavn = (
  visningsnavn: ung_sak_kontrakt_behandling_BehandlingVisningsnavn | undefined,
): string | undefined => {
  if (
    !visningsnavn ||
    visningsnavn === ung_sak_kontrakt_behandling_BehandlingVisningsnavn.INGEN_RELEVANT_BEHANDLINGÅRSAK
  ) {
    return undefined;
  }
  switch (visningsnavn) {
    case ung_sak_kontrakt_behandling_BehandlingVisningsnavn.KONTROLL_AV_INNTEKT:
      return 'Kontroll av inntekt';
    case ung_sak_kontrakt_behandling_BehandlingVisningsnavn.BEREGNING_AV_HØY_SATS:
      return 'Beregning av høy sats';
    case ung_sak_kontrakt_behandling_BehandlingVisningsnavn.ENDRING_AV_BARNETILLEGG:
      return 'Endring av barnetillegg';
    case ung_sak_kontrakt_behandling_BehandlingVisningsnavn.BRUKERS_DØDSFALL:
      return 'Brukers dødsfall';
    case ung_sak_kontrakt_behandling_BehandlingVisningsnavn.UNGDOMSPROGRAMENDRING:
      return 'Ungdomsprogramendring';
    default:
      return 'Flere behandlingsårsaker';
  }
};
