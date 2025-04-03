import { prettifyDateString } from '@fpsak-frontend/utils';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { Alert, Box, Button, Link } from '@navikt/ds-react';
import React, { type JSX } from 'react';

import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { dokumentLabel, Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import DokumentKnapp from '../dokument-knapp/DokumentKnapp';
import Duplikatliste from '../duplikatliste/Duplikatliste';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './strukturertDokumentDetaljer.module.css';

interface StrukturertDokumentDetaljerProps {
  dokument: Dokument;
  onEditDokumentClick: () => void;
  strukturerteDokumenter: Dokument[];
  onRemoveDuplikat: () => void;
}

const renderDokumenttypeLabel = (fagsakYtelseType: FagsakYtelsesType) => {
  if (fagsakYtelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return 'Inneholder dokumentet medisinske opplysninger eller dokumentasjon av opplæring?';
  }

  return 'Inneholder dokumentet medisinske opplysninger?';
};

const renderDokumenttypeContent = (dokumenttype: Dokumenttype, fagsakYtelseType: FagsakYtelsesType) => {
  if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
    return fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE ? (
      <span>Ja, dokumentet inneholder medisinske opplysninger</span>
    ) : (
      <span>Ja, legeerklæring fra sykehus/spesialisthelsetjenesten</span>
    );
  }
  if (dokumenttype === Dokumenttype.LEGEERKLÆRING_MED_DOKUMENTASJON_AV_OPPLÆRING) {
    return <span>Ja, både legeerklæring og dokumentasjon av opplæring</span>;
  }
  if (dokumenttype === Dokumenttype.EPIKRISE) {
    return <span>Ja, epikrise</span>;
  }
  if (dokumenttype === Dokumenttype.LEGEERKLÆRING_ANNEN) {
    return <span>Ja, legeerklæring fra lege eller helseinstitusjon</span>;
  }
  if (dokumenttype === Dokumenttype.DOKUMENTASJON_AV_OPPLÆRING) {
    return <span>Ja, dokumentasjon av opplæring</span>;
  }
  if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
    return <span>Ja, andre medisinske opplysninger (f.eks. legeerklæring fra fastlege, uttalelse fra psykolog)</span>;
  }
  if (dokumenttype === Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER) {
    if (fagsakYtelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
      return <span>Nei, dokumentet inneholder ikke medisinske opplysninger eller dokumentasjon av opplæring</span>;
    }
    return <span>Dokumentet inneholder ikke medisinske opplysninger</span>;
  }
  return null;
};

const StrukturertDokumentDetaljer = ({
  dokument,
  onEditDokumentClick,
  strukturerteDokumenter,
  onRemoveDuplikat,
}: StrukturertDokumentDetaljerProps): JSX.Element => {
  const { fagsakYtelseType } = React.useContext(ContainerContext);
  const { type, datert, links, duplikater, duplikatAvId } = dokument;
  const harDuplikater = duplikater?.length > 0;
  const dokumentinnholdLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);
  const getDokumentDuplikater = () =>
    strukturerteDokumenter.filter(strukturertDokument => strukturertDokument.duplikatAvId === dokument.id);

  const getOriginaltDokument = () => {
    const originaltDokument = strukturerteDokumenter.find(
      strukturertDokument => strukturertDokument.id === duplikatAvId,
    );
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, originaltDokument.links);

    return (
      <Link href={dokumentLink.href} target="_blank">
        {`${dokumentLabel[originaltDokument.type]} - ${prettifyDateString(originaltDokument.datert)}`}
      </Link>
    );
  };

  return (
    <DetailView
      title="Om dokumentet"
      contentAfterTitleRenderer={() => (
        <WriteAccessBoundContent
          contentRenderer={() => (
            <Button variant="tertiary" size="xsmall" className={styles.endreLink} onClick={onEditDokumentClick}>
              Endre dokument
            </Button>
          )}
        />
      )}
    >
      {harDuplikater && (
        <Box marginBlock="6 0">
          <Alert size="small" variant="info">
            Det finnes ett eller flere duplikater av dette dokumentet.
          </Alert>
        </Box>
      )}
      {duplikatAvId && (
        <Box marginBlock="6 0">
          <Alert size="small" variant="info">
            Dokumentet er et duplikat.
          </Alert>
        </Box>
      )}
      <Box marginBlock="8 0">
        <DokumentKnapp href={dokumentinnholdLink.href} />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label={renderDokumenttypeLabel(fagsakYtelseType)}
          content={renderDokumenttypeContent(type, fagsakYtelseType)}
        />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent label="Når er dokumentet datert?" content={prettifyDateString(datert)} />
      </Box>
      {harDuplikater && (
        <Box marginBlock="8 0">
          <LabelledContent
            label="Duplikater av dette dokumentet:"
            content={<Duplikatliste dokumenter={getDokumentDuplikater()} onRemoveDuplikat={onRemoveDuplikat} />}
          />
        </Box>
      )}
      {duplikatAvId && (
        <Box marginBlock="8 0">
          <LabelledContent label="Dokumentet er et duplikat av følgende dokument:" content={getOriginaltDokument()} />
        </Box>
      )}
    </DetailView>
  );
};

export default StrukturertDokumentDetaljer;
