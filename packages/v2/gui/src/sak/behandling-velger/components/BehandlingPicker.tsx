import {
  k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  k9_kodeverk_behandling_BehandlingType as BehandlingDtoType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { finnKodeverkTypeForBehandlingType } from '@k9-sak-web/gui/utils/behandlingUtils.js';
import { formaterVisningsnavn } from '@k9-sak-web/gui/utils/formaterVisningsnavn.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { ChevronLeftIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { useQueries } from '@tanstack/react-query';
import { type Location } from 'history';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { BehandlingVelgerBackendApiType } from '../BehandlingVelgerBackendApiType';
import type { Behandling } from '../types/Behandling';
import BehandlingFilter, { automatiskBehandling } from './BehandlingFilter';
import BehandlingListItems, {
  erAutomatiskBehandlet,
  getBehandlingNavn,
  getSøknadsperioderForValgtBehandling,
} from './BehandlingListItems';
import BehandlingSelected from './BehandlingSelected';
import styles from './behandlingPicker.module.css';
import { sortBehandlinger } from './behandlingVelgerUtils';

const usePrevious = (value: number | undefined): number | undefined => {
  const ref = useRef<number>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const behandlingPerioderÅrsakRel = 'behandling-perioder-årsak-med-vilkår';

interface OwnProps {
  behandlinger: Behandling[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  sakstypeKode: string;
  hentSøknadsperioder: boolean;
  api: BehandlingVelgerBackendApiType;
}

/**
 * BehandlingPicker
 *
 * Viser behandlinger knyttet til fagsak,
 */
const BehandlingPicker = ({
  noExistingBehandlinger,
  behandlingId,
  behandlinger,
  getBehandlingLocation,
  sakstypeKode,
  hentSøknadsperioder,
  api,
}: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const firstRender = useRef(true);
  const navigate = useNavigate();
  const finnÅpenBehandling = () => {
    const åpenBehandling = behandlinger.find(behandling => behandling.status !== BehandlingDtoStatus.AVSLUTTET);
    return åpenBehandling?.id;
  };

  const [valgtBehandlingId, setValgtBehandlingId] = useState(behandlingId || finnÅpenBehandling());
  const previousBehandlingId = usePrevious(behandlingId || finnÅpenBehandling());
  const [aktiveFilter, setAktiveFilter] = useState<string[]>([]);
  const [numberOfBehandlingperioderToFetch, setNumberOfBehandlingPerioderToFetch] = useState(10);

  useEffect(() => {
    if (previousBehandlingId !== behandlingId) {
      setValgtBehandlingId(behandlingId);
    }
  }, [behandlingId]);

  const åpenBehandlingId = useMemo(finnÅpenBehandling, [behandlinger]);

  useEffect(() => {
    const effect = async () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      if (!behandlingId) {
        if (åpenBehandlingId) {
          await navigate(getBehandlingLocation(åpenBehandlingId));
        }
      }
    };
    void effect();
  }, [behandlingId, åpenBehandlingId]);

  // Side-effekt-fri beregning av hvilke behandlinger som skal vises
  const getBehandlingerSomSkalVises = (
    sorterteBehandlinger: Behandling[],
    valgtBehandlingId: number | undefined,
    numberOfBehandlingperioderToFetch: number,
    aktiveFilter: string[],
  ) => {
    const indexOfValgtBehandling = sorterteBehandlinger.findIndex(behandling => behandling.id === valgtBehandlingId);
    const valgtBehandlingFinnes = indexOfValgtBehandling > -1;
    if (valgtBehandlingFinnes) {
      // Returner valgt behandling
      return sorterteBehandlinger.slice(indexOfValgtBehandling, indexOfValgtBehandling + 1);
    }
    // Hvis det er aktive filtre, og automatisk behandling ikke er valgt, vis alle behandlinger som matcher filteret
    if (aktiveFilter.length > 0 && !aktiveFilter.includes(automatiskBehandling)) {
      return sorterteBehandlinger;
    }
    // Returner antallet behandlinger som det er begrenset til med numberOfBehandlingperioderToFetch
    return sorterteBehandlinger.slice(0, numberOfBehandlingperioderToFetch);
  };

  const sorterteBehandlinger = useMemo(() => sortBehandlinger(behandlinger), [behandlinger]);

  // Utvid grensen dersom valgt behandling er utenfor gjeldende vindu
  useEffect(() => {
    const indexOfValgtBehandling = sorterteBehandlinger.findIndex(b => b.id === valgtBehandlingId);
    if (indexOfValgtBehandling > -1 && indexOfValgtBehandling + 1 > numberOfBehandlingperioderToFetch) {
      setNumberOfBehandlingPerioderToFetch(indexOfValgtBehandling + 1);
    }
  }, [valgtBehandlingId, sorterteBehandlinger, numberOfBehandlingperioderToFetch]);

  const behandlingerSomSkalVises = useMemo(() => {
    return getBehandlingerSomSkalVises(
      sorterteBehandlinger,
      valgtBehandlingId,
      numberOfBehandlingperioderToFetch,
      aktiveFilter,
    );
  }, [sorterteBehandlinger, numberOfBehandlingperioderToFetch, valgtBehandlingId, aktiveFilter]);

  const behandlingsnummerById = useMemo(() => {
    return new Map(
      sorterteBehandlinger.map((behandling, index) => [behandling.id, sorterteBehandlinger.length - index]),
    );
  }, [sorterteBehandlinger]);

  const behandlingerMedPerioderMedÅrsak = useMemo(
    () =>
      behandlingerSomSkalVises.filter(behandling =>
        behandling.links?.some(link => link.rel === behandlingPerioderÅrsakRel),
      ),
    [behandlingerSomSkalVises],
  );
  const søknadsperioder = useQueries({
    queries: behandlingerMedPerioderMedÅrsak.map(behandling => ({
      queryKey: ['behandlingPerioderÅrsaker', behandling.uuid, behandling.id],
      queryFn: () => api.getBehandlingPerioderÅrsaker(behandling),
      staleTime: 3 * 60 * 1000,
      enabled: hentSøknadsperioder,
    })),
  });

  const valgtBehandling = valgtBehandlingId
    ? behandlingerSomSkalVises.find(behandling => behandling.id === valgtBehandlingId)
    : null;

  const skalViseHentFlereBehandlingerKnapp =
    (aktiveFilter.length === 0 || aktiveFilter.includes(automatiskBehandling)) &&
    behandlinger.length > numberOfBehandlingperioderToFetch &&
    !valgtBehandling;

  const updateFilter = (valgtFilter: string) => {
    if (aktiveFilter.includes(valgtFilter)) {
      setAktiveFilter(aktiveFilter.filter(v => v !== valgtFilter));
    } else {
      setAktiveFilter(aktiveFilter.concat([valgtFilter]));
    }
  };

  const filterListe = useMemo(() => {
    const result: { value: string; label: string }[] = [];
    behandlinger.forEach(behandling => {
      if (!result.some(filter => filter.value === behandling.type)) {
        const visningsnavn = formaterVisningsnavn(behandling.visningsnavn);
        result.push({
          value: behandling.type,
          label: visningsnavn || getBehandlingNavn(behandling.type, kodeverkNavnFraKode),
        });
      }
      if (erAutomatiskBehandlet(behandling) && !result.some(filter => filter.value === automatiskBehandling)) {
        result.push({
          value: automatiskBehandling,
          label: 'Automatisk behandling',
        });
      }
    });
    return result;
  }, [behandlinger, kodeverkNavnFraKode]);

  const valgtSøknadsperiodeData = søknadsperioder.find(periode => periode.data?.id === valgtBehandling?.id)?.data;

  const årsaksliste = useMemo((): string[] => {
    if (!valgtSøknadsperiodeData) {
      return [];
    }
    const årsaker: string[] = [];
    valgtSøknadsperiodeData.perioderMedÅrsak.toReversed().forEach(periode =>
      periode.årsaker
        ?.filter(årsak => årsak !== null)
        .forEach(årsak => {
          // TODO: try/catch skal ikke være nødvendig etter at backend har lagt inn alle behandlingsårsaker
          try {
            årsaker.push(kodeverkNavnFraKode(årsak, KodeverkType.ÅRSAK_TIL_VURDERING));
          } catch {
            årsaker.push(årsak);
          }
        }),
    );
    return årsaker;
  }, [valgtSøknadsperiodeData, kodeverkNavnFraKode]);

  return (
    <div className={styles.behandlingPicker} data-testid="BehandlingPicker">
      {valgtBehandlingId && (
        <Button
          size="small"
          variant="tertiary"
          icon={<ChevronLeftIcon fontSize="1.5rem" />}
          iconPosition="left"
          className={styles.backButton}
          onClick={() => setValgtBehandlingId(undefined)}
        >
          Se alle behandlinger
        </Button>
      )}

      {!valgtBehandlingId && (
        <>
          <div className={styles.headerContainer}>
            <Heading size="small" level="2">
              {`Velg behandling (${behandlinger.length})`}
            </Heading>
            <BehandlingFilter
              filters={filterListe}
              aktiveFilter={aktiveFilter}
              onFilterChange={updateFilter}
              text="Filtrer"
            />
          </div>
          <ul className={styles.behandlingList}>
            {noExistingBehandlinger && (
              <BodyShort size="small" data-testid="ingenBehandlinger">
                Ingen behandlinger er opprettet
              </BodyShort>
            )}
            {!noExistingBehandlinger && (
              <BehandlingListItems
                behandlinger={behandlingerSomSkalVises}
                behandlingsnummerById={behandlingsnummerById}
                getBehandlingLocation={getBehandlingLocation}
                setValgtBehandlingId={setValgtBehandlingId}
                alleSøknadsperioder={søknadsperioder}
                aktiveFilter={aktiveFilter}
                kodeverkNavnFraKode={kodeverkNavnFraKode}
              />
            )}
          </ul>
        </>
      )}
      {valgtBehandling && (
        <BehandlingSelected
          opprettetDato={valgtBehandling.opprettet}
          avsluttetDato={valgtBehandling.avsluttet}
          behandlingsresultatTypeNavn={
            valgtBehandling.behandlingsresultat
              ? kodeverkNavnFraKode(
                  valgtBehandling.behandlingsresultat.type,
                  KodeverkType.BEHANDLING_RESULTAT_TYPE,
                  finnKodeverkTypeForBehandlingType(valgtBehandling.type),
                )
              : undefined
          }
          behandlingsresultatTypeKode={
            valgtBehandling.behandlingsresultat ? valgtBehandling.behandlingsresultat.type : undefined
          }
          behandlingsårsaker={årsaksliste}
          behandlingTypeNavn={
            valgtBehandling.type !== BehandlingDtoType.FØRSTEGANGSSØKNAD &&
            formaterVisningsnavn(valgtBehandling.visningsnavn)
              ? formaterVisningsnavn(valgtBehandling.visningsnavn)
              : getBehandlingNavn(valgtBehandling.type, kodeverkNavnFraKode)
          }
          behandlingTypeKode={valgtBehandling.type}
          søknadsperioder={getSøknadsperioderForValgtBehandling(søknadsperioder, valgtBehandling)}
          sakstypeKode={sakstypeKode}
          behandlingVisningsnavn={valgtBehandling.visningsnavn}
        />
      )}
      {skalViseHentFlereBehandlingerKnapp && (
        <Button
          variant="tertiary"
          onClick={() => setNumberOfBehandlingPerioderToFetch(numberOfBehandlingperioderToFetch + 10)}
          icon={<PlusCircleIcon aria-hidden />}
          size="small"
          className="mt-5"
        >
          Hent flere behandlinger
        </Button>
      )}
    </div>
  );
};
export default BehandlingPicker;
