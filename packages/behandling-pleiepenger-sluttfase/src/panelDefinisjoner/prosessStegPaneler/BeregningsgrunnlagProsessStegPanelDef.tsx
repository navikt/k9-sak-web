import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <BeregningsgrunnlagProsessIndex {...props} />;

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
