import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-soknadsfrist';
import SoknadsfristVilkarProsessIndexV2 from '@k9-sak-web/prosess-vilkar-soknadsfrist-v2';
import { UngdomsytelseBehandlingApiKeys } from '../../../data/ungdomsytelseBehandlingApi';

class SoknadsfristPanelDef extends ProsessStegPanelDef {
  getId = () => 'SOKNADSFRIST';

  getTekstKode = () => 'Søknadsfrist';

  getKomponent = props => {
    if (props.featureToggles?.PROSESS_VILKAR_SOKNADSFRIST) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return <SoknadsfristVilkarProsessIndexV2 {...props} {...deepCopyProps} />;
    }
    return <SoknadsfristVilkarProsessIndex {...props} />;
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  ];

  getVilkarKoder = () => [vilkarType.SOKNADSFRISTVILKARET];

  getEndepunkter = () => [UngdomsytelseBehandlingApiKeys.SOKNADSFRIST_STATUS];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = ({
    vilkarForSteg,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
    featureToggles,
    behandling,
    rettigheter,
  }): any => {
    const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status;
    const kanEndrePåSøknadsopplysninger = rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet;

    return {
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
