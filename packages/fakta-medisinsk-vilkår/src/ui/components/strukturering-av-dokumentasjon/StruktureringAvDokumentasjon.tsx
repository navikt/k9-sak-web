import { get } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import axios from 'axios';
import React, { type JSX, useMemo } from 'react';

import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { Bleed, Box, ExpansionCard, Heading } from '@navikt/ds-react';
import Dokument from '../../../types/Dokument';
import Dokumentoversikt from '../../../types/Dokumentoversikt';
import { DokumentoversiktResponse } from '../../../types/DokumentoversiktResponse';
import { StepId } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import {
  nesteStegErLivetssluttfase,
  nesteStegErOpplæringspenger,
  nesteStegErVurderingForPleiepenger,
} from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Diagnosekodeoversikt from '../diagnosekodeoversikt/Diagnosekodeoversikt';
import DokumentasjonFooter from '../dokumentasjon-footer/DokumentasjonFooter';
import Dokumentdetaljer from '../dokumentdetaljer/Dokumentdetaljer';
import Dokumentnavigasjon from '../dokumentnavigasjon/Dokumentnavigasjon';
import DokumentoversiktMessages from '../dokumentoversikt-messages/DokmentoversiktMessages';
import Innleggelsesperiodeoversikt from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import SignertSeksjon from '../signert-seksjon/SignertSeksjon';
import ActionType from './actionTypes';
import dokumentReducer from './reducer';
import styles from './struktureringAvDokumentasjon.module.css';

interface StruktureringAvDokumentasjonProps {
  navigerTilNesteSteg: () => void;
  hentSykdomsstegStatus: () => Promise<[SykdomsstegStatusResponse, Dokument[]]>;
  sykdomsstegStatus: SykdomsstegStatusResponse | null;
}

