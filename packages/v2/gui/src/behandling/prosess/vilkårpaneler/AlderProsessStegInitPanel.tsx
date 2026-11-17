import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { VilkårMedPerioderDto as k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { useMemo, type SetStateAction } from 'react';
import { hentK9BehandlingType } from './types.js';
import type { ProsessBehandling } from './types.js';

const RELEVANTE_VILKAR_KODER = [VilkårType.ALDERSVILKÅR];

interface Props {
  behandling: ProsessBehandling;
  submitCallback: (data: unknown) => Promise<unknown>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
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

  const behandlingType = hentK9BehandlingType(props.behandling.type.kode);

  return (
    <VilkarresultatMedOverstyringProsessIndex
      submitCallback={props.submitCallback}
      overrideReadOnly={props.overrideReadOnly}
      kanOverstyreAccess={props.kanOverstyreAccess}
      toggleOverstyring={props.toggleOverstyring}
      visPeriodisering={props.visPeriodisering}
      visAllePerioder={props.visAllePerioder}
      aksjonspunkter={[]}
      behandling={{ type: behandlingType }}
      vilkar={vilkårForSteg}
      erOverstyrt={false}
      overstyringApKode=""
      erMedlemskapsPanel={false}
      panelTittelKode="Alder"
    />
  );
};
