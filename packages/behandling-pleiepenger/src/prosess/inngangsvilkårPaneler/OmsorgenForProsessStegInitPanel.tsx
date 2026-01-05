import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import {
  k9_kodeverk_behandling_BehandlingType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';
import { useMemo, type SetStateAction } from 'react';

const RELEVANTE_VILKAR_KODER = [vilkarType.OMSORGENFORVILKARET];

interface Props {
  behandling: Behandling;
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (props: any[]) => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  /** Skal være den faktiske teksten og ikke en id til react-intl */
  visPeriodisering: boolean;
  vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
  visAllePerioder: boolean;
  overstyrteAksjonspunktKoder: string[];
}

export const OmsorgenForProsessStegInitPanel = (props: Props) => {
  const vilkarForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [props.vilkår]);
  const skalVisePanel = vilkarForSteg.length > 0;

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(ap => {
    const kode = ap.definisjon;
    return kode === aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR;
  });

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel) {
    return null;
  }

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR);

  const VilkarresultatMedOverstyringProsessIndexProps = {
    ...props,
    aksjonspunkter: relevanteAksjonspunkter,
    behandling: { type: props.behandling.type.kode as k9_kodeverk_behandling_BehandlingType },
    vilkar: vilkarForSteg,
    erOverstyrt,
    overstyringApKode: aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR,
    erMedlemskapsPanel: false,
  };
  return (
    <VilkarresultatMedOverstyringProsessIndex
      {...VilkarresultatMedOverstyringProsessIndexProps}
      panelTittelKode="Omsorg"
    />
  );
};
