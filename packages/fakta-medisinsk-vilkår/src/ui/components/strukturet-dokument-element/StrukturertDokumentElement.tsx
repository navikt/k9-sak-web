import { prettifyDateString } from '@fpsak-frontend/utils';
import { CheckmarkCircleFillIcon, FilesFillIcon, PersonFillIcon, PersonIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';
import Dokument, { dokumentLabel } from '../../../types/Dokument';
import styles from './strukturertDokumentElement.module.css';

interface StrukturertDokumentElementProps {
  dokument: Dokument;
}

const StrukturertDokumentElement = ({
  dokument: { navn, datert, type, annenPartErKilde, duplikater },
}: StrukturertDokumentElementProps): JSX.Element => {
  const harDuplikater = duplikater?.length > 0;

  const getDokumenttype = () => {
    if (dokumentLabel[type]) {
      return dokumentLabel[type];
    }
    return navn;
  };

  const parterLabel = () => {
    if (annenPartErKilde) {
      return <PersonIcon fontSize="1.5rem" title="Annen part" />;
    }
    return <PersonFillIcon fontSize="1.5rem" title="Søker" />;
  };

  return (
    <div className={styles.strukturertDokumentElement}>
      <span className={styles.visuallyHidden}>Status</span>
      <CheckmarkCircleFillIcon
        title="Dokumentet er ferdig håndtert"
        fontSize={24}
        style={{ color: 'var(--a-surface-success)' }}
      />
      <div className={styles.strukturertDokumentElement__texts}>
        <p className={styles.strukturertDokumentElement__texts__type}>
          <span className={styles.visuallyHidden}>Type</span>
          {getDokumenttype()}
        </p>
        <span className={styles.strukturertDokumentElement__texts__date}>
          <span className={styles.visuallyHidden}>Datert</span>
          {prettifyDateString(datert)}
        </span>
        <span className={styles.strukturertDokumentElement__texts__part}>
          <span className={styles.visuallyHidden}>Part</span>
          {parterLabel()}
        </span>
        {harDuplikater && (
          <span className={styles.strukturertDokumentElement__texts__document}>
            <FilesFillIcon title="Det finnes ett eller flere duplikater av dette dokumentet" fontSize="1.5rem" />
          </span>
        )}
      </div>
    </div>
  );
};

export default StrukturertDokumentElement;
