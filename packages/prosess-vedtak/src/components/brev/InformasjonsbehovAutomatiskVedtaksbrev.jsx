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
  const aktiverteInformasjonsbehov =
    (informasjonsbehovVedtaksbrev?.informasjonsbehov || []).filter(({ type }) => type === 'FRITEKST') ?? [];

  const getLabel = behov => {
    const type = behov.kode.replace('_', ' ').toLowerCase();
    return `Fritekstbeskrivelse av ${type}`;
  };

  return (
    <>
      {aktiverteInformasjonsbehov.map(behov => (
        <VedtakFritekstPanel
          key={behov.kode}
          intl={intl}
          readOnly={readOnly}
          sprakkode={sprakkode}
          label={getLabel(behov)}
          begrunnelse={begrunnelse}
          begrunnelseFieldName={behov.kode}
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
  informasjonsbehovVedtaksbrev: PropTypes.shape({
    informasjonsbehov: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  }),
};

InformasjonsbehovAutomatiskVedtaksbrev.defaultProps = {
  begrunnelse: null,
  informasjonsbehovVedtaksbrev: null,
};

export default InformasjonsbehovAutomatiskVedtaksbrev;
