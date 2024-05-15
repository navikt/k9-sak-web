import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BehandlingAppKontekst, Kodeverk, KodeverkMedNavn, PerioderMedBehandlingsId } from '@k9-sak-web/types';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { AddCircle } from '@navikt/ds-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import axios from 'axios';
import { Location } from 'history';
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { UseQueryResult, useQueries } from 'react-query';
import { NavLink, useNavigate } from 'react-router-dom';
import BehandlingFilter, { automatiskBehandling } from './BehandlingFilter';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingSelected from './BehandlingSelected';
import styles from './behandlingPicker.module.css';
import { sortBehandlinger } from './behandlingVelgerUtils';

const getBehandlingNavn = (
  behandling: BehandlingAppKontekst,
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn,
  intl: IntlShape,
) => {
  if (
    behandling.type.kode === behandlingType.FORSTEGANGSSOKNAD ||
    behandling.type.kode === behandlingType.KLAGE ||
    behandling.type.kode === behandlingType.TILBAKEKREVING
  ) {
    return getKodeverkFn(behandling.type, behandling.type).navn;
  }

  return intl.formatMessage({ id: 'BehandlingPickerItemContent.BehandlingTypeNavn.Viderebehandling' });
};

const erAutomatiskBehandlet = (behandling: BehandlingAppKontekst) =>
  !behandling.ansvarligSaksbehandler && behandling.status.kode === behandlingStatus.AVSLUTTET;

const renderListItems = ({
  behandlinger,
  getBehandlingLocation,
  getKodeverkFn,
  setValgtBehandlingId,
  intl,
  alleSøknadsperioder,
  activeFilters,
}: {
  behandlinger: BehandlingAppKontekst[];
  getBehandlingLocation: (behandlingId: number) => Location;
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
  setValgtBehandlingId;
  intl: IntlShape;
  alleSøknadsperioder: UseQueryResult<PerioderMedBehandlingsId, unknown>[];
  activeFilters: string[];
}): ReactElement[] => {
  const sorterteOgFiltrerteBehandlinger = sortBehandlinger(behandlinger).filter(behandling => {
    if (activeFilters.length === 0) {
      return true;
    }
    if (activeFilters.includes(automatiskBehandling)) {
      return erAutomatiskBehandlet(behandling);
    }
    return activeFilters.includes(behandling.type.kode);
  });

  return sorterteOgFiltrerteBehandlinger.map((behandling, index) => (
    <li data-testid="BehandlingPickerItem" key={behandling.id}>
      <NavLink
        onClick={() => setValgtBehandlingId(behandling.id)}
        className={styles.linkToBehandling}
        to={getBehandlingLocation(behandling.id)}
      >
        <BehandlingPickerItemContent
          behandlingTypeNavn={getBehandlingNavn(behandling, getKodeverkFn, intl)}
          behandlingsresultatTypeNavn={
            behandling.behandlingsresultat
              ? getKodeverkFn(behandling.behandlingsresultat.type, behandling.type).navn
              : undefined
          }
          behandlingsresultatTypeKode={
            behandling.behandlingsresultat ? behandling.behandlingsresultat.type.kode : undefined
          }
          erAutomatiskRevurdering={erAutomatiskBehandlet(behandling)}
          søknadsperioder={alleSøknadsperioder.find(periode => periode.data?.id === behandling.id)?.data?.perioder}
          erFerdigstilt={!!behandling.avsluttet}
          erUnntaksløype={behandling.type.kode === behandlingType.UNNTAK}
          index={sorterteOgFiltrerteBehandlinger.length - index}
          opprettet={behandling.opprettet}
          avsluttet={behandling.avsluttet}
        />
      </NavLink>
    </li>
  ));
};

const usePrevious = (value: number): number => {
  const ref = useRef<number>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const behandlingPerioderÅrsakRel = 'behandling-perioder-årsak-med-vilkår';

const getBehandlingPerioderÅrsaker = (behandling: BehandlingAppKontekst): Promise<PerioderMedBehandlingsId> =>
  axios
    .get(behandling.links.find(link => link.rel === behandlingPerioderÅrsakRel).href)
    .then(response => ({ data: response.data, id: behandling.id }))
    .then(({ data, id }) => ({
      id,
      perioder: data.perioderMedÅrsak?.perioderTilVurdering,
      perioderMedÅrsak: data.perioderMedÅrsak?.perioderMedÅrsak,
    }));

interface OwnProps {
  behandlinger: BehandlingAppKontekst[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
  behandlingId?: number;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  sakstypeKode: string;
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
  getKodeverkFn,
  createLocationForSkjermlenke,
  sakstypeKode,
}: OwnProps) => {
  const navigate = useNavigate();
  const finnÅpenBehandling = () => {
    const åpenBehandling = behandlinger.find(behandling => behandling.status.kode !== behandlingStatus.AVSLUTTET);
    if (åpenBehandling) {
      navigate(getBehandlingLocation(åpenBehandling.id));
    }
    return åpenBehandling?.id;
  };

  const intl = useIntl();
  const [valgtBehandlingId, setValgtBehandlingId] = useState(behandlingId || finnÅpenBehandling());
  const previousBehandlingId = usePrevious(behandlingId || finnÅpenBehandling());
  const [activeFilters, setActiveFilters] = useState([]);
  const [numberOfBehandlingperioderToFetch, setNumberOfBehandlingPerioderToFetch] = useState(10);

  useEffect(() => {
    if (previousBehandlingId !== behandlingId) {
      setValgtBehandlingId(behandlingId);
    }
  }, [behandlingId]);

  const behandlingerSomSkalVises = useMemo(() => {
    const sorterteBehandlinger = sortBehandlinger(behandlinger);
    const indexOfValgtBehandling = sorterteBehandlinger.findIndex(behandling => behandling.id === valgtBehandlingId);
    if (indexOfValgtBehandling > -1) {
      if (indexOfValgtBehandling + 1 > numberOfBehandlingperioderToFetch) {
        setNumberOfBehandlingPerioderToFetch(indexOfValgtBehandling + 1);
      }
      return sorterteBehandlinger.slice(indexOfValgtBehandling, indexOfValgtBehandling + 1);
    }
    if (activeFilters.length > 0 && !activeFilters.includes(automatiskBehandling)) {
      return sorterteBehandlinger;
    }
    return sorterteBehandlinger.slice(0, numberOfBehandlingperioderToFetch);
  }, [behandlinger, numberOfBehandlingperioderToFetch, valgtBehandlingId, activeFilters]);

  const behandlingerMedPerioderMedÅrsak = useMemo(
    () =>
      behandlingerSomSkalVises.filter(behandling =>
        behandling.links.some(link => link.rel === behandlingPerioderÅrsakRel),
      ),
    [behandlingerSomSkalVises],
  );
  const søknadsperioder = useQueries(
    behandlingerMedPerioderMedÅrsak.map(behandling => ({
      queryKey: ['behandlingId', behandling.id],
      queryFn: () => getBehandlingPerioderÅrsaker(behandling),
      staleTime: 3 * 60 * 1000,
    })),
  );

  const valgtBehandling = valgtBehandlingId
    ? behandlingerSomSkalVises.find(behandling => behandling.id === valgtBehandlingId)
    : null;

  const skalViseHentFlereBehandlingerKnapp =
    (activeFilters.length === 0 || activeFilters.includes(automatiskBehandling)) &&
    behandlinger.length > numberOfBehandlingperioderToFetch &&
    !valgtBehandling;

  const updateFilter = valgtFilter => {
    if (activeFilters.includes(valgtFilter)) {
      setActiveFilters(activeFilters.filter(v => v !== valgtFilter));
    } else {
      setActiveFilters(activeFilters.concat([valgtFilter]));
    }
  };

  const getFilterListe = () => {
    const filterListe = [];
    behandlinger.forEach(behandling => {
      if (!filterListe.some(filter => filter.value === behandling.type.kode)) {
        filterListe.push({
          value: behandling.type.kode,
          label: getBehandlingNavn(behandling, getKodeverkFn, intl),
        });
      }
      if (erAutomatiskBehandlet(behandling) && !filterListe.some(filter => filter.value === automatiskBehandling)) {
        filterListe.push({
          value: automatiskBehandling,
          label: intl.formatMessage({ id: 'Behandlingspunkt.BehandlingFilter.AutomatiskBehandling' }),
        });
      }
    });
    return filterListe;
  };

  const getÅrsaksliste = (): string[] => {
    const søknadsperiode = søknadsperioder.find(periode => periode.data?.id === valgtBehandling.id);
    if (!søknadsperiode) {
      return [];
    }
    const årsaker = [];
    if (søknadsperiode.data) {
      [...søknadsperiode.data.perioderMedÅrsak].reverse().forEach(periode =>
        periode.årsaker.forEach(årsak => {
          // TODO: try/catch skal ikke være nødvendig etter at backend har lagt inn alle behandlingsårsaker
          try {
            årsaker.push(getKodeverkFn({ kode: årsak, kodeverk: 'ÅRSAK_TIL_VURDERING' }).navn);
          } catch {
            årsaker.push(årsak);
          }
        }),
      );
    }
    return årsaker;
  };

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
          <FormattedMessage id="Behandlingspunkt.Behandling.SeAlle" />
        </Button>
      )}

      {!valgtBehandlingId && (
        <>
          <div className={styles.headerContainer}>
            <Heading size="small" level="2">
              <FormattedMessage
                id="Behandlingspunkt.VelgBehandling"
                values={{ antallBehandlinger: behandlinger.length }}
              />
            </Heading>
            <BehandlingFilter
              filters={getFilterListe()}
              activeFilters={activeFilters}
              onFilterChange={updateFilter}
              text={intl.formatMessage({ id: 'Behandlingspunkt.Filtrer' })}
            />
          </div>
          <ul className={styles.behandlingList}>
            {noExistingBehandlinger && (
              <BodyShort size="small" data-testid="ingenBehandlinger">
                <FormattedMessage id="BehandlingList.ZeroBehandlinger" />
              </BodyShort>
            )}
            {!noExistingBehandlinger &&
              renderListItems({
                behandlinger: behandlingerSomSkalVises,
                getBehandlingLocation,
                getKodeverkFn,
                setValgtBehandlingId,
                intl,
                alleSøknadsperioder: søknadsperioder,
                activeFilters,
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
              ? getKodeverkFn(valgtBehandling.behandlingsresultat.type, valgtBehandling.type).navn
              : undefined
          }
          behandlingsresultatTypeKode={
            valgtBehandling.behandlingsresultat ? valgtBehandling.behandlingsresultat.type.kode : undefined
          }
          behandlingsårsaker={getÅrsaksliste()}
          behandlingTypeNavn={getBehandlingNavn(valgtBehandling, getKodeverkFn, intl)}
          behandlingTypeKode={valgtBehandling.type.kode}
          søknadsperioder={søknadsperioder.find(periode => periode.data?.id === valgtBehandling.id)?.data?.perioder}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          sakstypeKode={sakstypeKode}
        />
      )}
      {skalViseHentFlereBehandlingerKnapp && (
        <>
          <VerticalSpacer twentyPx />
          <Button
            variant="tertiary"
            onClick={() => setNumberOfBehandlingPerioderToFetch(numberOfBehandlingperioderToFetch + 10)}
            icon={<AddCircle />}
            size="small"
          >
            Hent flere behandlinger
          </Button>
        </>
      )}
    </div>
  );
};
export default BehandlingPicker;
