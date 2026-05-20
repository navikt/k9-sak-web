import { behandlingType as k9KlageBehandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import {
  k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  k9_kodeverk_behandling_BehandlingType as BehandlingDtoType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ung_sak_kontrakt_behandling_BehandlingVisningsnavn } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { finnKodeverkTypeForBehandlingType } from '@k9-sak-web/gui/utils/behandlingUtils.js';
import { formaterVisningsnavn } from '@k9-sak-web/gui/utils/formaterVisningsnavn.js';
import { type KodeverkNavnFraKodeType, KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { type UseQueryResult } from '@tanstack/react-query';
import { type Location } from 'history';
import { type Dispatch, type ReactElement, type SetStateAction } from 'react';
import { NavLink } from 'react-router';
import type { Behandling } from '../types/Behandling';
import type { PerioderMedBehandlingsId } from '../types/PerioderMedBehandlingsId';
import { automatiskBehandling } from './BehandlingFilter';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import styles from './behandlingPicker.module.css';
import { filterPerioderForBarnetillegg, filterPerioderForKontrollAvInntekt } from './behandlingVelgerUtils';

export const getBehandlingNavn = (behandlingType: string, kodeverkNavnFraKode: KodeverkNavnFraKodeType) => {
  switch (behandlingType) {
    case BehandlingDtoType.FØRSTEGANGSSØKNAD:
    case k9KlageBehandlingType.KLAGE:
    case k9KlageBehandlingType.TILBAKEKREVING:
    case k9KlageBehandlingType.REVURDERING_TILBAKEKREVING:
      return kodeverkNavnFraKode(
        behandlingType,
        KodeverkType.BEHANDLING_TYPE,
        finnKodeverkTypeForBehandlingType(behandlingType),
      );
    default:
      return 'Viderebehandling';
  }
};

export const erAutomatiskBehandlet = (behandling: Behandling) =>
  !behandling.ansvarligSaksbehandler && behandling.status === BehandlingDtoStatus.AVSLUTTET;

/**
 * Henter søknadsperioder for valgt behandling.
 * For "Kontroll av inntekt" behandlinger filtreres kun perioder med KONTROLL_AV_INNTEKT som årsak.
 */
export const getSøknadsperioderForValgtBehandling = (
  søknadsperioder: UseQueryResult<PerioderMedBehandlingsId, unknown>[],
  valgtBehandling?: Behandling,
) => {
  const dataForValgtBehandling = søknadsperioder.find(periode => periode.data?.id === valgtBehandling?.id)?.data;
  if (valgtBehandling?.visningsnavn === ung_sak_kontrakt_behandling_BehandlingVisningsnavn.KONTROLL_AV_INNTEKT) {
    return filterPerioderForKontrollAvInntekt(dataForValgtBehandling);
  }
  if (valgtBehandling?.visningsnavn === ung_sak_kontrakt_behandling_BehandlingVisningsnavn.ENDRING_AV_BARNETILLEGG) {
    return filterPerioderForBarnetillegg(dataForValgtBehandling);
  }
  return dataForValgtBehandling?.perioder ?? [];
};

interface BehandlingListItemsProps {
  behandlinger: Behandling[];
  behandlingsnummerById: Map<number, number>;
  getBehandlingLocation: (behandlingId: number) => Location;
  setValgtBehandlingId: Dispatch<SetStateAction<number | undefined>>;
  alleSøknadsperioder: UseQueryResult<PerioderMedBehandlingsId, unknown>[];
  aktiveFilter: string[];
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
}

const BehandlingListItems = ({
  behandlinger,
  behandlingsnummerById,
  getBehandlingLocation,
  setValgtBehandlingId,
  alleSøknadsperioder,
  aktiveFilter,
  kodeverkNavnFraKode,
}: BehandlingListItemsProps): ReactElement[] => {
  const filtrerte = behandlinger.filter(behandling => {
    if (aktiveFilter.length === 0) {
      return true;
    }
    if (aktiveFilter.includes(automatiskBehandling)) {
      return erAutomatiskBehandlet(behandling);
    }
    return aktiveFilter.includes(behandling.type);
  });

  return filtrerte.map(behandling => {
    const visningsnavn = formaterVisningsnavn(behandling.visningsnavn);
    const globalIndex = behandlingsnummerById.get(behandling.id) ?? 0;
    return (
      <li data-testid="BehandlingPickerItem" key={behandling.id}>
        <NavLink
          onClick={() => setValgtBehandlingId(behandling.id)}
          className={styles.linkToBehandling}
          to={getBehandlingLocation(behandling.id)}
        >
          <BehandlingPickerItemContent
            behandling={behandling}
            behandlingTypeNavn={
              behandling.type !== BehandlingDtoType.FØRSTEGANGSSØKNAD && visningsnavn
                ? visningsnavn
                : getBehandlingNavn(behandling.type, kodeverkNavnFraKode)
            }
            erAutomatiskRevurdering={erAutomatiskBehandlet(behandling)}
            søknadsperioder={getSøknadsperioderForValgtBehandling(alleSøknadsperioder, behandling)}
            index={globalIndex}
          />
        </NavLink>
      </li>
    );
  });
};

export default BehandlingListItems;
