import { get } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import axios from 'axios';
import React, { useMemo, type JSX } from 'react';

import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { Box } from '@navikt/ds-react';
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
  const { endpoints, httpErrorHandler, fagsakYtelseType } = React.useContext(ContainerContext);
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

  const skalViseInnleggelsesperioderOgDiagnosekoder = ![
    fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
    fagsakYtelsesType.OPPLÆRINGSPENGER,
  ].some(ytelseType => ytelseType === fagsakYtelseType);

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
    get<DokumentoversiktResponse>(endpoints.dokumentoversikt, httpErrorHandler, {
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
        harRegistrertDiagnosekode={
          !skalViseInnleggelsesperioderOgDiagnosekoder || !sykdomsstegStatus?.manglerDiagnosekode
        }
        kanNavigereVidere={sykdomsstegStatus ? nesteStegErVurderingFn(sykdomsstegStatus) : false}
        navigerTilNesteSteg={navigerTilNesteSteg}
      />
      {dokumentoversikt?.harDokumenter() === true && (
        <div>
          <NavigationWithDetailView
            noBorder
            navigationSection={() => (
              <>
                <Dokumentnavigasjon
                  tittel="Dokumenter til behandling"
                  dokumenter={dokumentoversikt.ustrukturerteDokumenter}
                  onDokumentValgt={velgDokument}
                  valgtDokument={valgtDokument}
                  expandedByDefault
                />
                <Box.New marginBlock="6 0">
                  <Dokumentnavigasjon
                    tittel="Andre dokumenter"
                    dokumenter={dokumentoversikt.strukturerteDokumenter}
                    onDokumentValgt={velgDokument}
                    valgtDokument={valgtDokument}
                    displayFilterOption
                  />
                </Box.New>
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

          {skalViseInnleggelsesperioderOgDiagnosekoder && (
            <Box.New marginBlock="16 0">
              <DokumentasjonFooter
                firstSectionRenderer={() => <Innleggelsesperiodeoversikt onInnleggelsesperioderUpdated={sjekkStatus} />}
                secondSectionRenderer={() => <Diagnosekodeoversikt onDiagnosekoderUpdated={sjekkStatus} />}
                thirdSectionRenderer={() => <SignertSeksjon harGyldigSignatur={dokumentoversikt.harGyldigSignatur()} />}
              />
            </Box.New>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default StruktureringAvDokumentasjon;
