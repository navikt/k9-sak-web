import { httpUtils, Period } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import useRefetchBehandlingVedSykdomsendring from '../../hooks/useRefetchBehandlingVedSykdomsendring';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import { Alert, Box, Button, Heading, HStack, Loader } from '@navikt/ds-react';
import React, { useEffect, useMemo, type JSX } from 'react';
import { postInnleggelsesperioder, postInnleggelsesperioderDryRun } from '../../../api/api';
import LinkRel from '../../../constants/LinkRel';
import { InnleggelsesperiodeResponse } from '../../../types/InnleggelsesperiodeResponse';
import { findLinkByRel } from '../../../util/linkUtils';
import {
  finnHullIPerioder,
  finnMaksavgrensningerForPerioder,
  slåSammenSammenhengendePerioder,
} from '../../../util/periodUtils';
import { InnleggelsesperiodeBegrensning } from '../../../types/InnleggelsesperiodeBegrensning';
import { PerioderMedVilkarResponse } from '../../../types/PerioderMedVilkarResponse';
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
  const { endpoints, httpErrorHandler, pleietrengendePart, readOnly, fagsakYtelseType } =
    React.useContext(ContainerContext);
  const refetchBehandlingVedSykdomsendring = useRefetchBehandlingVedSykdomsendring();

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [innleggelsesperiodeBegrensning, setInnleggelsesperiodeBegrensning] =
    React.useState<InnleggelsesperiodeBegrensning | null>(null);
  const [innleggelsesperioderResponse, setInnleggelsesperioderResponse] = React.useState<InnleggelsesperiodeResponse>({
    perioder: [],
    links: [],
    versjon: null,
    behandlingUuid: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [hentInnleggelsesperioderFeilet, setHentInnleggelsesperioderFeilet] = React.useState(false);
  const [lagreInnleggelsesperioderFeilet, setLagreInnleggelsesperioderFeilet] = React.useState(false);
  const controller = useMemo(() => new AbortController(), []);

  const innleggelsesperioder = innleggelsesperioderResponse.perioder;
  const innleggelsesperioderDefault = innleggelsesperioder?.length > 0 ? innleggelsesperioder : [new Period('', '')];

  const hentInnleggelsesperioder = () =>
    httpUtils.get(`${endpoints.innleggelsesperioder}`, httpErrorHandler, {
      signal: controller.signal,
    });

  const initializeInnleggelsesperiodeData = (response: InnleggelsesperiodeResponse) => ({
    ...response,
    perioder: response.perioder.map(({ fom, tom }) => new Period(fom, tom)),
  });

  const updateInnlegelsesperioder = () => {
    setIsLoading(true);
    hentInnleggelsesperioder()
      .then((response: InnleggelsesperiodeResponse) => {
        setInnleggelsesperioderResponse(initializeInnleggelsesperiodeData(response));
        setIsLoading(false);
      })
      .catch(() => {
        setHentInnleggelsesperioderFeilet(true);
      });
  };

  const lagreInnleggelsesperioder = formState => {
    setIsLoading(true);
    let nyeInnleggelsesperioder = [];
    if (formState.innleggelsesperioder?.length > 0) {
      nyeInnleggelsesperioder = formState.innleggelsesperioder
        .filter(periodeWrapper => periodeWrapper.period?.fom && periodeWrapper.period?.tom)
        .map(periodeWrapper => new Period(periodeWrapper.period.fom, periodeWrapper.period.tom));
    }

    const { href } = findLinkByRel(LinkRel.ENDRE_INNLEGGELSESPERIODER, innleggelsesperioderResponse.links);
    const { behandlingUuid, versjon } = innleggelsesperioderResponse;
    postInnleggelsesperioder(
      href,
      { behandlingUuid, versjon, perioder: nyeInnleggelsesperioder },
      httpErrorHandler,
      controller.signal,
    )
      .then(() => {
        refetchBehandlingVedSykdomsendring();
        onInnleggelsesperioderUpdated();
        updateInnlegelsesperioder();
      })
      .catch(() => {
        setLagreInnleggelsesperioderFeilet(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    const perioderMedVilkarEndpoint = endpoints.perioderMedVilkar;
    const skalHenteBegrensning =
      perioderMedVilkarEndpoint && fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE;

    hentInnleggelsesperioder()
      .then((response: InnleggelsesperiodeResponse) => {
        if (isMounted) {
          setInnleggelsesperioderResponse(initializeInnleggelsesperiodeData(response));
          if (!skalHenteBegrensning) {
            setIsLoading(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setHentInnleggelsesperioderFeilet(true);
        }
      });

    if (skalHenteBegrensning) {
      httpUtils
        .get<PerioderMedVilkarResponse>(perioderMedVilkarEndpoint, httpErrorHandler, { signal: controller.signal })
        .then(response => {
          if (!isMounted) return;
          const vurderingsperioder = response?.perioderMedÅrsak?.perioderTilVurdering;
          if (vurderingsperioder?.length) {
            const perioder = vurderingsperioder.map(({ fom, tom }) => new Period(fom, tom));
            setInnleggelsesperiodeBegrensning({
              søknadsperiode: finnMaksavgrensningerForPerioder(perioder),
              hullIPeriode: finnHullIPerioder(perioder).map(p => ({ from: p.fom, to: p.tom })),
              sammenhengendePerioder: slåSammenSammenhengendePerioder(perioder),
            });
          }
          setIsLoading(false);
        })
        .catch(() => {
          if (isMounted) {
            setHentInnleggelsesperioderFeilet(true);
            setIsLoading(false);
          }
        });
    }

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
        <Box marginBlock="space-24 space-0">
          {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
          {innleggelsesperioder.length > 0 && (
            <Box marginBlock="space-8 space-0">
              <Innleggelsesperiodeliste innleggelsesperioder={innleggelsesperioder} />
            </Box>
          )}
        </Box>
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
          innleggelsesperiodeBegrensning={innleggelsesperiodeBegrensning}
          endringerPåvirkerAndreBehandlinger={nyeInnleggelsesperioder => {
            const { href, requestPayload } = findLinkByRel(
              LinkRel.ENDRE_INNLEGGELSESPERIODER,
              innleggelsesperioderResponse.links,
            );
            return postInnleggelsesperioderDryRun(
              href,
              { ...requestPayload, perioder: nyeInnleggelsesperioder },
              httpErrorHandler,
              controller.signal,
            );
          }}
        />
      )}
    </div>
  );
};

export default Innleggelsesperiodeoversikt;
