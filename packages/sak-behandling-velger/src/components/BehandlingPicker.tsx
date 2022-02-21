import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingAppKontekst, BehandlingPerioder, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import PerioderMedBehandlingsId from '@k9-sak-web/types/src/PerioderMedBehandlingsId';
import axios from 'axios';
import { Location } from 'history';
import { Tilbakeknapp } from 'nav-frontend-ikonknapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import BehandlingFilter, { automatiskBehandling } from './BehandlingFilter';
import styles from './behandlingPicker.less';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingSelected from './BehandlingSelected';
import { sortBehandlinger } from './behandlingVelgerUtils';

const getBehandlingNavn = (
  behandling: BehandlingAppKontekst,
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn,
  intl: IntlShape,
) => {
  if (behandling.type.kode === behandlingType.FORSTEGANGSSOKNAD || behandling.type.kode === behandlingType.KLAGE) {
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
  alleSøknadsperioder: PerioderMedBehandlingsId[];
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
      return activeFilters.includes(behandling.type.kode);
    })
    .map(behandling => (
      <li data-testid="behandling" key={behandling.id}>
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
            søknadsperioder={alleSøknadsperioder.find(periode => periode.id === behandling.id)?.perioder}
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

interface OwnProps {
  behandlinger: BehandlingAppKontekst[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
  behandlingId?: number;
}

const behandlingPerioderÅrsakRel = 'behandling-perioder-årsak';
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
}: OwnProps) => {
  const intl = useIntl();
  const [valgtBehandlingId, setValgtBehandlingId] = useState(behandlingId);
  const previousBehandlingId = usePrevious(behandlingId);
  const [søknadsperioder, setSøknadsperioder] = useState<Array<PerioderMedBehandlingsId>>([]);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    if (!previousBehandlingId && behandlingId) {
      setValgtBehandlingId(behandlingId);
    }
  }, [behandlingId]);

  useEffect(() => {
    const perioder = [];
    const behandlingerMedPerioderMedÅrsak = behandlinger.filter(behandling =>
      behandling.links.some(link => link.rel === behandlingPerioderÅrsakRel),
    );
    if (behandlingerMedPerioderMedÅrsak.length > 0) {
      Promise.all(
        behandlingerMedPerioderMedÅrsak.map(behandling =>
          axios
            .get(behandling.links.find(link => link.rel === behandlingPerioderÅrsakRel).href)
            .then(response => ({ data: response.data, id: behandling.id })),
        ),
      ).then((responses: { data: BehandlingPerioder; id: number }[]) => {
        responses.forEach(({ data, id }) => {
          perioder.push({ id, perioder: data.perioderTilVurdering, perioderMedÅrsak: data.perioderMedÅrsak });
        });
        setSøknadsperioder(perioder);
      });
    }
  }, []);

  const valgtBehandling = valgtBehandlingId
    ? behandlinger.find(behandling => behandling.id === valgtBehandlingId)
    : null;

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
      if (erAutomatiskBehandlet(behandling) && !filterListe.includes(automatiskBehandling)) {
        filterListe.push({
          value: automatiskBehandling,
          label: intl.formatMessage({ id: 'Behandlingspunkt.BehandlingFilter.AutomatiskBehandling' }),
        });
      }
    });
    return filterListe;
  };

  const getÅrsaksliste = (): string[] => {
    const søknadsperiode = søknadsperioder.find(periode => periode.id === valgtBehandling.id);
    if (!søknadsperiode) {
      return [];
    }
    const årsaker = [];
    [...søknadsperiode.perioderMedÅrsak].reverse().forEach(periode =>
      periode.årsaker.forEach(årsak => {
        // TODO: try/catch skal ikke være nødvendig etter at backend har lagt inn alle behandlingsårsaker
        try {
          årsaker.push(getKodeverkFn({ kode: årsak, kodeverk: kodeverkTyper.BEHANDLING_AARSAK }).navn);
        } catch {
          årsaker.push(årsak);
        }
      }),
    );
    return årsaker;
  };

  return (
    <div className={styles.behandlingPicker}>
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
                behandlinger,
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
        <>
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
            søknadsperioder={søknadsperioder.find(periode => periode.id === valgtBehandling.id)?.perioder}
          />
        </>
      )}
    </div>
  );
};
export default BehandlingPicker;
