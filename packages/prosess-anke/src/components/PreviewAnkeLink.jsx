import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ankeVurderingType from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import styles from './previewAnkeLink.module.css';

const getBrevKode = ankeVurdering => {
  switch (ankeVurdering) {
    case ankeVurderingType.ANKE_OMGJOER:
      return dokumentMalType.ANKE_VEDTAK_OMGJORING;
    case ankeVurderingType.ANKE_OPPHEVE_OG_HJEMSENDE:
      return dokumentMalType.ANKE_BESLUTNING_OM_OPPHEVING;
    default:
      return dokumentMalType.UTLED;
  }
};

const getBrevData = (ankeVurdering, aksjonspunktCode, fritekstTilBrev) => ({
  dokumentdata: fritekstTilBrev && { fritekst: fritekstTilBrev },
  dokumentMal: getBrevKode(ankeVurdering),
});

const PreviewAnkeLink = ({
  previewCallback,
  fritekstTilBrev = null,
  ankeVurdering = null,
  aksjonspunktCode,
  readOnly = false,
}) => {
  const previewMessage = e => {
    e.preventDefault();
    previewCallback(getBrevData(ankeVurdering, aksjonspunktCode, fritekstTilBrev));
  };
  if (readOnly) {
    return (
      <span className={classNames(styles.previewLinkDisabled)}>
        <FormattedMessage id="PreviewAnkeLink.ForhandvisBrev" />
      </span>
    );
  }
  return (
    <a
      href=""
      onClick={e => {
        previewMessage(e);
      }}
      onKeyDown={e => (e.keyCode === 13 ? previewMessage(e) : null)}
      className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
    >
      <FormattedMessage id="PreviewAnkeLink.ForhandvisBrev" />
    </a>
  );
};

PreviewAnkeLink.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  fritekstTilBrev: PropTypes.string,
  ankeVurdering: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default PreviewAnkeLink;
