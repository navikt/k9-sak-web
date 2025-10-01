import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import type {
  k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
  k9_kodeverk_behandling_FagsakYtelseType as FagsakYtelseType,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversikt,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import lagUttaksperiodeliste from '../utils/uttaksperioder';

export type UttakContextType = {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  uttak: UttaksplanMedUtsattePerioder;
  uttakApi: BehandlingUttakBackendClient;
  perioderTilVurdering: string[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling>;
  hentUttak?: () => Promise<any>;
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
  uttaksperiodeListe: ReturnType<typeof lagUttaksperiodeliste>;
  setUttaksperiodeListe: React.Dispatch<React.SetStateAction<ReturnType<typeof lagUttaksperiodeliste>>>;
  lasterUttak?: boolean;
};

export interface UttakProviderProps {
  value: Omit<
    UttakContextType,
    'uttaksperiodeListe' | 'setUttaksperiodeListe' | 'lasterUttak' | 'hentUttak' | 'arbeidsgivere'
  >;
  children: React.ReactNode;
}

export const UttakContext = createContext<UttakContextType | undefined>(undefined);

export const UttakProvider = ({ value, value: { uttak }, children }: UttakProviderProps): React.ReactElement => {
  const initialPerioder = React.useMemo(
    () => (uttak?.uttaksplan ? uttak.uttaksplan.perioder : uttak?.simulertUttaksplan?.perioder),
    [uttak],
  );

  const [uttaksperiodeListe, setUttaksperiodeListe] = React.useState(lagUttaksperiodeliste(initialPerioder));

  React.useEffect(() => {
    const nyePerioder = uttak?.uttaksplan ? uttak.uttaksplan.perioder : uttak?.simulertUttaksplan?.perioder;
    setUttaksperiodeListe(lagUttaksperiodeliste(nyePerioder));
  }, [uttak]);

  const contextValue: UttakContextType = {
    ...value,
    arbeidsgivere: undefined,
    uttaksperiodeListe,
    setUttaksperiodeListe,
  };

  return <UttakContext.Provider value={contextValue}>{children}</UttakContext.Provider>;
};

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

  const { uttaksperiodeListe, setUttaksperiodeListe } = uttakContext;

  const { data: arbeidsgivere, isLoading: lasterArbeidsgivere } = useQuery<ArbeidsgiverOversikt['arbeidsgivere']>({
    queryKey: ['arbeidsgivere', behandling.uuid],
    queryFn: async () => {
      const arbeidsgivere = await uttakApi.getArbeidsgivere(behandling.uuid);
      return arbeidsgivere.arbeidsgivere ?? {};
    },
    enabled: !!behandling.uuid,
  });

  /**
   * Etter overstyring av uttak må uttaksperiodene hentes på nytt for å få oppdatert uttaksplanen
   * De initielle uttaksdataene lastes fortsatt fra tidligere api-kall, denne er derfor deaktivert
   * og må trigges manuelt ved behov. Når uthentingen av uttak senere er flyttet over til ny api-client
   * kan denne endres til å være aktivert ved mount.
   */
  const { refetch: hentUttak, isFetching: lasterUttak } = useQuery<UttaksplanMedUtsattePerioder>({
    queryKey: ['uttak', behandling.uuid],
    queryFn: async () => {
      const hentetUttak = await uttakApi.hentUttak(behandling.uuid);
      const perioder =
        hentetUttak?.uttaksplan != null ? hentetUttak?.uttaksplan?.perioder : hentetUttak?.simulertUttaksplan?.perioder;
      setUttaksperiodeListe(lagUttaksperiodeliste(perioder));
      return hentetUttak;
    },
    enabled: false,
    initialData: uttakContext.uttak,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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

  return {
    ...uttakContext,
    fagsakYtelseType,
    erSakstype,
    arbeidsgivere,
    harAksjonspunkt,
    lasterArbeidsgivere,
    hentUttak,
    uttaksperiodeListe,
    lasterUttak,
  };
};
