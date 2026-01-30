import {
  k9_kodeverk_behandling_BehandlingType,
  k9_kodeverk_vilkår_VilkårType,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { useMemo, type SetStateAction } from 'react';

const RELEVANTE_VILKAR_KODER = [k9_kodeverk_vilkår_VilkårType.ALDERSVILKÅR];

interface Props {
  behandling: Behandling;
  submitCallback: (data: any) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  visPeriodisering: boolean;
  vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
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
      behandling={{ type: props.behandling.type.kode as k9_kodeverk_behandling_BehandlingType }}
      vilkar={vilkårForSteg}
      erOverstyrt={false}
      overstyringApKode=""
      erMedlemskapsPanel={false}
      panelTittelKode="Alder"
    />
  );
};
