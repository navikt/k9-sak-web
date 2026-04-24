import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

import { UngVedtakIndex, type UngVedtakIndexProps } from '@k9-sak-web/gui/prosess/ung-vedtak/UngVedtakIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { UngdomsytelseBehandlingApiKeys } from '../../data/ungdomsytelseBehandlingApi';
import findStatusForVedtak from '../vedtakStatusUtlederUngdomsytelse';
import type {
  LegacyBekreftAksjonspunktCallback,
  LegacyBekreftAksjonspunktModell,
} from '@k9-sak-web/gui/utils/typehelp/AksjonspunktSubmitCallbackArgumentType.js';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props: Record<string, unknown> & { submitCallback: LegacyBekreftAksjonspunktCallback }) => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    // mapper legacy submitCallback til ny vedtakBekreftelseCallback.
    // Når prosessStegUngdomsytelsePanelDefinisjoner er skrive om til ny panel definisjonskode skal dette fjernast, og
    // vedtakBekreftelseCallback skal flyttast ned til UngVedtak komponenten der den kan benytte api for å kalle server.
    const vedtakBekreftelseCallback: UngVedtakIndexProps['vedtakBekreftelseCallback'] = bekreftet => {
      const aksjonspunktModels: LegacyBekreftAksjonspunktModell[] = bekreftet.map(v => {
        return {
          kode: v['@type'],
          ...v,
        };
      });
      return props.submitCallback(aksjonspunktModels);
    };
    return (
      <UngVedtakIndex
        {...props}
        {...deepCopyProps}
        vedtakBekreftelseCallback={vedtakBekreftelseCallback}
        tekster={{ innvilget: 'Ungdomsprogramytelse er innvilget', avslått: 'Ungdomsprogramytelse er opphørt' }}
      />
    );
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    aksjonspunktCodes.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK,
    aksjonspunktCodes.VURDERE_DOKUMENT,
    aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
    aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    aksjonspunktCodes.SJEKK_TILBAKEKREVING,
  ];

  getEndepunkter = () => [UngdomsytelseBehandlingApiKeys.TILBAKEKREVINGVALG];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg }) =>
    findStatusForVedtak(vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat);

  getData = ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    rettigheter,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
  }) => ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    ytelseTypeKode: fagsakYtelsesType.UNGDOMSYTELSE,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
  });

  getId = () => 'VEDTAK';
}

class VedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakProsessStegPanelDef;
