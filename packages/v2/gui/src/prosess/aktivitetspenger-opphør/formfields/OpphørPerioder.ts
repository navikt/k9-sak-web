import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import type { VilkårSplittPanelPeriod } from '../../../shared/vilkårSplittPanel/VilkårSplittPanel.js';

export type OpphørPeriodStatus = VilkårSplittPanelPeriod['status'];
export interface OpphørPeriodInput {
  fom: string;
  tom?: string;
  status: OpphørPeriodStatus;
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
    .map(periode => {
      const mappedPeriod: VilkårSplittPanelPeriod = {
        id: periode.fom,
        status: periode.status,
        label: periode.tom ? `${formatDate(periode.fom)} - ${formatDate(periode.tom)}` : formatDate(periode.fom),
      };
      if (periode.tom) {
        mappedPeriod.periode = { fom: periode.fom, tom: periode.tom };
      }
      return mappedPeriod;
    });

  return [
    ...(isAksjonspunktOpen && !erSendtTilbakeFraBeslutter
      ? [{ id: 'ikke-satt', status: 'warning' as const, label: 'Ikke satt' }]
      : []),
    ...mappedPeriods,
  ];
};
