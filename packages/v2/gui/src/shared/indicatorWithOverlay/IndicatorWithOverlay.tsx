import React from 'react';
import styles from './indicatorWithOverlay.module.css';

interface IndicatorWithOverlayProps {
  indicatorRenderer: () => React.ReactNode;
  overlayRenderer: () => React.ReactNode;
}

export const OverlayedIcons = ({ indicatorRenderer, overlayRenderer }: IndicatorWithOverlayProps) => (
  <div className={styles.indicatorWithOverlay}>
    <div className={styles.overlay}>{overlayRenderer()}</div>
    <div className={styles.indicator}>{indicatorRenderer()}</div>
  </div>
);
