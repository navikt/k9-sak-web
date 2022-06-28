import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef, DynamicLoader } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from "@fpsak-frontend/utils";
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';

const ProsessBeregningsgrunnlag = React.lazy(() => import('@navikt/ft-prosess-beregningsgrunnlag'));

const enableFederation = process.env.NODE_ENV === 'development';

const ProsessBeregningsgrunnlagMF = !enableFederation ? undefined
    // eslint-disable-next-line import/no-unresolved
    : () => import('ft_prosess_beregningsgrunnlag/ProsessBeregningsgrunnlag');

class PanelDef extends ProsessStegPanelDef {

  getKomponent = (props) => {
    if (props.featureToggles.NY_BEREGNING_PROSESS_ENABLED || true) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps);
      const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
      return (
          <DynamicLoader<React.ComponentProps<typeof ProsessBeregningsgrunnlag>>
              packageCompFn={() => import('@navikt/ft-prosess-beregningsgrunnlag')}
              federatedCompFn={ProsessBeregningsgrunnlagMF}
              {...props}
              beregningsgrunnlagsvilkar={bgVilkaret}
              beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag}
              arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
              submitCallback={props.submitCallback}
              formData={props.formData}
              setFormData={props.setFormData}
          />
      );
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
    beregningreferanserTilVurdering,
  });
}

class BeregningsgrunnlagProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNINGSGRUNNLAG;

  getTekstKode = () => 'Behandlingspunkt.Beregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningsgrunnlagProsessStegPanelDef;
