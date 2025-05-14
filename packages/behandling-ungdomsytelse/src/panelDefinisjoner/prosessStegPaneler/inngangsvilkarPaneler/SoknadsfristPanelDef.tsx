import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VilkårMedPerioderDtoVilkarType } from '@k9-sak-web/backend/ungsak/generated';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/SoknadsfristVilkarProsessIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { UngdomsytelseBehandlingApiKeys } from '../../../data/ungdomsytelseBehandlingApi';

class SoknadsfristPanelDef extends ProsessStegPanelDef {
  getId = () => 'SOKNADSFRIST';

  getTekstKode = () => 'Søknadsfrist';

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <SoknadsfristVilkarProsessIndex {...props} {...deepCopyProps} />;
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  ];

  getVilkarKoder = () => [VilkårMedPerioderDtoVilkarType.SØKNADSFRIST];

  getEndepunkter = () => [UngdomsytelseBehandlingApiKeys.SOKNADSFRIST_STATUS];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = ({
    vilkarForSteg,
    alleKodeverk,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
    featureToggles,
    behandling,
    rettigheter,
  }): any => {
    const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status.kode;
    const kanEndrePåSøknadsopplysninger = rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet;

    return {
      avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType.kode],
      erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
      panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
      lovReferanse: vilkarForSteg.length > 0 ? vilkarForSteg[0].lovReferanse : undefined,
      overrideReadOnly,
      kanOverstyreAccess,
      toggleOverstyring,
      featureToggles,
      kanEndrePåSøknadsopplysninger,
    };
  };
}

export default SoknadsfristPanelDef;
