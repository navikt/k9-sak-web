import { Period } from '@fpsak-frontend/utils';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import { assertDefined } from '@k9-sak-web/gui/utils/validation/assertDefined.js';
import { Alert, Box, Button, Heading, HStack, Loader } from '@navikt/ds-react';
import { k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseDto } from '@navikt/k9-sak-typescript-client/types';
import React, { use, useEffect, useMemo, type JSX } from 'react';
import { MedisinskVilkårApiContext } from '../../../api/MedisinskVilkårApiContext';
import { InnleggelsesperiodeResponse } from '../../../types/InnleggelsesperiodeResponse';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import InnleggelsesperiodeFormModal, { FieldName } from '../innleggelsesperiodeFormModal/InnleggelsesperiodeFormModal';
import Innleggelsesperiodeliste from '../innleggelsesperiodeliste/Innleggelsesperiodeliste';
import styles from './innleggelsesperiodeoversikt.module.css';

interface InnleggelsesperiodeoversiktProps {
  onInnleggelsesperioderUpdated: () => void;
}

const Innleggelsesperiodeoversikt = ({
  onInnleggelsesperioderUpdated,
}: InnleggelsesperiodeoversiktProps): JSX.Element => {
  const { pleietrengendePart, readOnly, behandlingUuid } = React.useContext(ContainerContext);
  const api = assertDefined(use(MedisinskVilkårApiContext));
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [innleggelsesperioderResponse, setInnleggelsesperioderResponse] = React.useState<InnleggelsesperiodeResponse>({
    perioder: [],
    links: [],
    versjon: '',
    behandlingUuid: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [hentInnleggelsesperioderFeilet, setHentInnleggelsesperioderFeilet] = React.useState(false);
  const [lagreInnleggelsesperioderFeilet, setLagreInnleggelsesperioderFeilet] = React.useState(false);
  const controller = useMemo(() => new AbortController(), []);

  const innleggelsesperioder = innleggelsesperioderResponse.perioder ?? [];
  const innleggelsesperioderDefault =
    innleggelsesperioder && innleggelsesperioder?.length > 0 ? innleggelsesperioder : [new Period('', '')];

  const hentInnleggelsesperioder = () => api.hentSykdomInnleggelse(behandlingUuid);

  const initializeInnleggelsesperiodeData = (response: k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseDto) => ({
    ...response,
    perioder: response.perioder?.map(({ fom, tom }) => new Period(fom, tom)),
  });

  const updateInnleggelsesperioder = async () => {
    try {
      setIsLoading(true);
      const response = await hentInnleggelsesperioder();
      setInnleggelsesperioderResponse(initializeInnleggelsesperiodeData(response));
    } catch {
      setHentInnleggelsesperioderFeilet(true);
    } finally {
      setIsLoading(false);
    }
  };

  const lagreInnleggelsesperioder = async formState => {
    setIsLoading(true);
    let nyeInnleggelsesperioder = [];
    if (formState.innleggelsesperioder?.length > 0) {
      nyeInnleggelsesperioder = formState.innleggelsesperioder
        .filter(periodeWrapper => periodeWrapper.period?.fom && periodeWrapper.period?.tom)
        .map(periodeWrapper => new Period(periodeWrapper.period.fom, periodeWrapper.period.tom));
    }

    try {
      await api.oppdaterSykdomInnleggelse({
        behandlingUuid,
        perioder: nyeInnleggelsesperioder,
      });
      onInnleggelsesperioderUpdated();
      await updateInnleggelsesperioder();
    } catch {
      setLagreInnleggelsesperioderFeilet(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    hentInnleggelsesperioder()
      .then((response: InnleggelsesperiodeResponse) => {
        if (isMounted) {
          setInnleggelsesperioderResponse(initializeInnleggelsesperiodeData(response));
          setIsLoading(false);
        }
      })
      .catch(() => {
        setHentInnleggelsesperioderFeilet(true);
      });
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  if (hentInnleggelsesperioderFeilet || lagreInnleggelsesperioderFeilet) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  return (
    <div className={styles.innleggelsesperiodeoversikt}>
      <HStack justify="space-between" align="end">
        <Heading size="small" level="2">
          Innleggelsesperioder
        </Heading>
        <WriteAccessBoundContent
          otherRequirementsAreMet={innleggelsesperioder.length > 0}
          contentRenderer={() => (
            <Button
              variant="tertiary"
              size="xsmall"
              className={styles.innleggelsesperiodeoversikt__redigerListeKnapp}
              onClick={() => setModalIsOpen(true)}
            >
              Rediger liste
            </Button>
          )}
          readOnly={readOnly}
        />
        <WriteAccessBoundContent
          otherRequirementsAreMet={innleggelsesperioder.length === 0}
          contentRenderer={() => (
            <AddButton label="Legg til periode" onClick={() => setModalIsOpen(true)} id="leggTilPeriodeKnapp" />
          )}
          readOnly={readOnly}
        />
      </HStack>
      <hr style={{ color: '#B7B1A9' }} />
      {isLoading ? (
        <Loader size="large" />
      ) : (
        <Box.New marginBlock="6 0">
          {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
          {innleggelsesperioder.length > 0 && (
            <Box.New marginBlock="2 0">
              <Innleggelsesperiodeliste innleggelsesperioder={innleggelsesperioder} />
            </Box.New>
          )}
        </Box.New>
      )}
      {modalIsOpen && (
        <InnleggelsesperiodeFormModal
          defaultValues={{
            [FieldName.INNLEGGELSESPERIODER]: innleggelsesperioderDefault,
          }}
          setModalIsOpen={setModalIsOpen}
          onSubmit={lagreInnleggelsesperioder}
          isLoading={isLoading}
          pleietrengendePart={pleietrengendePart}
          endringerPåvirkerAndreBehandlinger={nyeInnleggelsesperioder => {
            return api.oppdaterSykdomInnleggelse({
              behandlingUuid,
              perioder: nyeInnleggelsesperioder,
              dryRun: true,
            });
          }}
        />
      )}
    </div>
  );
};

export default Innleggelsesperiodeoversikt;
