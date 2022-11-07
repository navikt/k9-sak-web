import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { DynamicLoader, ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode, mapVilkar } from '@fpsak-frontend/utils';

const ProsessBeregningsgrunnlag = React.lazy(() => import('@navikt/ft-prosess-beregningsgrunnlag'));
const ProsessBeregningsgrunnlagSplittetSammenligning = React.lazy(
  () => import('@navikt/ft-prosess-beregningsgrunnlag_3_0_9'),
);

const ProsessBeregningsgrunnlagMF =
  process.env.NODE_ENV !== 'development'
    ? undefined
    : // eslint-disable-next-line import/no-unresolved
      () => import('ft_prosess_beregningsgrunnlag/ProsessBeregningsgrunnlag');

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
    if (props.featureToggles.SPLITTET_SAMMENLINGNING_BEREGNING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps);
      const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
      return (
        <DynamicLoader<React.ComponentProps<typeof ProsessBeregningsgrunnlagSplittetSammenligning>>
          packageCompFn={() => import('@navikt/ft-prosess-beregningsgrunnlag_3_0_9')}
          federatedCompFn={ProsessBeregningsgrunnlagMF}
          {...props}
          beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
          beregningsgrunnlagListe={mapYtelsesSpesifiktGrunnlagForFrisinn(
            deepCopyProps.beregningsgrunnlag,
            deepCopyProps.behandling,
          )}
          arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
          submitCallback={props.submitCallback}
          formData={props.formData}
          setFormData={props.setFormData}
        />
      );
    }
    if (props.featureToggles.NY_BEREGNING_PROSESS_ENABLED) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps);
      const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
      return (
        <DynamicLoader<React.ComponentProps<typeof ProsessBeregningsgrunnlag>>
          packageCompFn={() => import('@navikt/ft-prosess-beregningsgrunnlag')}
          federatedCompFn={ProsessBeregningsgrunnlagMF}
          beregningsgrunnlagsvilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
          beregningsgrunnlagListe={mapYtelsesSpesifiktGrunnlagForFrisinn(
            deepCopyProps.beregningsgrunnlag,
            deepCopyProps.behandling,
          )}
          arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
          submitCallback={props.submitCallback}
          formData={props.formData}
          setFormData={props.setFormData}
          readOnlySubmitButton={deepCopyProps.isReadOnly}
          alleKodeverk={deepCopyProps.alleKodeverk}
          isReadOnly={deepCopyProps.isReadOnly}
        />
      );
    }
    return <BeregningsgrunnlagProsessIndex {...props} />;
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
