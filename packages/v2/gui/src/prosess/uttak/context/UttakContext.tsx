import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import type {
  k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
  k9_kodeverk_behandling_FagsakYtelseType as FagsakYtelseType,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversikt,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import lagUttaksperiodeliste from '../utils/uttaksperioder';
import hentPerioderFraUttak from '../utils/hentPerioderFraUttak';

export type UttakContextType = {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  uttak: UttaksplanMedUtsattePerioder;
  uttakApi: BehandlingUttakBackendClient;
  perioderTilVurdering: string[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling>;
  hentUttak?: () => Promise<any>;
  harEtUløstAksjonspunktIUttak: boolean;
  erOverstyrer: boolean;
  readOnly: boolean;
  oppdaterBehandling: () => void;
  virkningsdatoUttakNyeRegler: string | undefined;
  redigerVirkningsdato: boolean;
  setRedigervirkningsdato: Dispatch<SetStateAction<boolean>>;
  arbeidsgivere: ArbeidsgiverOversikt['arbeidsgivere'] | undefined;
  uttaksperiodeListe: Readonly<ReturnType<typeof lagUttaksperiodeliste>>;
  lasterUttak?: boolean;
  aksjonspunkterMap: Map<AksjonspunktDefinisjon, Aksjonspunkt>;
  harAksjonspunkt: (kode: AksjonspunktDefinisjon) => boolean;
  harNoenAksjonspunkter: (koder: AksjonspunktDefinisjon[]) => boolean;
  harAlleAksjonspunkter: (koder: AksjonspunktDefinisjon[]) => boolean;
  aksjonspunktForOverstyringAvUttak: Aksjonspunkt | undefined;
  aksjonspunktVurderOverlappendeSaker: Aksjonspunkt | undefined;
  aksjonspunktVentAnnenPSBSak: Aksjonspunkt | undefined;
  aksjonspunktVurderDatoNyRegelUttak: Aksjonspunkt | undefined;
};

export interface UttakProviderProps {
  value: Pick<
    UttakContextType,
    | 'behandling'
    | 'uttak'
    | 'uttakApi'
    | 'perioderTilVurdering'
    | 'hentBehandling'
    | 'harEtUløstAksjonspunktIUttak'
    | 'erOverstyrer'
    | 'readOnly'
    | 'oppdaterBehandling'
    | 'virkningsdatoUttakNyeRegler'
  > & { aksjonspunkter: Aksjonspunkt[] };
  children: ReactNode;
}

export const UttakContext = createContext<UttakContextType | undefined>(undefined);

export const UttakProvider = ({
  value,
  value: { uttak, aksjonspunkter },
  children,
}: UttakProviderProps): ReactElement => {
  const [redigerVirkningsdato, setRedigervirkningsdato] = useState(false);

  const uttaksperiodeListe: Readonly<ReturnType<typeof lagUttaksperiodeliste>> = useMemo(() => {
    const perioder = hentPerioderFraUttak(uttak);
    return Object.freeze(lagUttaksperiodeliste(perioder));
  }, [uttak]);

  const alleAksjonspunkter: Aksjonspunkt[] = useMemo(() => aksjonspunkter ?? [], [aksjonspunkter]);

  const aksjonspunkterMap = useMemo(() => {
    const apMap = new Map<AksjonspunktDefinisjon, Aksjonspunkt>();
    for (const ap of alleAksjonspunkter) {
      if (ap.definisjon) {
        apMap.set(ap.definisjon, ap);
      }
    }
    return apMap;
  }, [alleAksjonspunkter]);

  const harAksjonspunkt = useCallback(
    (kode: AksjonspunktDefinisjon) => aksjonspunkterMap.has(kode),
    [aksjonspunkterMap],
  );
  const harNoenAksjonspunkter = useCallback(
    (koder: AksjonspunktDefinisjon[]) => koder.some(k => aksjonspunkterMap.has(k)),
    [aksjonspunkterMap],
  );
  const harAlleAksjonspunkter = useCallback(
    (koder: AksjonspunktDefinisjon[]) => koder.every(k => aksjonspunkterMap.has(k)),
    [aksjonspunkterMap],
  );

  const contextValue: UttakContextType = {
    behandling: value.behandling,
    uttak: value.uttak,
    uttakApi: value.uttakApi,
    perioderTilVurdering: value.perioderTilVurdering,
    hentBehandling: value.hentBehandling,
    harEtUløstAksjonspunktIUttak: value.harEtUløstAksjonspunktIUttak,
    erOverstyrer: value.erOverstyrer,
    readOnly: value.readOnly,
    oppdaterBehandling: value.oppdaterBehandling,
    virkningsdatoUttakNyeRegler: value.virkningsdatoUttakNyeRegler,
    redigerVirkningsdato,
    setRedigervirkningsdato,
    arbeidsgivere: undefined,
    uttaksperiodeListe,
    aksjonspunkterMap,
    harAksjonspunkt,
    harNoenAksjonspunkter,
    harAlleAksjonspunkter,
    aksjonspunktForOverstyringAvUttak: aksjonspunkterMap.get(AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK),
    aksjonspunktVurderOverlappendeSaker: aksjonspunkterMap.get(AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER),
    aksjonspunktVentAnnenPSBSak: aksjonspunkterMap.get(AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK),
    aksjonspunktVurderDatoNyRegelUttak: aksjonspunkterMap.get(AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK),
  };

  return <UttakContext.Provider value={contextValue}>{children}</UttakContext.Provider>;
};

export const useUttakContext = () => {
  const uttakContext = useContext(UttakContext);

  if (uttakContext === undefined) {
    throw new Error('useUttakContext must be used within a UttakProvider');
  }

  const { behandling, uttakApi, uttaksperiodeListe } = uttakContext;

  const { data: arbeidsgivere } = useQuery({
    queryKey: ['uttak-arbeidsgivere', behandling.uuid],
    queryFn: async () => {
      const arbeidsgivere = await uttakApi.getArbeidsgivere(behandling.uuid);
      return arbeidsgivere.arbeidsgivere ?? {};
    },
    enabled: !!behandling.uuid,
  });

  const { data: inntektsgraderinger } = useQuery({
    queryKey: ['uttak-inntektsgraderinger', behandling.uuid],
    queryFn: async () => uttakApi.hentInntektsgraderinger(behandling.uuid),
    enabled: !!behandling.uuid,
  });

  /**
   * Etter overstyring av uttak må uttaksperiodene hentes på nytt for å få oppdatert uttaksplanen
   * De initielle uttaksdataene lastes fortsatt fra tidligere api-kall, denne er derfor deaktivert
   * og må trigges manuelt ved behov. Når uthentingen av uttak senere er flyttet over til ny api-client
   * kan denne endres til å være aktivert ved mount.
   */
  const { refetch: hentUttak } = useQuery({
    queryKey: ['uttak', behandling.uuid],
    queryFn: async () => {
      const hentetUttak = await uttakApi.hentUttak(behandling.uuid);
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

  return {
    ...uttakContext,
    fagsakYtelseType,
    erSakstype,
    arbeidsgivere,
    harAksjonspunkt: uttakContext.harAksjonspunkt,
    harNoenAksjonspunkter: uttakContext.harNoenAksjonspunkter,
    harAlleAksjonspunkter: uttakContext.harAlleAksjonspunkter,
    inntektsgraderinger,
    hentUttak,
    uttaksperiodeListe,
  };
};
