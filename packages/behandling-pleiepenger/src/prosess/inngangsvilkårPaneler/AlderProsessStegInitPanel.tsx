import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import {
  k9_kodeverk_behandling_BehandlingType,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';
import { useMemo, type SetStateAction } from 'react';

const RELEVANTE_VILKAR_KODER = [vilkarType.ALDERSVILKARET];

interface Props {
  behandling: Behandling;
  submitCallback: (data: any) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  /** Skal være den faktiske teksten og ikke en id til react-intl */
  visPeriodisering: boolean;
  vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
  visAllePerioder: boolean;
}

export const AlderProsessStegInitPanel = (props: Props) => {
  const vilkarForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [props.vilkår]);
  const skalVisePanel = vilkarForSteg.length > 0;

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
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
      vilkar={vilkarForSteg}
      erOverstyrt={false}
      overstyringApKode=""
      erMedlemskapsPanel={false}
      panelTittelKode="Alder"
    />
  );
};
