import { httpUtils } from '@fpsak-frontend/utils';
import { Box, Margin, TitleWithUnderline } from '@navikt/ft-plattform-komponenter';

import { Alert, Loader } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useMutation, useQueries, useQuery } from 'react-query';
import LinkRel from '../../../constants/LinkRel';
import Diagnosekode from '../../../types/Diagnosekode';
import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';
import initDiagnosekodeSearcher, { toLegacyDiagnosekode } from '../../../util/diagnosekodeSearcher';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import DiagnosekodeModal from '../diagnosekode-modal/DiagnosekodeModal';
import Diagnosekodeliste from '../diagnosekodeliste/Diagnosekodeliste';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';

// Start initializing diagnosekode searcher instance, with pagesize 8, so that it can be used both here and in the DiagnosekodeModal.
// This reuse is possible since we don't use the paging functionality in the instance anyways.
const diagnosekodeSearcherPromise = initDiagnosekodeSearcher(8);

const fetchDiagnosekoderByQuery = async (queryString: string): Promise<Diagnosekode> => {
  const searcher = await diagnosekodeSearcherPromise;
  const searchResult = searcher.search(queryString, 1);
  // This function only returns the found diagnosecode if there is exactly one diagnosecode found.
  if (searchResult.diagnosekoder.length === 1 && !searchResult.hasMore) {
    return toLegacyDiagnosekode(searchResult.diagnosekoder[0]);
  }
  return { kode: queryString, beskrivelse: '' };
};

interface DiagnosekodeoversiktProps {
  onDiagnosekoderUpdated: () => void;
}

const Diagnosekodeoversikt = ({ onDiagnosekoderUpdated }: DiagnosekodeoversiktProps): JSX.Element => {
  const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>();

  const hentDiagnosekoder = () =>
    httpUtils
      .get<DiagnosekodeResponse>(endpoints.diagnosekoder, httpErrorHandler)
      .then((response: DiagnosekodeResponse) => response);

  const { isLoading, data, refetch } = useQuery('diagnosekodeResponse', hentDiagnosekoder);

  const { diagnosekoder, links, behandlingUuid, versjon } = data;
  const endreDiagnosekoderLink = findLinkByRel(LinkRel.ENDRE_DIAGNOSEKODER, links);

  const diagnosekoderMedNavnResponses = useQueries(
    diagnosekoder.map(diagnosekode => ({
      queryKey: ['diagnosekode', diagnosekode],
      queryFn: () => fetchDiagnosekoderByQuery(diagnosekode),
      refetchOnWindowFocus: false,
    })),
  );

  const diagnosekoderMedNavn = useMemo(
    () => diagnosekoderMedNavnResponses.filter(response => !!response.data).map(response => response.data),
    [diagnosekoderMedNavnResponses],
  );

  const focusAddButton = () => {
    if (addButtonRef.current) {
      addButtonRef.current.focus();
    }
  };

  const slettDiagnosekode = (diagnosekode: string) =>
    httpUtils.post(
      endreDiagnosekoderLink.href,
      {
        behandlingUuid,
        versjon,
        diagnosekoder: diagnosekoder.filter(kode => kode !== diagnosekode),
      },
      httpErrorHandler,
    );

  const lagreDiagnosekode = (nyeDiagnosekoder: string[]) =>
    httpUtils.post(
      endreDiagnosekoderLink.href,
      {
        behandlingUuid,
        versjon,
        diagnosekoder: [...new Set([...diagnosekoder, ...nyeDiagnosekoder])],
      },
      httpErrorHandler,
    );

  const slettDiagnosekodeMutation = useMutation((diagnosekode: string) => slettDiagnosekode(diagnosekode), {
    onSuccess: () => {
      refetch().finally(() => {
        onDiagnosekoderUpdated();
        focusAddButton();
      });
    },
  });
  const lagreDiagnosekodeMutation = useMutation((nyeDiagnosekoder: string[]) => lagreDiagnosekode(nyeDiagnosekoder), {
    onSuccess: () => {
      refetch().finally(() => {
        onDiagnosekoderUpdated();
        setModalIsOpen(false);
        focusAddButton();
      });
    },
  });

  return (
    <div>
      <TitleWithUnderline
        contentAfterTitleRenderer={() => (
          <WriteAccessBoundContent
            contentRenderer={() => (
              <AddButton
                id="leggTilDiagnosekodeKnapp"
                label="Ny diagnosekode"
                onClick={() => setModalIsOpen(true)}
                ariaLabel="Legg til diagnosekode"
                ref={addButtonRef}
              />
            )}
          />
        )}
      >
        Diagnosekoder
      </TitleWithUnderline>
      {isLoading ? (
        <Loader size="large" />
      ) : (
        <Box marginTop={Margin.medium}>
          {diagnosekoder.length === 0 && (
            <Alert inline variant="warning">
              Ingen diagnosekode registrert.
            </Alert>
          )}
          {diagnosekoder.length >= 1 && (
            <Diagnosekodeliste diagnosekoder={diagnosekoderMedNavn} onDeleteClick={slettDiagnosekodeMutation.mutate} />
          )}
        </Box>
      )}
      <DiagnosekodeModal
        isOpen={modalIsOpen}
        onSaveClick={lagreDiagnosekodeMutation.mutateAsync}
        onRequestClose={() => setModalIsOpen(false)}
        searcherPromise={diagnosekodeSearcherPromise}
      />
    </div>
  );
};

export default Diagnosekodeoversikt;
