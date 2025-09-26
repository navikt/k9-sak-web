import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import type {
  k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
  k9_kodeverk_behandling_FagsakYtelseType as FagsakYtelseType,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversikt,
  pleiepengerbarn_uttak_kontrakter_Uttaksplan as Uttaksplan,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
export type UttakContextType = {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  uttak: UttaksplanMedUtsattePerioder;
  uttaksperioder: Uttaksplan | undefined;
  uttakApi: BehandlingUttakBackendClient;
  perioderTilVurdering: string[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling>;
  harEtUløstAksjonspunktIUttak: boolean;
  erOverstyrer: boolean;
  aksjonspunktForOverstyringAvUttak: Aksjonspunkt | undefined;
  aksjonspunktVurderOverlappendeSaker: Aksjonspunkt | undefined;
  aksjonspunktVentAnnenPSBSak: Aksjonspunkt | undefined;
  aksjonspunktVurderDatoNyRegelUttak: Aksjonspunkt | undefined;
  readOnly: boolean;
  oppdaterBehandling: () => void;
  virkningsdatoUttakNyeRegler: string | undefined;
  setRedigervirkningsdato: React.Dispatch<React.SetStateAction<boolean>>;
  arbeidsgivere: ArbeidsgiverOversikt['arbeidsgivere'] | undefined;
};

export const UttakContext = createContext<UttakContextType | undefined>(undefined);

export const useUttakContext = () => {
  const uttakContext = useContext(UttakContext);

  if (uttakContext === undefined) {
    throw new Error('useUttakContext must be used within a UttakProvider');
  }

  const {
    aksjonspunktForOverstyringAvUttak,
    aksjonspunktVurderOverlappendeSaker,
    aksjonspunktVentAnnenPSBSak,
    aksjonspunktVurderDatoNyRegelUttak,
    behandling,
    uttakApi,
  } = uttakContext;

  const { data: arbeidsgivere, isLoading: lasterArbeidsgivere } = useQuery<ArbeidsgiverOversikt['arbeidsgivere']>({
    queryKey: ['arbeidsgivere', behandling.uuid],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(resolve, 10000)); // bare for testing
      const arbeidsgivere = await uttakApi.getArbeidsgivere(behandling.uuid);
      return arbeidsgivere.arbeidsgivere ?? {};
    },
    enabled: !!behandling.uuid,
  });

  const fagsakYtelseType = uttakContext?.behandling.sakstype;

  function erSakstype(type: FagsakYtelseType | FagsakYtelseType[] | undefined): boolean {
    if (Array.isArray(type)) {
      return type.includes(fagsakYtelseType);
    }
    return fagsakYtelseType === type;
  }

  function harAksjonspunkt(kode: AksjonspunktDefinisjon): boolean {
    if (aksjonspunktForOverstyringAvUttak?.definisjon === kode) return true;
    if (aksjonspunktVurderOverlappendeSaker?.definisjon === kode) return true;
    if (aksjonspunktVentAnnenPSBSak?.definisjon === kode) return true;
    if (aksjonspunktVurderDatoNyRegelUttak?.definisjon === kode) return true;
    return false;
  }

  return { ...uttakContext, fagsakYtelseType, erSakstype, arbeidsgivere, harAksjonspunkt, lasterArbeidsgivere };
};
