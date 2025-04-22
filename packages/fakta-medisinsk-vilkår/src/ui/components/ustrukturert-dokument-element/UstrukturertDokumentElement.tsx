import { prettifyDateString } from '@fpsak-frontend/utils';
import { ExclamationmarkTriangleFillIcon, PersonFillIcon, PersonIcon } from '@navikt/aksel-icons';
import { ContentWithTooltip } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
import { Dokument, dokumentLabel } from '../../../types/Dokument';
import styles from './ustrukturertDokumentElement.module.css';

interface UstrukturertDokumentElementProps {
  dokument: Dokument;
}

const UstrukturertDokumentElement = ({
  dokument: { datert, mottattDato, annenPartErKilde },
}: UstrukturertDokumentElementProps): JSX.Element => {
  const parterLabel = () => {
    if (annenPartErKilde) {
      return <PersonIcon fontSize="1.5rem" title="Annen part" />;
    }
    return <PersonFillIcon fontSize="1.5rem" title="Søker" />;
  };

  return (
    <div className={styles.ustrukturertDokumentElement}>
      <ExclamationmarkTriangleFillIcon
        title="Dokumentet må håndteres"
        fontSize="1.5rem"
        style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))' }}
      />

      <div className={styles.ustrukturertDokumentElement__texts}>
        <p className={styles.ustrukturertDokumentElement__texts__type} id="ikkeKlassifisertText">
          <span className={styles.visuallyHidden}>Type</span>
          {dokumentLabel.UKLASSIFISERT}
        </p>
        <span className={styles.ustrukturertDokumentElement__texts__date}>
          <span className={styles.visuallyHidden}>Datert</span>
          <ContentWithTooltip inline tooltipText="Dato dokumentet ble mottatt">
            {`${prettifyDateString(datert || mottattDato)}*`}
          </ContentWithTooltip>
        </span>
        <span className={styles.ustrukturertDokumentElement__texts__part}>
          <span className={styles.visuallyHidden}>Part</span>
          {parterLabel()}
        </span>
      </div>
    </div>
  );
};

export default UstrukturertDokumentElement;