const StruktureringAvDokumentasjon = ({
  navigerTilNesteSteg,
  hentSykdomsstegStatus,
  sykdomsstegStatus,
}: StruktureringAvDokumentasjonProps): JSX.Element => {
  const { endpoints, errorNotifier, fagsakYtelseType } = React.useContext(ContainerContext);

  const {VIS_INNLEGGELSE_FOR_PILS} = React.useContext(FeatureTogglesContext);
  const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

  const [state, dispatch] = React.useReducer(dokumentReducer, {
    visDokumentDetails: false,
    isLoading: true,
    dokumentoversikt: null,
    valgtDokument: null,
    dokumentoversiktFeilet: false,
    visRedigeringAvDokument: false,
  });

  const {
    dokumentoversikt,
    isLoading,
    visDokumentDetails,
    valgtDokument,
    dokumentoversiktFeilet,
    visRedigeringAvDokument,
  } = state;

  const skalViseDiagnosekoder = fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;

  const skalViseInnleggelsesperioder =
    fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN ||
    (VIS_INNLEGGELSE_FOR_PILS && fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE);

  const nesteStegErVurderingFn = (nesteSteg: SykdomsstegStatusResponse) => {
    if (fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
      return nesteStegErLivetssluttfase(nesteSteg);
    }

    if (fagsakYtelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
      return nesteStegErOpplæringspenger(nesteSteg);
    }

    return nesteStegErVurderingForPleiepenger(nesteSteg);
  };

  const getDokumentoversikt = () =>
    get<DokumentoversiktResponse>(endpoints.dokumentoversikt, errorNotifier, {
      cancelToken: httpCanceler.token,
    });

  const visDokumentoversikt = (nyDokumentoversikt: Dokumentoversikt) => {
    dispatch({
      type: ActionType.VIS_DOKUMENTOVERSIKT,
      dokumentoversikt: nyDokumentoversikt,
      valgtDokument: nyDokumentoversikt.harUstrukturerteDokumenter()
        ? nyDokumentoversikt.ustrukturerteDokumenter[0]
        : null,
    });
  };

  const handleError = () => {
    dispatch({ type: ActionType.DOKUMENTOVERSIKT_FEILET });
  };

  const velgDokument = (nyttValgtDokument: Dokument) => {
    dispatch({ type: ActionType.VELG_DOKUMENT, valgtDokument: nyttValgtDokument });
  };

  const åpneDokumentSomMåBehandles = ({ ustrukturerteDokumenter }: Dokumentoversikt) => {
    const sisteDokumentIndex = ustrukturerteDokumenter?.length > 0 ? ustrukturerteDokumenter.length - 1 : null;
    const førsteDokumentSomMåBehandles =
      sisteDokumentIndex !== null ? ustrukturerteDokumenter[sisteDokumentIndex] : null;
    if (førsteDokumentSomMåBehandles) {
      velgDokument(førsteDokumentSomMåBehandles);
    }
  };

  React.useEffect(() => {
    let isMounted = true;
    getDokumentoversikt()
      .then(({ dokumenter }: DokumentoversiktResponse) => {
        if (isMounted) {
          const nyDokumentoversikt = new Dokumentoversikt(dokumenter);
          visDokumentoversikt(nyDokumentoversikt);
          åpneDokumentSomMåBehandles(nyDokumentoversikt);
        }
      })
      .catch(handleError);
    return () => {
      isMounted = false;
      httpCanceler.cancel();
    };
  }, []);

  const sjekkStatus = async () => {
    dispatch({ type: ActionType.PENDING });
    try {
      await hentSykdomsstegStatus();
      const { dokumenter } = await getDokumentoversikt();
      const nyDokumentoversikt = new Dokumentoversikt(dokumenter);
      visDokumentoversikt(nyDokumentoversikt);
      åpneDokumentSomMåBehandles(nyDokumentoversikt);
    } catch {
      handleError();
    }
  };

  return (
    <PageContainer isLoading={isLoading} hasError={dokumentoversiktFeilet} key={StepId.Dokument} preventUnmount>
      <DokumentoversiktMessages
        dokumentoversikt={dokumentoversikt}
        harRegistrertDiagnosekode={!skalViseDiagnosekoder || !sykdomsstegStatus?.manglerDiagnosekode}
        kanNavigereVidere={sykdomsstegStatus ? nesteStegErVurderingFn(sykdomsstegStatus) : false}
        navigerTilNesteSteg={navigerTilNesteSteg}
      />
      {dokumentoversikt?.harDokumenter() === true && (
        <div>
          <NavigationWithDetailView
            noBorder
            navigationSection={() => (
              <>
                <Box minWidth="456px">
                  <Box
                    borderColor="neutral"
                    borderRadius="12"
                    borderWidth="1"
                    paddingBlock="space-16 space-0"
                    paddingInline="space-16"
                    style={{ alignSelf: 'start' }}
                  >
                    <Heading size="small" level="2">
                      Dokumenter til behandling
                    </Heading>
                    <Bleed marginInline="space-16">
                      <Dokumentnavigasjon
                        dokumenter={dokumentoversikt.ustrukturerteDokumenter}
                        onDokumentValgt={velgDokument}
                        valgtDokument={valgtDokument}
                      />
                    </Bleed>
                  </Box>
                </Box>
                <Box marginBlock="space-24 space-0" minWidth="456px" className={styles.ekspanderbarDokumentnavigasjon}>
                  <ExpansionCard aria-label="Andre dokumenter" size="small" defaultOpen={false}>
                    <ExpansionCard.Header>
                      <ExpansionCard.Title size="small">Andre dokumenter</ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                      <Dokumentnavigasjon
                        dokumenter={dokumentoversikt.strukturerteDokumenter}
                        onDokumentValgt={velgDokument}
                        valgtDokument={valgtDokument}
                        displayFilterOption
                        usePagination
                      />
                    </ExpansionCard.Content>
                  </ExpansionCard>
                </Box>
              </>
            )}
            showDetailSection={visDokumentDetails}
            detailSection={() =>
              valgtDokument ? (
                <Dokumentdetaljer
                  dokument={valgtDokument}
                  onChange={sjekkStatus}
                  editMode={visRedigeringAvDokument}
                  onEditClick={() => dispatch({ type: ActionType.REDIGER_DOKUMENT })}
                  strukturerteDokumenter={dokumentoversikt?.strukturerteDokumenter}
                />
              ) : (
                <></>
              )
            }
          />

          {(skalViseInnleggelsesperioder || skalViseDiagnosekoder) && (
            <Box marginBlock="space-64 space-0">
              <DokumentasjonFooter
                firstSectionRenderer={
                  skalViseInnleggelsesperioder
                    ? () => <Innleggelsesperiodeoversikt onInnleggelsesperioderUpdated={sjekkStatus} />
                    : undefined
                }
                secondSectionRenderer={
                  skalViseDiagnosekoder
                    ? () => <Diagnosekodeoversikt onDiagnosekoderUpdated={sjekkStatus} />
                    : undefined
                }
                thirdSectionRenderer={() => <SignertSeksjon harGyldigSignatur={dokumentoversikt.harGyldigSignatur()} />}
              />
            </Box>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default StruktureringAvDokumentasjon;
