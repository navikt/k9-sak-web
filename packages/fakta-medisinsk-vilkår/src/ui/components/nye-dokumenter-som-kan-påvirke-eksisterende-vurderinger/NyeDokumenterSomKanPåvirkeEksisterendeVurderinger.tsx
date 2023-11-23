import { Button, Label } from '@navikt/ds-react';
import { Box, DocumentIcon, Margin } from '@navikt/ft-plattform-komponenter';
import { prettifyDateString } from '@fpsak-frontend/utils';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import styles from './nyeDokumenterSomKanPåvirkeEksisterendeVurderinger.css';

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
              <DocumentIcon />
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
    <Box marginTop={Margin.large}>
      <div className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__content}>
        <Label size="small">Vurder om nytt dokument fører til endringer i eksisterende vurderinger.</Label>
        <NyeDokumenterListe dokumenter={dokumenter} />
        <Box marginTop={Margin.large}>
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
