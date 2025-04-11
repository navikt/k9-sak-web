import { prettifyDateString } from '@fpsak-frontend/utils';
import { PersonFillIcon, PersonIcon } from '@navikt/aksel-icons';
import { Bleed } from '@navikt/ds-react';
import { ContentWithTooltip, WarningIcon } from '@navikt/ft-plattform-komponenter';
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
    <div className={styles.ustrukturertDokumentElement}>
      <ContentWithTooltip tooltipText="Dokumentet må håndteres">
        <WarningIcon />
      </ContentWithTooltip>
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
