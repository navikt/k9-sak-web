import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import styles from './tidslinjeZoom.module.css';

const TidslinjeZoom = ({ handleZoomIn, handleZoomOut, disabledZoomIn, disabledZoomOut }) => {

  return (
    <div className={styles.skalavelgerContainer}>
      <button onClick={handleZoomIn} type="button" className={styles.zoomButton} disabled={disabledZoomIn}>
        <ZoomInIcon />
        <BodyShort size="small">{"Forstørre"}</BodyShort>
      </button>
      <button onClick={handleZoomOut} type="button" className={styles.zoomButton} disabled={disabledZoomOut}>
        <ZoomOutIcon />
        <BodyShort size="small">{"Forminske"}</BodyShort>
      </button>
    </div>
  );
};

export default TidslinjeZoom;
