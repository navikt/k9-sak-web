import { prettifyDateString } from '@k9-sak-web/utils';
import { Link } from '@navikt/ds-react';
import { BucketIcon } from '@navikt/ft-plattform-komponenter';
import React, { useState } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { dokumentLabel } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import SlettDuplikatModal from '../slett-duplikat-modal/SlettDuplikatModal';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './duplikatliste.module.css';

interface DuplikatlisteProps {
  dokumenter: Dokument[];
  onRemoveDuplikat: () => void;
}

const Duplikatliste = ({ dokumenter, onRemoveDuplikat }: DuplikatlisteProps): JSX.Element => {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  return (
    <>
      <ul className={styles.dokumentliste}>
        {dokumenter.map(dokument => {
          const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);
          return (
            <li key={dokument.id} className={styles.dokumentliste__element}>
              <Link href={dokumentLink.href} className={styles.dokumentliste__beskrivelse} target="_blank">
                {`${dokumentLabel[dokument.type]} - ${prettifyDateString(dokument.datert)}`}
              </Link>
              <WriteAccessBoundContent
                contentRenderer={() => (
                  <button
                    className={styles.dokumentliste__deleteButton}
                    type="button"
                    onClick={() => {
                      setModalIsOpen(true);
                      setSelectedDocument(dokument);
                    }}
                  >
                    <BucketIcon />
                    <p className={styles.dokumentliste__deleteButtonText}>Angre gjør til duplikat</p>
                  </button>
                )}
              />
            </li>
          );
        })}
      </ul>
      {isModalOpen && (
        <SlettDuplikatModal
          onRemove={() => {
            setModalIsOpen(false);
            onRemoveDuplikat();
          }}
          handleCloseModal={() => setModalIsOpen(false)}
          selectedDocument={selectedDocument}
        />
      )}
    </>
  );
};
export default Duplikatliste;
