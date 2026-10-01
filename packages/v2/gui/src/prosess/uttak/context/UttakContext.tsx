import type { AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { ArbeidsgiverOversiktDto as ArbeidsgiverOversikt } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { BehandlingDto as Behandling } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { FagsakYtelsesType as FagsakYtelseType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { useSuspenseQuery } from '@tanstack/react-query';
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
import type { UttakBackendApiType } from '../api/UttakBackendApiType.js';
import { uttakQueryOptions } from '../api/uttakQueryOptions.js';
import hentPerioderFraUttak from '../utils/hentPerioderFraUttak.js';
import lagUttaksperiodeliste from '../utils/uttaksperioder.js';

export type UttakContextType = {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  uttak: UttaksplanMedUtsattePerioder;
  uttakApi: UttakBackendApiType;
  perioderTilVurdering: string[];
  hentUttak?: () => Promise<any>;
  onAksjonspunktBekreftet?: () => void;
  harEtUløstAksjonspunktIUttak: boolean;
  erOverstyrer: boolean;
  readOnly: boolean;
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
    | 'harEtUløstAksjonspunktIUttak'
    | 'erOverstyrer'
    | 'readOnly'
    | 'virkningsdatoUttakNyeRegler'
    | 'onAksjonspunktBekreftet'
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
    harEtUløstAksjonspunktIUttak: value.harEtUløstAksjonspunktIUttak,
    erOverstyrer: value.erOverstyrer,
    readOnly: value.readOnly,
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
    onAksjonspunktBekreftet: value.onAksjonspunktBekreftet,
  };

  return <UttakContext.Provider value={contextValue}>{children}</UttakContext.Provider>;
};

export const useUttakContext = () => {
  const uttakContext = useContext(UttakContext);
  if (uttakContext === undefined) {
    throw new Error('useUttakContext must be used within a UttakProvider');
  }

  const { behandling, uttakApi, uttaksperiodeListe } = uttakContext;

  const { data: arbeidsgivere } = useSuspenseQuery({
    queryKey: ['uttak-arbeidsgivere', behandling.uuid],
    queryFn: async () => {
      const arbeidsgivere = await uttakApi.getArbeidsgivere(behandling.uuid);
      return arbeidsgivere.arbeidsgivere ?? {};
    },
    refetchOnMount: false, // Med refetchOnMount til true gjentas kallet flere ganger
    refetchOnWindowFocus: false, // Forhindrer at kallet gjentas om man feks. byttet prosesssteg
  });

  const { data: inntektsgraderinger } = useSuspenseQuery({
    queryKey: ['uttak-inntektsgraderinger', behandling.uuid],
    queryFn: async () => uttakApi.hentInntektsgraderinger(behandling.uuid),
    refetchOnMount: false, // Med refetchOnMount til true gjentas kallet flere ganger
    refetchOnWindowFocus: false, // Forhindrer at kallet gjentas om man feks. byttet prosesssteg
  });

  const { refetch: hentUttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));

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
