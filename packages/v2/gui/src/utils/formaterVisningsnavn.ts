import { BehandlingVisningsnavn } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingVisningsnavn.js';

export const formaterVisningsnavn = (
  visningsnavn: BehandlingVisningsnavn | undefined,
): string => {
  if (!visningsnavn) {
    return '';
  }

  switch (visningsnavn) {
    case BehandlingVisningsnavn.INGEN_RELEVANT_BEHANDLINGÅRSAK:
      return '';
    case BehandlingVisningsnavn.KONTROLL_AV_INNTEKT:
      return 'Kontroll av inntekt';
    case BehandlingVisningsnavn.BEREGNING_AV_HØY_SATS:
      return 'Beregning av høy sats';
    case BehandlingVisningsnavn.ENDRING_AV_BARNETILLEGG:
      return 'Endring av barnetillegg';
    case BehandlingVisningsnavn.BRUKERS_DØDSFALL:
      return 'Brukers dødsfall';
    case BehandlingVisningsnavn.UNGDOMSPROGRAMENDRING:
      return 'Ungdomsprogramendring';
    default: {
      console.warn('Ukjent behandlingsvisningsnavn:', visningsnavn);
      return 'Flere behandlingsårsaker';
    }
  }
};
