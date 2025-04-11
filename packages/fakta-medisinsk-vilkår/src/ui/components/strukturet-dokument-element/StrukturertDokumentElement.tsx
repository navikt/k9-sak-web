import { prettifyDateString } from '@fpsak-frontend/utils';
import { PersonFillIcon, PersonIcon } from '@navikt/aksel-icons';
import { Bleed } from '@navikt/ds-react';
import { ContentWithTooltip, DuplicateDocumentsIcon, GreenCheckIconFilled } from '@navikt/ft-plattform-komponenter';
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
      return (
        <Bleed marginBlock="2" marginInline="1">
          <PersonIcon fontSize="2rem" title="Annen part" />
        </Bleed>
      );
    }
    return (
      <Bleed marginBlock="2" marginInline="1">
        <PersonFillIcon fontSize="2rem" title="Søker" />
      </Bleed>
    );
  };

  return (
    <div className={styles.strukturertDokumentElement}>
      <span className={styles.visuallyHidden}>Status</span>
      <ContentWithTooltip tooltipText="Dokumentet er ferdig håndtert">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
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
            <ContentWithTooltip tooltipText="Det finnes ett eller flere duplikater av dette dokumentet">
              <DuplicateDocumentsIcon />
            </ContentWithTooltip>
          </span>
        )}
      </div>
    </div>
  );
};

export default StrukturertDokumentElement;
