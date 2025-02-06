import { behandlingType as k9KlageBehandlingType } from '@k9-sak-web/backend/k9klage/generated';
import { BehandlingDtoStatus, BehandlingDtoType } from '@k9-sak-web/backend/k9sak/generated';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { type KodeverkNavnFraKodeType, KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { AddCircle } from '@navikt/ds-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { type UseQueryResult, useQueries } from '@tanstack/react-query';
import { type Location } from 'history';
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import type { BehandlingVelgerBackendApiType } from '../BehandlingVelgerBackendApiType';
import type { Behandling } from '../types/Behandling';
import type { PerioderMedBehandlingsId } from '../types/PerioderMedBehandlingsId';
import BehandlingFilter, { automatiskBehandling } from './BehandlingFilter';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingSelected from './BehandlingSelected';
import styles from './behandlingPicker.module.css';
import { sortBehandlinger } from './behandlingVelgerUtils';

const getBehandlingNavn = (behandlingTypeKode: string, kodeverkNavnFraKode: KodeverkNavnFraKodeType) => {
  switch (behandlingTypeKode) {
    case BehandlingDtoType.FØRSTEGANGSSØKNAD:
      return kodeverkNavnFraKode(behandlingTypeKode, KodeverkType.BEHANDLING_TYPE);

    case k9KlageBehandlingType.BT_003:
      return kodeverkNavnFraKode(behandlingTypeKode, KodeverkType.BEHANDLING_TYPE, 'kodeverkKlage');

    case k9KlageBehandlingType.BT_007:
      return kodeverkNavnFraKode(behandlingTypeKode, KodeverkType.BEHANDLING_TYPE, 'kodeverkTilbake');

    default:
      return 'Viderebehandling';
  }
};

const erAutomatiskBehandlet = (behandling: Behandling) =>
  !behandling.ansvarligSaksbehandler && behandling.status === BehandlingDtoStatus.AVSLUTTET;

const renderListItems = ({
  behandlinger,
  getBehandlingLocation,
  setValgtBehandlingId,
  alleSøknadsperioder,
  aktiveFilter,
  kodeverkNavnFraKode,
}: {
  behandlinger: Behandling[];
  getBehandlingLocation: (behandlingId: number) => Location;
  setValgtBehandlingId: React.Dispatch<React.SetStateAction<number | undefined>>;
  alleSøknadsperioder: UseQueryResult<PerioderMedBehandlingsId, unknown>[];
  aktiveFilter: string[];
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
}): ReactElement<void>[] => {
  const sorterteOgFiltrerteBehandlinger = sortBehandlinger(behandlinger).filter(behandling => {
    if (aktiveFilter.length === 0) {
      return true;
    }
    if (aktiveFilter.includes(automatiskBehandling)) {
      return erAutomatiskBehandlet(behandling);
    }
    return aktiveFilter.includes(behandling.type);
  });

  return sorterteOgFiltrerteBehandlinger.map((behandling, index) => {
    const søknadsperioderFraBehandling =
      alleSøknadsperioder.find(periode => periode.data?.id === behandling.id)?.data?.perioder ?? [];
    return (
      <li data-testid="BehandlingPickerItem" key={behandling.id}>
        <NavLink
          onClick={() => setValgtBehandlingId(behandling.id)}
          className={styles.linkToBehandling}
          to={getBehandlingLocation(behandling.id)}
        >
          <BehandlingPickerItemContent
            behandlingTypeNavn={getBehandlingNavn(behandling.type, kodeverkNavnFraKode)}
            behandlingsresultatTypeNavn={
              behandling.behandlingsresultat
                ? kodeverkNavnFraKode(behandling.behandlingsresultat.type, KodeverkType.BEHANDLING_RESULTAT_TYPE)
                : undefined
            }
            behandlingsresultatTypeKode={
              behandling.behandlingsresultat ? behandling.behandlingsresultat.type : undefined
            }
            erAutomatiskRevurdering={erAutomatiskBehandlet(behandling)}
            søknadsperioder={søknadsperioderFraBehandling}
            erFerdigstilt={!!behandling.avsluttet}
            erUnntaksløype={behandling.type === BehandlingDtoType.UNNTAKSBEHANDLING}
            index={sorterteOgFiltrerteBehandlinger.length - index}
            opprettet={behandling.opprettet}
            avsluttet={behandling.avsluttet}
          />
        </NavLink>
      </li>
    );
  });
};

const usePrevious = (value: number | undefined): number | undefined => {
  const ref = useRef<number>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current ?? undefined;
};

const behandlingPerioderÅrsakRel = 'behandling-perioder-årsak-med-vilkår';

interface OwnProps {
  behandlinger: Behandling[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
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
  createLocationForSkjermlenke,
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
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!behandlingId) {
      if (åpenBehandlingId) {
        navigate(getBehandlingLocation(åpenBehandlingId));
      }
    }
  }, [behandlingId, åpenBehandlingId, firstRender.current]);

  const getBehandlingerSomSkalVises = (
    sorterteBehandlinger: Behandling[],
    valgtBehandlingId: number | undefined,
    numberOfBehandlingperioderToFetch: number,
    aktiveFilter: string[],
  ) => {
    const indexOfValgtBehandling = sorterteBehandlinger.findIndex(behandling => behandling.id === valgtBehandlingId);
    const valgtBehandlingFinnes = indexOfValgtBehandling > -1;
    if (valgtBehandlingFinnes) {
      if (indexOfValgtBehandling + 1 > numberOfBehandlingperioderToFetch) {
        setNumberOfBehandlingPerioderToFetch(indexOfValgtBehandling + 1);
      }
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

  const behandlingerSomSkalVises = useMemo(() => {
    const sorterteBehandlinger = sortBehandlinger(behandlinger);
    return getBehandlingerSomSkalVises(
      sorterteBehandlinger,
      valgtBehandlingId,
      numberOfBehandlingperioderToFetch,
      aktiveFilter,
    );
  }, [behandlinger, numberOfBehandlingperioderToFetch, valgtBehandlingId, aktiveFilter]);

  const behandlingerMedPerioderMedÅrsak = useMemo(
    () =>
      behandlingerSomSkalVises.filter(behandling =>
        behandling.links?.some(link => link.rel === behandlingPerioderÅrsakRel),
      ),
    [behandlingerSomSkalVises],
  );
  const søknadsperioder = useQueries({
    queries: behandlingerMedPerioderMedÅrsak.map(behandling => ({
      queryKey: ['behandlingId', behandling.id, api],
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

  const getFilterListe = () => {
    const filterListe: { value: string; label: string }[] = [];
    behandlinger.forEach(behandling => {
      if (!filterListe.some(filter => filter.value === behandling.type)) {
        filterListe.push({
          value: behandling.type,
          label: getBehandlingNavn(behandling.type, kodeverkNavnFraKode),
        });
      }
      if (erAutomatiskBehandlet(behandling) && !filterListe.some(filter => filter.value === automatiskBehandling)) {
        filterListe.push({
          value: automatiskBehandling,
          label: 'Automatisk behandling',
        });
      }
    });
    return filterListe;
  };

  const getÅrsaksliste = (): string[] => {
    const søknadsperiode = søknadsperioder.find(periode => periode.data?.id === valgtBehandling?.id);
    if (!søknadsperiode) {
      return [];
    }
    const årsaker: string[] = [];
    if (søknadsperiode.data) {
      søknadsperiode.data.perioderMedÅrsak.toReversed().forEach(periode =>
        periode.årsaker?.forEach(årsak => {
          // TODO: try/catch skal ikke være nødvendig etter at backend har lagt inn alle behandlingsårsaker
          try {
            årsaker.push(kodeverkNavnFraKode(årsak, KodeverkType.ÅRSAK_TIL_VURDERING));
          } catch {
            årsaker.push(årsak);
          }
        }),
      );
    }
    return årsaker;
  };

  const søknadsperioderForValgtehandling =
    søknadsperioder.find(periode => periode.data?.id === valgtBehandling?.id)?.data?.perioder ?? [];

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
              filters={getFilterListe()}
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
            {!noExistingBehandlinger &&
              renderListItems({
                behandlinger: behandlingerSomSkalVises,
                getBehandlingLocation,
                setValgtBehandlingId,
                alleSøknadsperioder: søknadsperioder,
                aktiveFilter,
                kodeverkNavnFraKode,
              })}
          </ul>
        </>
      )}
      {valgtBehandling && (
        <BehandlingSelected
          opprettetDato={valgtBehandling.opprettet}
          avsluttetDato={valgtBehandling.avsluttet}
          behandlingsresultatTypeNavn={
            valgtBehandling.behandlingsresultat
              ? kodeverkNavnFraKode(valgtBehandling.behandlingsresultat.type, KodeverkType.BEHANDLING_RESULTAT_TYPE)
              : undefined
          }
          behandlingsresultatTypeKode={
            valgtBehandling.behandlingsresultat ? valgtBehandling.behandlingsresultat.type : undefined
          }
          behandlingsårsaker={getÅrsaksliste()}
          behandlingTypeNavn={getBehandlingNavn(valgtBehandling.type, kodeverkNavnFraKode)}
          behandlingTypeKode={valgtBehandling.type}
          søknadsperioder={søknadsperioderForValgtehandling}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          sakstypeKode={sakstypeKode}
        />
      )}
      {skalViseHentFlereBehandlingerKnapp && (
        <Button
          variant="tertiary"
          onClick={() => setNumberOfBehandlingPerioderToFetch(numberOfBehandlingperioderToFetch + 10)}
          icon={<AddCircle />}
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
