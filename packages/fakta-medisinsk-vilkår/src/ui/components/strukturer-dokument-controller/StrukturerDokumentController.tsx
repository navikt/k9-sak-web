import { httpUtils } from '@fpsak-frontend/utils';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { Alert } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import FagsakYtelseType from '../../../constants/FagsakYtelseType';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import StrukturerDokumentSluttfaseForm from '../strukturer-dokument-sluttfase-form/StrukturerDokumentSluttfaseForm';
import StrukturerDokumentOpplaeringspengerForm from '../strukturer-dokument-opplaeringspenger-form/StrukturerDokumentOpplaeringspengerForm';
import { erFagsakOLPEllerPLS } from '../../../util/utils';

interface StrukturerDokumentControllerProps {
  strukturerDokumentLink: Link;
  dokument: Dokument;
  onDokumentStrukturert: () => void;
  editMode?: boolean;
  strukturerteDokumenter: Dokument[];
}

const StrukturerDokumentController = ({
  dokument,
  strukturerDokumentLink: { requestPayload, href },
  onDokumentStrukturert,
  editMode,
  strukturerteDokumenter,
}: StrukturerDokumentControllerProps): JSX.Element => {
  const { httpErrorHandler, fagsakYtelseType } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const controller = useMemo(() => new AbortController(), []);
  const [submitDocumentError, setSubmitDocumentError] = React.useState(null);

  React.useEffect(
    () => () => {
      controller.abort();
    },
    [],
  );

  const strukturerDokument = (strukturertDokument: Dokument) => {
    setIsSubmitting(true);
    setSubmitDocumentError(null);
    httpUtils
      .post(href, { ...requestPayload, ...strukturertDokument }, httpErrorHandler, {
        signal: controller.signal,
      })
      .then(
        () => {
          setIsSubmitting(false);
          onDokumentStrukturert();
          scrollUp();
        },
        error => {
          setSubmitDocumentError(error);
          setIsSubmitting(false);
          scrollUp();
        },
      );
  };

  const hasError = !!submitDocumentError;
  const getErrorMessage = () => {
    if (submitDocumentError?.response?.data?.feilkode) {
      const { feilkode } = submitDocumentError.response.data;
      if (feilkode === 'K9-6701') {
        return 'Kan ikke sette at et dokument er duplikat av et annet duplikat dokument.';
      }
      if (feilkode === 'K9-6702') {
        return 'Kan ikke sette duplikatdokumenter på tvers av pleietrengende.';
      }
      if (feilkode === 'K9-6703') {
        return 'Kan ikke sette som duplikat siden dokumentet har blitt brukt i en vurdering.';
      }
      if (feilkode === 'K9-6704') {
        return 'Kan ikke sette som duplikat siden andre dokumenter er duplikat av dette dokumentet.';
      }
    }
    return 'Noe gikk galt, vennligst prøv igjen senere';
  };

  return (
    <>
      {hasError && (
        <Box marginBottom={Margin.medium}>
          <Alert size="small" variant="error">
            {getErrorMessage()}
          </Alert>
        </Box>
      )}
      {!erFagsakOLPEllerPLS(fagsakYtelseType) && (
        <StrukturerDokumentForm
          key={dokument.id}
          dokument={dokument}
          onSubmit={strukturerDokument}
          editMode={editMode}
          isSubmitting={isSubmitting}
          strukturerteDokumenter={strukturerteDokumenter}
        />
      )}
      {fagsakYtelseType === FagsakYtelseType.PLEIEPENGER_SLUTTFASE && (
        <StrukturerDokumentSluttfaseForm
          key={dokument.id}
          dokument={dokument}
          onSubmit={strukturerDokument}
          editMode={editMode}
          isSubmitting={isSubmitting}
          strukturerteDokumenter={strukturerteDokumenter}
        />
      )}
      {fagsakYtelseType === FagsakYtelseType.OPPLÆRINGSPENGER && (
        <StrukturerDokumentOpplaeringspengerForm
          key={dokument.id}
          dokument={dokument}
          onSubmit={strukturerDokument}
          editMode={editMode}
          isSubmitting={isSubmitting}
          strukturerteDokumenter={strukturerteDokumenter}
        />
      )}

      {hasError && (
        <Box marginTop={Margin.medium}>
          <Alert size="small" variant="error">
            {getErrorMessage()}
          </Alert>
        </Box>
      )}
    </>
  );
};

export default StrukturerDokumentController;
