import React from 'react';
import PropTypes from 'prop-types';

import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import VurderEndringRefusjonPanel, {buildInitialValues, transformValues} from './VurderEndringRefusjonPanel';

const VurderRefusjonFieldArrayComponent = ({
    fields,
    arbeidsgiverOpplysningerPerId,
    readOnly,
    aktivtBeregningsgrunnlagIndex,
    alleBeregningsgrunnlag,
  }) => fields.map((fieldId, index) => ( 
        <div style={{ display: index === aktivtBeregningsgrunnlagIndex ? 'block' : 'none' }}>
        <VurderEndringRefusjonPanel
            key={fieldId}
            readOnly={readOnly}
            fieldId={fieldId}
            beregningsgrunnlag={alleBeregningsgrunnlag[index]}
            aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndex}
            aksjonspunkter={alleBeregningsgrunnlag[index].avklaringsbehov}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      </div>
    ));

      
VurderRefusjonFieldArrayComponent.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleBeregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType).isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
};


VurderRefusjonFieldArrayComponent.transformValues = (fieldArrayList, alleBeregningsgrunnlag, vilkårsperioder) =>
fieldArrayList
  .map((currentFormValues, index) => {
      const bg = alleBeregningsgrunnlag[index];
      const stpOpptjening = bg.skjæringstidspunkt;
      const vilkarPeriode = vilkårsperioder.find(periode => periode.periode.fom === stpOpptjening);
      return {
        periode: vilkarPeriode.periode,
        ...transformValues(currentFormValues, bg),
      };
  });


  VurderRefusjonFieldArrayComponent.buildInitialValues = (alleBeregningsgrunnlag) => 
    alleBeregningsgrunnlag.map(bg => ({
      avklaringsbehov: bg.avklaringsbehov,
      ...buildInitialValues(bg, bg.avklaringsbehov)
    }));
  

  
  export default VurderRefusjonFieldArrayComponent;
  