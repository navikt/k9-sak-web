import React from 'react';
import PropTypes from 'prop-types';
import VedtakFritekstPanel from '../VedtakFritekstPanel';

const InformasjonsbehovAutomatiskVedtaksbrev = ({
  intl,
  sprakkode,
  readOnly,
  begrunnelse,
  informasjonsbehovVedtaksbrev,
}) => {
  const aktiverteInformasjonsbehov = (informasjonsbehovVedtaksbrev?.informasjonsbehov || []).filter(
    ({ type }) => type === 'FRITEKST',
  );

  return (
    <>
      {aktiverteInformasjonsbehov.map(behov => (
        <VedtakFritekstPanel
          key={behov.kode}
          intl={intl}
          readOnly={readOnly}
          sprakkode={sprakkode}
          labelTextCode={behov.kode}
          begrunnelse={begrunnelse}
          begrunnelseFieldName={`${behov.kode}.begrunnelse`}
        />
      ))}
    </>
  );
};

InformasjonsbehovAutomatiskVedtaksbrev.propTypes = {
  intl: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
  informasjonsbehovVedtaksbrev: PropTypes.shape(),
};

InformasjonsbehovAutomatiskVedtaksbrev.defaultProps = {
  begrunnelse: null,
};

export default InformasjonsbehovAutomatiskVedtaksbrev;
