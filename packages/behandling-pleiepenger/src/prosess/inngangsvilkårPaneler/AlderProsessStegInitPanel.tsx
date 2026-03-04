import type { BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { useMemo, type SetStateAction } from 'react';

const RELEVANTE_VILKAR_KODER = [vilkarType.ALDERSVILKÅR];

interface Props {
  behandling: Behandling;
  submitCallback: (data: any) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  visPeriodisering: boolean;
  vilkår: VilkårMedPerioderDto[];
  visAllePerioder: boolean;
}

export const AlderProsessStegInitPanel = (props: Props) => {
  const vilkårForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkår => RELEVANTE_VILKAR_KODER.some(kode => kode === vilkår.vilkarType));
  }, [props.vilkår]);
  const skalVisePanel = vilkårForSteg.length > 0;

  if (!skalVisePanel) {
    return null;
  }

  return (
    <VilkarresultatMedOverstyringProsessIndex
      submitCallback={props.submitCallback}
      overrideReadOnly={props.overrideReadOnly}
      kanOverstyreAccess={props.kanOverstyreAccess}
      toggleOverstyring={props.toggleOverstyring}
      visPeriodisering={props.visPeriodisering}
      visAllePerioder={props.visAllePerioder}
      aksjonspunkter={[]}
      behandling={{ type: props.behandling.type.kode as BehandlingType }}
      vilkar={vilkårForSteg}
      erOverstyrt={false}
      overstyringApKode=""
      erMedlemskapsPanel={false}
      panelTittelKode="Alder"
    />
  );
};
