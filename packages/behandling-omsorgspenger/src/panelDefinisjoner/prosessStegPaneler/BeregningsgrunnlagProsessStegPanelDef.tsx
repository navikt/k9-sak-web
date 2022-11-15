import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef, DynamicLoader } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode, mapVilkar } from '@fpsak-frontend/utils';
import '@navikt/ft-prosess-beregningsgrunnlag/dist/style.css';

const ProsessBeregningsgrunnlag = React.lazy(() => import('@navikt/ft-prosess-beregningsgrunnlag'));

const ProsessBeregningsgrunnlagMF =
  process.env.NODE_ENV !== 'development'
    ? undefined
    : // eslint-disable-next-line import/no-unresolved
      () => import('ft_prosess_beregningsgrunnlag/ProsessBeregningsgrunnlag');

class PanelDef extends ProsessStegPanelDef {
  // eslint-disable-next-line class-methods-use-this
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps);
    const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    return (
      <DynamicLoader<React.ComponentProps<typeof ProsessBeregningsgrunnlag>>
        packageCompFn={() => import('@navikt/ft-prosess-beregningsgrunnlag')}
        federatedCompFn={ProsessBeregningsgrunnlagMF}
        {...props}
        beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
        beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        submitCallback={props.submitCallback}
        formData={props.formData}
        setFormData={props.setFormData}
      />
    );
  };

  // eslint-disable-next-line class-methods-use-this
  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
    aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  ];

  // eslint-disable-next-line class-methods-use-this
  getVilkarKoder = () => [vilkarType.BEREGNINGSGRUNNLAGVILKARET];

  // eslint-disable-next-line class-methods-use-this
  getOverstyrVisningAvKomponent = () => true;

  // eslint-disable-next-line class-methods-use-this
  getData = ({ fagsak, beregningsgrunnlag, arbeidsgiverOpplysningerPerId, beregningreferanserTilVurdering }) => ({
    fagsak,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    beregningreferanserTilVurdering,
  });
}

class BeregningsgrunnlagProsessStegPanelDef extends ProsessStegDef {
  // eslint-disable-next-line class-methods-use-this
  getUrlKode = () => prosessStegCodes.BEREGNINGSGRUNNLAG;

  // eslint-disable-next-line class-methods-use-this
  getTekstKode = () => 'Behandlingspunkt.Beregning';

  // eslint-disable-next-line class-methods-use-this
  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningsgrunnlagProsessStegPanelDef;
