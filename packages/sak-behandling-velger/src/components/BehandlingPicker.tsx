import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingAppKontekst, KodeverkMedNavn, PerioderMedBehandlingsId } from '@k9-sak-web/types';
import { AddCircle } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import axios from 'axios';
import { Location } from 'history';
import { Tilbakeknapp } from 'nav-frontend-ikonknapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { useQueries, UseQueryResult } from 'react-query';
import { NavLink, useNavigate } from 'react-router-dom';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import BehandlingFilter, { automatiskBehandling } from './BehandlingFilter';
import styles from './behandlingPicker.less';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingSelected from './BehandlingSelected';
import { sortBehandlinger } from './behandlingVelgerUtils';

const getBehandlingNavn = (
  behandling: BehandlingAppKontekst,
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn,
  intl: IntlShape,
) => {
  if (behandling.type === behandlingType.FORSTEGANGSSOKNAD || behandling.type === behandlingType.KLAGE) {
    return getKodeverkFn(behandling.type, KodeverkType.BEHANDLING_TYPE, behandling.type).navn;
  }

  return intl.formatMessage({ id: 'BehandlingPickerItemContent.BehandlingTypeNavn.Viderebehandling' });
};

const erAutomatiskBehandlet = (behandling: BehandlingAppKontekst) =>
  !behandling.ansvarligSaksbehandler && behandling.status === behandlingStatus.AVSLUTTET;

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
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn;
  setValgtBehandlingId;
  intl: IntlShape;
  alleSøknadsperioder: UseQueryResult<PerioderMedBehandlingsId, unknown>[];
  activeFilters: string[];
}): ReactElement[] =>
  sortBehandlinger(behandlinger)
    .filter(behandling => {
      if (activeFilters.length === 0) {
        return true;
      }
      if (activeFilters.includes(automatiskBehandling)) {
        return erAutomatiskBehandlet(behandling);
      }
      return activeFilters.includes(behandling.type);
    })
    .map(behandling => (
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
                ? getKodeverkFn(
                    behandling.behandlingsresultat.type.kode,
                    KodeverkType.BEHANDLING_RESULTAT_TYPE,
                    behandling.type,
                  ).navn
                : undefined
            }
            behandlingsresultatTypeKode={
              behandling.behandlingsresultat ? behandling.behandlingsresultat.type.kode : undefined
            }
            erAutomatiskRevurdering={erAutomatiskBehandlet(behandling)}
            søknadsperioder={alleSøknadsperioder.find(periode => periode.data?.id === behandling.id)?.data?.perioder}
            erFerdigstilt={!!behandling.avsluttet}
            erUnntaksløype={behandling.type === behandlingType.UNNTAK}
          />
        </NavLink>
      </li>
    ));

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
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn;
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
    const åpenBehandling = behandlinger.find(behandling => behandling.status !== behandlingStatus.AVSLUTTET);
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
      if (!filterListe.some(filter => filter.value === behandling.type)) {
        filterListe.push({
          value: behandling.type,
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
            årsaker.push(getKodeverkFn(årsak, KodeverkType.ÅRSAK_TIL_VURDERING).navn);
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
        <Tilbakeknapp className={styles.backButton} onClick={() => setValgtBehandlingId(undefined)}>
          <FormattedMessage id="Behandlingspunkt.Behandling.SeAlle" />
        </Tilbakeknapp>
      )}
      {!valgtBehandlingId && (
        <>
          <div className={styles.headerContainer}>
            <Undertittel>
              <FormattedMessage
                id="Behandlingspunkt.VelgBehandling"
                values={{ antallBehandlinger: behandlinger.length }}
              />
            </Undertittel>
            <BehandlingFilter
              filters={getFilterListe()}
              activeFilters={activeFilters}
              onFilterChange={updateFilter}
              text={intl.formatMessage({ id: 'Behandlingspunkt.Filtrer' })}
            />
          </div>
          <ul className={styles.behandlingList}>
            {noExistingBehandlinger && (
              <Normaltekst data-testid="ingenBehandlinger">
                <FormattedMessage id="BehandlingList.ZeroBehandlinger" />
              </Normaltekst>
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
              ? getKodeverkFn(
                  valgtBehandling.behandlingsresultat.type.kode,
                  KodeverkType.BEHANDLING_RESULTAT_TYPE,
                  valgtBehandling.type,
                ).navn
              : undefined
          }
          behandlingsresultatTypeKode={
            valgtBehandling.behandlingsresultat ? valgtBehandling.behandlingsresultat.type.kode : undefined
          }
          behandlingsårsaker={getÅrsaksliste()}
          behandlingTypeNavn={getBehandlingNavn(valgtBehandling, getKodeverkFn, intl)}
          behandlingTypeKode={valgtBehandling.type}
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
