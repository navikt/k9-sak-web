import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import styles from './tidslinjeZoom.module.css';

const TidslinjeZoom = ({ handleZoomIn, handleZoomOut, disabledZoomIn, disabledZoomOut }) => {
  const intl = useIntl();
  return (
    <div className={styles.skalavelgerContainer}>
      <button onClick={handleZoomIn} type="button" className={styles.zoomButton} disabled={disabledZoomIn}>
        <ZoomInIcon />
        <BodyShort size="small">{intl.formatMessage({ id: 'TidslinjeZoom.Forstørre' })}</BodyShort>
      </button>
      <button onClick={handleZoomOut} type="button" className={styles.zoomButton} disabled={disabledZoomOut}>
        <ZoomOutIcon />
        <BodyShort size="small">{intl.formatMessage({ id: 'TidslinjeZoom.Forminske' })}</BodyShort>
      </button>
    </div>
  );
};

export default TidslinjeZoom;
