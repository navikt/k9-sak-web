import { httpUtils } from '@fpsak-frontend/utils';

import { initDiagnosekodeSearcher } from '@k9-sak-web/gui/shared/diagnosekodeVelger/diagnosekodeSearcher.js';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import { Alert, Box, Heading, HStack, Loader } from '@navikt/ds-react';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import React, { type JSX } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Diagnosekode from '../../../types/Diagnosekode';
import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';
import { findLinkByRel } from '../../../util/linkUtils';
import { toLegacyDiagnosekode } from '../../../util/toLegacyDiagnosekode.js';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import DiagnosekodeModal from '../diagnosekode-modal/DiagnosekodeModal';
import Diagnosekodeliste from '../diagnosekodeliste/Diagnosekodeliste';

// initialize diagnosekode searcher instance, with pagesize 8, so that it can be used both here and in the DiagnosekodeModal.
// This reuse is possible since we don't use the paging functionality in the instance anyways.
const diagnosekodeSearcher = initDiagnosekodeSearcher(8);

const fetchDiagnosekoderByQuery = async (queryString: string): Promise<Diagnosekode> => {
  const searchResult = diagnosekodeSearcher.search(queryString, 1);
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
  const { endpoints, httpErrorHandler, readOnly } = React.useContext(ContainerContext);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(undefined);

  const hentDiagnosekoder = () =>
    httpUtils
      .get<DiagnosekodeResponse>(endpoints.diagnosekoder, httpErrorHandler)
      .then((response: DiagnosekodeResponse) => response);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['diagnosekodeResponse'],
    queryFn: hentDiagnosekoder,
    placeholderData: { diagnosekoder: [], links: [], behandlingUuid: '', versjon: null },
    staleTime: 10000,
  });

  const { diagnosekoder, links, behandlingUuid, versjon } = data;
  const endreDiagnosekoderLink = findLinkByRel(LinkRel.ENDRE_DIAGNOSEKODER, links);

  const { diagnosekodeObjekter, diagnosekodeObjekterLaster } = useQueries({
    queries: diagnosekoder.map(diagnosekode => ({
      queryKey: ['diagnosekode', diagnosekode],
      queryFn: () => fetchDiagnosekoderByQuery(diagnosekode),
      refetchOnWindowFocus: false,
    })),
    combine: results => {
      return {
        diagnosekodeObjekter: results.map(r => r.data).filter(d => d != null),
        diagnosekodeObjekterLaster: results.some(r => r.isPending),
      };
    },
  });

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

  const slettDiagnosekodeMutation = useMutation({
    mutationFn: (diagnosekode: string) => slettDiagnosekode(diagnosekode),

    onSuccess: async () => {
      await refetch().finally(() => {
        onDiagnosekoderUpdated();
        focusAddButton();
      });
    },
  });
  const lagreDiagnosekodeMutation = useMutation({
    mutationFn: (nyeDiagnosekoder: string[]) => lagreDiagnosekode(nyeDiagnosekoder),

    onSuccess: async () => {
      await refetch().finally(() => {
        onDiagnosekoderUpdated();
        setModalIsOpen(false);
        focusAddButton();
      });
    },
  });

  return (
    <div>
      <HStack justify="space-between" align="end">
        <Heading size="small" level="2">
          Diagnosekoder
        </Heading>
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
          readOnly={readOnly}
        />
      </HStack>
      <hr style={{ color: '#B7B1A9' }} />
      {isLoading ? (
        <Loader size="large" />
      ) : (
        <Box marginBlock="4 0">
          {diagnosekoder.length === 0 && (
            <Alert inline variant="warning">
              Ingen diagnosekode registrert.
            </Alert>
          )}
          {diagnosekoder.length >= 1 && !diagnosekodeObjekterLaster && (
            <Diagnosekodeliste diagnosekoder={diagnosekodeObjekter} onDeleteClick={slettDiagnosekodeMutation.mutate} />
          )}
        </Box>
      )}
      <DiagnosekodeModal
        isOpen={modalIsOpen}
        onSaveClick={lagreDiagnosekodeMutation.mutateAsync}
        onRequestClose={() => setModalIsOpen(false)}
        searcher={diagnosekodeSearcher}
      />
    </div>
  );
};

export default Diagnosekodeoversikt;
