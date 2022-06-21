import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import BeregningsgrunnlagProsessIndexNy from '@navikt/ft-prosess-beregningsgrunnlag';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from "@fpsak-frontend/utils";

class PanelDef extends ProsessStegPanelDef {

  getKomponent = (props) => {
    if (props.featureToggles.NY_BEREGNING_PROSESS_ENABLED) {
      const bgVilkaret = props.vilkar.find(v => v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
      return (<BeregningsgrunnlagProsessIndexNy
          beregningsgrunnlagsvilkar={konverterKodeverkTilKode(bgVilkaret)}
          beregningsgrunnlagListe={konverterKodeverkTilKode(props.beregningsgrunnlag)}
          submitCallback={props.submitCallback}
          isReadOnly={props.isReadOnly}
          readOnlySubmitButton={props.isReadOnly}
          alleKodeverk={konverterKodeverkTilKode(props.alleKodeverk)}
          arbeidsgiverOpplysningerPerId={konverterKodeverkTilKode(props.arbeidsgiverOpplysningerPerId)}
          formData={null}
          setFormData={() => {}}
      />);
    }
    return (<BeregningsgrunnlagProsessIndex {...props} />);
  }

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  ];

  getVilkarKoder = () => [vilkarType.BEREGNINGSGRUNNLAGVILKARET];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, beregningsgrunnlag, arbeidsgiverOpplysningerPerId, beregningreferanserTilVurdering }) => ({
    fagsak,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    beregningreferanserTilVurdering
  });
}

class BeregningsgrunnlagProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNINGSGRUNNLAG;

  getTekstKode = () => 'Behandlingspunkt.Beregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningsgrunnlagProsessStegPanelDef;
