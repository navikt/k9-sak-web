import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Avklaringtype.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { formatDate, formatPeriod } from '@k9-sak-web/gui/utils/formatters.js';
import type { VilkårSplittPanelPeriod } from '../../../shared/vilkårSplittPanel/VilkårSplittPanel.js';

export const IKKE_SATT_PERIODE_ID = 'ikke-satt';

export type OpphørPeriodStatus = VilkårSplittPanelPeriod['status'];
export interface OpphørPeriodInput {
  id?: string;
  fom: string;
  tom?: string;
  status: OpphørPeriodStatus;
  foreslåttIBehandlingen?: boolean;
  avklaringtype?: Avklaringtype;
}

interface GetOpphørPeriodsProps {
  aksjonspunkt?: AksjonspunktDto;
  perioder: OpphørPeriodInput[];
}

export const getOpphørPeriods = ({ aksjonspunkt, perioder }: GetOpphørPeriodsProps): VilkårSplittPanelPeriod[] => {
  const isAksjonspunktOpen = aksjonspunkt !== undefined && aksjonspunkt.status !== AksjonspunktStatus.UTFØRT;
  const erSendtTilbakeFraBeslutter = aksjonspunkt?.toTrinnsBehandlingGodkjent === false;
  const mappedPeriods: VilkårSplittPanelPeriod[] = perioder
    .toSorted((firstPeriod, secondPeriod) => secondPeriod.fom.localeCompare(firstPeriod.fom))
    .map(periode => ({
      id: periode.id ?? periode.fom,
      status: periode.status,
      label:
        periode.avklaringtype === Avklaringtype.AVSLAG && periode.tom
          ? formatPeriod(periode.fom, periode.tom)
          : formatDate(periode.fom),
      periode: { fom: periode.fom, tom: periode.tom },
      foreslåttIBehandlingen: periode.foreslåttIBehandlingen,
    }));

  return [
    ...(isAksjonspunktOpen && !erSendtTilbakeFraBeslutter
      ? [{ id: IKKE_SATT_PERIODE_ID, status: 'warning' as const, label: 'Ikke satt' }]
      : []),
    ...mappedPeriods,
  ];
};
