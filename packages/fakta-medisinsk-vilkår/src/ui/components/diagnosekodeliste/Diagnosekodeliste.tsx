import React from 'react';
import Diagnosekode from '../../../types/Diagnosekode';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './diagnosekodeliste.module.css';

interface DiagnosekodelisteProps {
  diagnosekoder: Diagnosekode[];
  onDeleteClick: (diagnosekode: string) => void;
}

const Diagnosekodeliste = ({ diagnosekoder, onDeleteClick }: DiagnosekodelisteProps): JSX.Element => (
  <ul className={styles.diagnosekodeliste}>
    {diagnosekoder.map(diagnosekode => {
      const diagnosekodeBeskrivelse = diagnosekode?.beskrivelse
        ? `${diagnosekode.kode} - ${diagnosekode.beskrivelse}`
        : diagnosekode?.kode;

      return (
        <li key={`${diagnosekode.kode}`} className={styles.diagnosekodeliste__element}>
          <p className={styles.beskrivelse}>{diagnosekodeBeskrivelse}</p>
          <WriteAccessBoundContent
            contentRenderer={() => (
              <div className={styles.lenkeContainer}>
                <button
                  type="button"
                  className={`${styles.lenkeContainer__slettLenke} navds-link`}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteClick(diagnosekode.kode);
                  }}
                >
                  Slett
                </button>
              </div>
            )}
          />
        </li>
      );
    })}
  </ul>
);

export default Diagnosekodeliste;
