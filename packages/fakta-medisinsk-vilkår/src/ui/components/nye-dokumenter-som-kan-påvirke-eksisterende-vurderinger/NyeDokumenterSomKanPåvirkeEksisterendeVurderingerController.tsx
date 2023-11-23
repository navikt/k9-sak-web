import React, { useMemo } from 'react';
import { Box, Margin, PageContainer } from '@navikt/ft-plattform-komponenter';
import { post } from '@fpsak-frontend/utils';
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
    post(endpoints.nyeDokumenter, createRegistrerNyeDokumenterRequestPayload(), httpErrorHandler, {
      signal: controller.signal,
    });

  const onEndringerRegistrertClick = async () => {
    setIsSubmitting(true);
    setHttpErrorHasOccured(false);
    try {
      await bekreftAtEndringerErRegistrert();
      afterEndringerRegistrert();
      setIsSubmitting(false);
    } catch (error) {
      setHttpErrorHasOccured(true);
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer hasError={httpErrorHasOccured}>
      <Box marginTop={Margin.large} marginBottom={Margin.large}>
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
