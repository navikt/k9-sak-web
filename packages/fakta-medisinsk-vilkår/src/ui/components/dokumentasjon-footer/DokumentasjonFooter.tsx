import React, { type JSX } from 'react';
import styles from './dokumentasjonFooter.module.css';

interface DokumentasjonFooterProps {
  firstSectionRenderer?: () => React.ReactNode;
  secondSectionRenderer?: () => React.ReactNode;
  thirdSectionRenderer: () => React.ReactNode;
}

const DokumentasjonFooter = ({
  firstSectionRenderer,
  secondSectionRenderer,
  thirdSectionRenderer,
}: DokumentasjonFooterProps): JSX.Element => (
  <div className={styles.dokumentasjonFooter}>
    {firstSectionRenderer && <div className={styles.dokumentasjonFooter__firstSection}>{firstSectionRenderer()}</div>}
    {secondSectionRenderer && <div className={styles.dokumentasjonFooter__secondSection}>{secondSectionRenderer()}</div>}
    <div className={styles.dokumentasjonFooter__thirdSection}>{thirdSectionRenderer()}</div>
  </div>
);

export default DokumentasjonFooter;
