import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-soknadsfrist';
import SoknadsfristVilkarProsessIndexV2 from '@k9-sak-web/prosess-vilkar-soknadsfrist-v2';
import { OmsorgspengerBehandlingApiKeys } from '../../../data/omsorgspengerBehandlingApi';

class SoknadsfristPanelDef extends ProsessStegPanelDef {
  getId = () => 'SOKNADSFRIST';

  getTekstKode = () => 'Søknadsfrist';

  getKomponent = props => {
    if (props.featureToggles?.PROSESS_VILKAR_SOKNADSFRIST) {
      return <SoknadsfristVilkarProsessIndexV2 {...props} />;
    }
    return <SoknadsfristVilkarProsessIndex {...props} />;
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  ];

  getVilkarKoder = () => [vilkarType.SOKNADSFRISTVILKARET];

  getEndepunkter = () => [OmsorgspengerBehandlingApiKeys.SOKNADSFRIST_STATUS];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = ({
    vilkarForSteg,
    alleKodeverk,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
    behandling,
    rettigheter,
    featureToggles,
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
      kanEndrePåSøknadsopplysninger,
      featureToggles,
    };
  };
}

export default SoknadsfristPanelDef;
