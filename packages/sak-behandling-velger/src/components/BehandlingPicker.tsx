import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingAppKontekst, BehandlingPerioder, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import axios from 'axios';
import { Location } from 'history';
import moment from 'moment';
import { Tilbakeknapp } from 'nav-frontend-ikonknapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import BehandlingFilter from './BehandlingFilter';
import styles from './behandlingPicker.less';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingSelected from './BehandlingSelected';
import PerioderMedBehandlingsId from './PerioderMedBehandlingsId';

export const sortBehandlinger = (behandlinger: BehandlingAppKontekst[]): BehandlingAppKontekst[] =>
  behandlinger.sort((b1, b2) => {
    if (b1.avsluttet && !b2.avsluttet) {
      return 1;
    }
    if (!b1.avsluttet && b2.avsluttet) {
      return -1;
    }
    if (b1.avsluttet && b2.avsluttet) {
      return moment(b2.avsluttet).diff(moment(b1.avsluttet));
    }
    return moment(b2.opprettet).diff(moment(b1.opprettet));
  });

const getBehandlingNavn = (
  behandling,
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn,
  intl: IntlShape,
) => {
  if (behandling.type.kode === behandlingType.FORSTEGANGSSOKNAD || behandling.type.kode === behandlingType.KLAGE) {
    return getKodeverkFn(behandling.type, behandling.type).navn;
  }

  return intl.formatMessage({ id: 'BehandlingPickerItemContent.BehandlingTypeNavn.Viderebehandling' });
};

const renderListItems = (
  behandlinger: BehandlingAppKontekst[],
  getBehandlingLocation: (behandlingId: number) => Location,
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn,
  setValgtBehandling,
  intl: IntlShape,
  alleSøknadsperioder: PerioderMedBehandlingsId[],
  activeFilters: string[],
): ReactElement[] =>
  sortBehandlinger(behandlinger)
    .filter(behandling => {
      if (activeFilters.length === 0) {
        return true;
      }
      return activeFilters.includes(behandling.type.kode);
    })
    .map(behandling => (
      <li key={behandling.id}>
        <NavLink
          onClick={() => setValgtBehandling(behandling.id)}
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
            erAutomatiskRevurdering={behandling.behandlingÅrsaker.some(årsak => årsak.erAutomatiskRevurdering)}
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
    Promise.all(
      behandlinger.map(behandling =>
        axios
          .get(behandling.links.find(link => link.rel === 'behandling-perioder-årsak').href)
          .then(response => ({ data: response.data, id: behandling.id })),
      ),
    ).then((responses: { data: BehandlingPerioder; id: number }[]) => {
      responses.forEach(({ data, id }) => {
        perioder.push({ id, perioder: data.perioderTilVurdering });
      });
      setSøknadsperioder(perioder);
    });
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
    });
    return filterListe;
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
              <Normaltekst>
                <FormattedMessage id="BehandlingList.ZeroBehandlinger" />
              </Normaltekst>
            )}
            {!noExistingBehandlinger &&
              renderListItems(
                behandlinger,
                getBehandlingLocation,
                getKodeverkFn,
                setValgtBehandlingId,
                intl,
                søknadsperioder,
                activeFilters,
              )}
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
            behandlingsårsaker={valgtBehandling.behandlingÅrsaker.map(
              årsak => getKodeverkFn(årsak.behandlingArsakType).navn,
            )}
            behandlingTypeNavn={getBehandlingNavn(valgtBehandling, getKodeverkFn, intl)}
            søknadsperioder={søknadsperioder.find(periode => periode.id === valgtBehandling.id)?.perioder}
          />
        </>
      )}
    </div>
  );
};
export default BehandlingPicker;
