import React from 'react';
import PropTypes from 'prop-types';
import VedtakFritekstPanel from '../VedtakFritekstPanel';

const InformasjonsbehovAutomatiskVedtaksbrev = ({
  intl,
  sprakkode,
  readOnly,
  begrunnelse,
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
          begrunnelse={begrunnelse}
        />
      ))}
    </>
  );
};

InformasjonsbehovAutomatiskVedtaksbrev.propTypes = {
  intl: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.bool,
  beregningErManueltFastsatt: PropTypes.bool,
};

InformasjonsbehovAutomatiskVedtaksbrev.defaultProps = {
  begrunnelse: null,
  beregningErManueltFastsatt: false,
};

export default InformasjonsbehovAutomatiskVedtaksbrev;
