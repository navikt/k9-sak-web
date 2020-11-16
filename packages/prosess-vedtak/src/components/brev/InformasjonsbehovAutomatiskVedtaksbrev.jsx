import React from 'react';
import PropTypes from 'prop-types';
import VedtakFritekstPanel from '../VedtakFritekstPanel';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';

const InformasjonsbehovAutomatiskVedtaksbrev = ({
  intl,
  sprakkode,
  readOnly,
  vedtakVarsel,
  beregningErManueltFastsatt,
}) => {
  const tilgjengeligeInformasjonsbehov = {
    FRITEKST: 'VedtakForm.Fritekst',
    MANUELT_BEREGNINGSGRUNNLAG: 'VedtakForm.Fritekst.Beregningsgrunnlag',
  };

  const aktiverteInformasjonsbehov = [];

  if (beregningErManueltFastsatt) {
    aktiverteInformasjonsbehov.push(tilgjengeligeInformasjonsbehov.MANUELT_BEREGNINGSGRUNNLAG);
  }

  return (
    <>
      {aktiverteInformasjonsbehov.map(behov => (
        <VedtakFritekstPanel
          key={behov}
          intl={intl}
          readOnly={readOnly}
          sprakkode={sprakkode}
          labelTextCode={behov}
          vedtakVarsel={vedtakVarsel}
        />
      ))}
    </>
  );
};

InformasjonsbehovAutomatiskVedtaksbrev.propTypes = {
  intl: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  vedtakVarsel: vedtakVarselPropType,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
};

InformasjonsbehovAutomatiskVedtaksbrev.defaultProps = {};

export default InformasjonsbehovAutomatiskVedtaksbrev;
