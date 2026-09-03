import { FagsakYtelseType as FagsakYtelseTypeK9sak } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakYtelseType.js';
import { navAnsatt_innloggetBrukerV2 } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import { FagsakYtelseType as FagsakYtelsesTypeUng } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakYtelseType.js';
import { useSuspenseQuery } from '@tanstack/react-query';

export type UngNavAnsattTilgang = {
  brukernavn: string;
  navn: string;
  funksjonellTid?: string;
  kanBehandleKode6: boolean;
  kanBehandleKode7: boolean;
  kanBehandleKodeEgenAnsatt: boolean;
  kanBeslutte: boolean;
  kanOverstyre: boolean;
  kanSaksbehandle: boolean;
  kanVeilede: boolean;
  skalViseDetaljerteFeilmeldinger?: boolean;
};

export const innloggetAnsattUngV2QueryOptions = {
  queryKey: ['saksbehandler', 'innlogget-v2', 'ung-sak'] as const,
  queryFn: () => navAnsatt_innloggetBrukerV2().then(r => r.data),
  staleTime: Infinity,
};

export function useNavAnsattForYtelse(
  fagsakYtelsesType: FagsakYtelseTypeK9sak | FagsakYtelsesTypeUng,
): UngNavAnsattTilgang {
  const { data } = useSuspenseQuery(innloggetAnsattUngV2QueryOptions);
  const erAktivitetspenger = fagsakYtelsesType === FagsakYtelsesTypeUng.AKTIVITETSPENGER;
  const ungTilgang = data.ungdomsprogramytelseSaksbehandlerTilgang;
  const avpDel1 = data.aktivitetspengerDel1SaksbehandlerTilgang;
  const avpDel2 = data.aktivitetspengerDel2SaksbehandlerTilgang;

  return {
    brukernavn: data.brukernavn ?? '',
    navn: data.navn ?? '',
    funksjonellTid: data.funksjonellTid,
    kanBehandleKode6: data.kanBehandleKode6 ?? false,
    kanBehandleKode7: data.kanBehandleKode7 ?? false,
    kanBehandleKodeEgenAnsatt: data.kanBehandleKodeEgenAnsatt ?? false,
    kanBeslutte: erAktivitetspenger
      ? ((avpDel1?.kanBeslutte || avpDel2?.kanBeslutte) ?? false)
      : (ungTilgang?.kanBeslutte ?? false),
    kanOverstyre: erAktivitetspenger
      ? ((avpDel1?.kanOverstyre || avpDel2?.kanOverstyre) ?? false)
      : (ungTilgang?.kanOverstyre ?? false),
    kanSaksbehandle: erAktivitetspenger
      ? ((avpDel1?.kanSaksbehandle || avpDel2?.kanSaksbehandle) ?? false)
      : (ungTilgang?.kanSaksbehandle ?? false),
    kanVeilede: erAktivitetspenger
      ? (data.kanVeiledeAktivitetspenger ?? false)
      : ((data.erUngdomsprogramveileder || data.kanVeiledeUngdomsprogramytelse) ?? false),
    skalViseDetaljerteFeilmeldinger: data.skalViseDetaljerteFeilmeldinger,
  };
}

/** For display-only bruk der ytelsetypen ikke er kjent (f.eks. dekoratøren). */
export function useInnloggetBrukerNavn(): { brukernavn: string; navn: string } {
  const { data } = useSuspenseQuery(innloggetAnsattUngV2QueryOptions);
  return { brukernavn: data.brukernavn ?? '', navn: data.navn ?? '' };
}
