import { httpUtils } from '@fpsak-frontend/utils';
import { Box } from '@navikt/ds-react';
import { PageContainer } from '@navikt/ft-plattform-komponenter';
import React, { useMemo, type JSX } from 'react';
import Dokument from '../../../types/Dokument';
import ContainerContext from '../../context/ContainerContext';
import NyeDokumenterSomKanPåvirkeEksisterendeVurderinger from './NyeDokumenterSomKanPåvirkeEksisterendeVurderinger';

interface NyeDokumenterSomKanPåvirkeEksisterendeVurderingerControllerProps {
  dokumenter: Dokument[];
  afterEndringerRegistrert: () => void;
}

const NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController = ({
  dokumenter,
  afterEndringerRegistrert,
}: NyeDokumenterSomKanPåvirkeEksisterendeVurderingerControllerProps): JSX.Element => {
  const { endpoints, httpErrorHandler, behandlingUuid } = React.useContext(ContainerContext);
  const controller = useMemo(() => new AbortController(), []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [httpErrorHasOccured, setHttpErrorHasOccured] = React.useState(false);

  const createRegistrerNyeDokumenterRequestPayload = () => ({
    behandlingUuid,
    dokumenterSomSkalUtkvitteres: dokumenter.map(({ id }) => id),
  });

  const bekreftAtEndringerErRegistrert = () =>
    httpUtils.post(endpoints.nyeDokumenter, createRegistrerNyeDokumenterRequestPayload(), httpErrorHandler, {
      signal: controller.signal,
    });

  const onEndringerRegistrertClick = async () => {
    setIsSubmitting(true);
    setHttpErrorHasOccured(false);
    try {
      await bekreftAtEndringerErRegistrert();
      afterEndringerRegistrert();
      setIsSubmitting(false);
    } catch {
      setHttpErrorHasOccured(true);
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer hasError={httpErrorHasOccured}>
      <Box marginBlock="6 6">
        <NyeDokumenterSomKanPåvirkeEksisterendeVurderinger
          dokumenter={dokumenter}
          onEndringerRegistrertClick={onEndringerRegistrertClick}
          isSubmitting={isSubmitting}
        />
      </Box>
    </PageContainer>
  );
};

export default NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController;
