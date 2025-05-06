import { prettifyDateString } from '@fpsak-frontend/utils';
import { FileIcon } from '@navikt/aksel-icons';
import { Box, Button, Label } from '@navikt/ds-react';
import { type JSX } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import styles from './nyeDokumenterSomKanPåvirkeEksisterendeVurderinger.module.css';

interface NyeDokumenterListeProps {
  dokumenter: Dokument[];
}

const getDokumentLabel = (type: Dokumenttype) => {
  if (type === Dokumenttype.LEGEERKLÆRING) {
    return 'Legeerklæring';
  }
  if (type === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
    return 'Andre medisinske opplysninger';
  }
  if (type === Dokumenttype.EPIKRISE) {
    return 'Epikrise';
  }
  return null;
};

const NyeDokumenterListe = ({ dokumenter }: NyeDokumenterListeProps) => (
  <>
    {dokumenter.map(dokument => {
      const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);
      return (
        <p key={dokument.id}>
          Nytt dokument:
          <a
            href={dokumentLink.href}
            className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__dokumentLink}
          >
            <span className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__ikonContainer}>
              <FileIcon fontSize="1.5rem" />
            </span>
            {`${getDokumentLabel(dokument.type)} (datert ${prettifyDateString(dokument.datert)})`}
          </a>
        </p>
      );
    })}
  </>
);

interface NyeDokumenterSomKanPåvirkeEksisterendeVurderingerProps {
  dokumenter: Dokument[];
  onEndringerRegistrertClick: () => void;
  isSubmitting: boolean;
}

const NyeDokumenterSomKanPåvirkeEksisterendeVurderinger = ({
  dokumenter,
  onEndringerRegistrertClick,
  isSubmitting,
}: NyeDokumenterSomKanPåvirkeEksisterendeVurderingerProps): JSX.Element => (
  <div className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger}>
    <Box marginBlock="6 0">
      <div className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__content}>
        <Label size="small">Vurder om nytt dokument fører til endringer i eksisterende vurderinger.</Label>
        <NyeDokumenterListe dokumenter={dokumenter} />
        <Box marginBlock="6 0">
          <Button
            size="small"
            onClick={() => onEndringerRegistrertClick()}
            disabled={isSubmitting}
            loading={isSubmitting}
            id="bekreftNyeDokumenterVurdertKnapp"
          >
            Eventuelle endringer er registrert
          </Button>
        </Box>
      </div>
    </Box>
  </div>
);

export default NyeDokumenterSomKanPåvirkeEksisterendeVurderinger;
