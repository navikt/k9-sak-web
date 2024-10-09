import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { BeregningsgrunnlagProsessIndex } from '@navikt/ft-prosess-beregningsgrunnlag';

const mapYtelsesSpesifiktGrunnlagForFrisinn = (beregningsgrunnlag, behandling) =>
  beregningsgrunnlag.map(bg => ({
    ...bg,
    ytelsesspesifiktGrunnlag: {
      ...bg.ytelsesspesifiktGrunnlag,
      behandlingÅrsaker: behandling.behandlingÅrsaker.map(({ behandlingArsakType }) => behandlingArsakType),
    },
  }));

class PanelDef extends ProsessStegPanelDef {
  // eslint-disable-next-line class-methods-use-this
  getKomponent = props => {
    const {
      vilkar,
      beregningsgrunnlag,
      behandling,
      beregningreferanserTilVurdering,
      arbeidsgiverOpplysningerPerId,
      isReadOnly,
      alleKodeverk,
    } = props;
    const bgVilkaret = vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    return (
      <BeregningsgrunnlagProsessIndex
        {...props}
        beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, beregningreferanserTilVurdering)}
        beregningsgrunnlagListe={mapYtelsesSpesifiktGrunnlagForFrisinn(beregningsgrunnlag, behandling)}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        submitCallback={data => props.submitCallback(transformBeregningValues(data))}
        formData={props.formData}
        setFormData={props.setFormData}
        readOnlySubmitButton={isReadOnly}
        kodeverkSamling={alleKodeverk}
        isReadOnly={isReadOnly}
      />
    );
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON,
    aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  ];

  getVilkarKoder = () => [vilkarType.BEREGNINGSGRUNNLAGVILKARET];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, beregningsgrunnlag, arbeidsgiverOpplysningerPerId, beregningreferanserTilVurdering }) => ({
    fagsak,
    beregningsgrunnlag: beregningsgrunnlag ? [beregningsgrunnlag[0]] : [],
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
