import { httpUtils } from '@fpsak-frontend/utils';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { Box, ChildIcon, Infostripe, Margin, PageContainer } from '@navikt/ft-plattform-komponenter';
import classnames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import FagsakYtelseType from '../../../constants/FagsakYtelseType';
import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';
import Dokument from '../../../types/Dokument';
import { NyeDokumenterResponse } from '../../../types/NyeDokumenterResponse';
import Step, {
  StepId,
  langvarigSykdomSteg,
  livetsSluttfaseSteg,
  tilsynOgPleieSteg,
  toOmsorgspersonerSteg,
} from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingstype from '../../../types/Vurderingstype';
import {
  finnNesteStegForLivetsSluttfase,
  finnNesteStegForOpplæringspenger,
  finnNesteStegForPleiepenger,
  stegForSakstype,
} from '../../../util/statusUtils';
import { erFagsakOLPEllerPLS } from '../../../util/utils';
import ContainerContext from '../../context/ContainerContext';
import VurderingContext from '../../context/VurderingContext';
import AksjonspunktFerdigStripe from '../aksjonspunkt-ferdig-stripe/AksjonspunktFerdigStripe';
// eslint-disable-next-line max-len
import NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController from '../nye-dokumenter-som-kan-påvirke-eksisterende-vurderinger/NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController';
import StruktureringAvDokumentasjon from '../strukturering-av-dokumentasjon/StruktureringAvDokumentasjon';
import UteståendeEndringerMelding from '../utestående-endringer-melding/UteståendeEndringerMelding';
import VilkarsvurderingAvLivetsSluttfase from '../vilkarsvurdering-av-livets-sluttfase/VilkarsvurderingAvLivetsSluttfase';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import VilkårsvurderingLangvarigSykdom from '../vilkårsvurdering-langvarig-sykdom/VilkarsvurderingLangvarigSykdom';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import ActionType from './actionTypes';
import styles from './medisinskVilkår.module.css';
import medisinskVilkårReducer from './reducer';

interface TabItemProps {
  label: string;
  showWarningIcon: boolean;
}

const TabItem = ({ label, showWarningIcon }: TabItemProps) => {
  const cls = classnames(styles.medisinskVilkårTabItem, {
    [styles.medisinskVilkårTabItemExtended]: showWarningIcon,
  });
  return (
    <div className={cls}>
      {label}
      {showWarningIcon && (
        <div className={styles.medisinskVilkårTabItem__warningIcon}>
          <ExclamationmarkTriangleFillIcon
            fontSize="1.5rem"
            style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))', fontSize: '1.5rem' }}
          />
        </div>
      )}
    </div>
  );
};

const sykdomTittel = (fagsakYtelseType: FagsakYtelseType) => {
  if (fagsakYtelseType === FagsakYtelseType.OPPLÆRINGSPENGER) {
    return 'Sykdom og opplæring';
  }

  if (fagsakYtelseType === FagsakYtelseType.PLEIEPENGER_SLUTTFASE) {
    return 'Livets sluttfase';
  }

  return 'Sykdom';
};

const MedisinskVilkår = (): JSX.Element => {
  const [state, dispatch] = React.useReducer(medisinskVilkårReducer, {
    activeStep: null,
    markedStep: null,
    nyeDokumenterSomIkkeErVurdert: [],
  });

  const { activeStep, markedStep, nyeDokumenterSomIkkeErVurdert } = state;
  const { endpoints, httpErrorHandler, visFortsettknapp, fagsakYtelseType } = React.useContext(ContainerContext);

  const dokumentStegForSakstype = stegForSakstype(fagsakYtelseType).find(stepObj => stepObj.id === StepId.Dokument);

  const finnNesteStegFn = (nesteSteg: SykdomsstegStatusResponse, isOnMount?: boolean) => {
    switch (fagsakYtelseType) {
      case FagsakYtelseType.OPPLÆRINGSPENGER:
        return finnNesteStegForOpplæringspenger(nesteSteg, isOnMount);
      case FagsakYtelseType.PLEIEPENGER_SLUTTFASE:
        return finnNesteStegForLivetsSluttfase(nesteSteg, isOnMount);
      default:
        return finnNesteStegForPleiepenger(nesteSteg, isOnMount);
    }
  };

  const controller = useMemo(() => new AbortController(), []);

  const hentDiagnosekoder = () =>
    httpUtils
      .get<DiagnosekodeResponse>(endpoints.diagnosekoder, httpErrorHandler)
      .then((response: DiagnosekodeResponse) => response);

  const hentStatus = () =>
    httpUtils.get<SykdomsstegStatusResponse>(endpoints.status, httpErrorHandler, {
      signal: controller.signal,
    });

  const { isLoading: diagnosekoderLoading, data: diagnosekoderData } = useQuery(
    'diagnosekodeResponse',
    hentDiagnosekoder,
    { enabled: !erFagsakOLPEllerPLS(fagsakYtelseType) },
  );

  const {
    isLoading: statusLoading,
    data: sykdomstegStatus,
    error: hasError,
    refetch: refetchSykdomstegStatus,
  } = useQuery('status', hentStatus);

  const diagnosekoder = endpoints.diagnosekoder ? diagnosekoderData?.diagnosekoder : [];
  const diagnosekoderTekst = diagnosekoder?.length > 0 ? `${diagnosekoder?.join(', ')}` : 'Kode mangler';

  useEffect(() => {
    if (!statusLoading) {
      const nesteSteg = finnNesteStegFn(sykdomstegStatus);
      dispatch({
        type: ActionType.UPDATE_STATUS,
        step: nesteSteg,
      });
    }
  }, [sykdomstegStatus, statusLoading]);

  const hentNyeDokumenterSomIkkeErVurdertHvisNødvendig = (
    status: SykdomsstegStatusResponse,
  ): Promise<[SykdomsstegStatusResponse, Dokument[]]> =>
    new Promise((resolve, reject) => {
      if (status.nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
        httpUtils
          .get<NyeDokumenterResponse>(endpoints.nyeDokumenter, httpErrorHandler, {
            signal: controller.signal,
          })
          .then(
            dokumenter => resolve([status, dokumenter]),
            error => reject(error),
          );
      } else {
        resolve([status, []]);
      }
    });

  useEffect(() => {
    refetchSykdomstegStatus()
      .then(res => hentNyeDokumenterSomIkkeErVurdertHvisNødvendig(res.data))
      .then(([status, nyeDokumenterSomIkkeErVurdertResponse]) => {
        const step = finnNesteStegFn(status, true);
        if (step !== null) {
          dispatch({
            type: ActionType.MARK_AND_ACTIVATE_STEP,
            step,
            nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
          });
        } else {
          dispatch({
            type: ActionType.ACTIVATE_DEFAULT_STEP,
            step: dokumentStegForSakstype,
            nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
          });
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const navigerTilNesteSteg = () => {
    const nesteSteg = finnNesteStegFn(sykdomstegStatus);
    dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
  };

  const navigerTilSteg = (nesteSteg: Step, ikkeMarkerSteg?: boolean) => {
    if (sykdomstegStatus.kanLøseAksjonspunkt || ikkeMarkerSteg) {
      dispatch({ type: ActionType.ACTIVATE_STEP_AND_CLEAR_MARKING, step: nesteSteg });
    } else {
      dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
    }
  };

  const afterEndringerUtifraNyeDokumenterRegistrert = () => {
    dispatch({ type: ActionType.ENDRINGER_UTIFRA_NYE_DOKUMENTER_REGISTRERT });
    refetchSykdomstegStatus().then(({ data }) => {
      const {
        kanLøseAksjonspunkt,
        manglerVurderingAvKontinuerligTilsynOgPleie,
        manglerVurderingAvToOmsorgspersoner,
        manglerVurderingAvLangvarigSykdom,
      } = data;
      if (kanLøseAksjonspunkt) {
        navigerTilSteg(toOmsorgspersonerSteg, true);
      } else if (!manglerVurderingAvKontinuerligTilsynOgPleie && manglerVurderingAvToOmsorgspersoner) {
        navigerTilSteg(toOmsorgspersonerSteg);
      } else if (manglerVurderingAvLangvarigSykdom) {
        navigerTilSteg(langvarigSykdomSteg);
      }
    });
  };

  const kanLøseAksjonspunkt = sykdomstegStatus?.kanLøseAksjonspunkt;
  const harDataSomIkkeHarBlittTattMedIBehandling = sykdomstegStatus?.harDataSomIkkeHarBlittTattMedIBehandling;
  const manglerVurderingAvNyeDokumenter = sykdomstegStatus?.nyttDokumentHarIkkekontrollertEksisterendeVurderinger;

  const steps: Step[] = stegForSakstype(fagsakYtelseType);

  const contextValue = useMemo(() => {
    if (activeStep === tilsynOgPleieSteg) {
      return { vurderingstype: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE };
    }
    if (activeStep === langvarigSykdomSteg) {
      return { vurderingstype: Vurderingstype.LANGVARIG_SYKDOM };
    }
    if (activeStep === livetsSluttfaseSteg) {
      return { vurderingstype: Vurderingstype.LIVETS_SLUTTFASE };
    }
    if (activeStep === toOmsorgspersonerSteg) {
      return { vurderingstype: Vurderingstype.TO_OMSORGSPERSONER };
    }
    return {};
  }, [activeStep]);
  return (
    <PageContainer isLoading={statusLoading} hasError={hasError}>
      <Infostripe
        element={
          !erFagsakOLPEllerPLS(fagsakYtelseType) ? (
            <>
              <span>Sykdomsvurderingen gjelder barnet og er felles for alle parter.</span>
              <span className={styles.infostripe__diagnosekode__tittel}>Diagnose:</span>
              <span className={styles.infostripe__diagnosekode}>
                {(diagnosekoderLoading && ' ') || diagnosekoderTekst}
              </span>
            </>
          ) : (
            <span>Vurderingen gjelder pleietrengende og er felles for alle parter.</span>
          )
        }
        iconRenderer={() => <ChildIcon />}
      />

      <div className={styles.medisinskVilkår}>
        <h1 style={{ fontSize: 22 }}>{sykdomTittel(fagsakYtelseType)}</h1>
        <WriteAccessBoundContent
          contentRenderer={() => (
            <Box marginBottom={Margin.medium}>
              <NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController
                dokumenter={nyeDokumenterSomIkkeErVurdert}
                afterEndringerRegistrert={afterEndringerUtifraNyeDokumenterRegistrert}
              />
            </Box>
          )}
          otherRequirementsAreMet={
            !!(
              nyeDokumenterSomIkkeErVurdert &&
              manglerVurderingAvNyeDokumenter &&
              markedStep !== dokumentStegForSakstype &&
              activeStep !== dokumentStegForSakstype
            )
          }
        />

        <WriteAccessBoundContent
          contentRenderer={() => <AksjonspunktFerdigStripe />}
          otherRequirementsAreMet={
            !!(
              kanLøseAksjonspunkt &&
              visFortsettknapp === true &&
              markedStep !== dokumentStegForSakstype &&
              activeStep !== dokumentStegForSakstype
            )
          }
        />
        <WriteAccessBoundContent
          contentRenderer={() => <UteståendeEndringerMelding />}
          otherRequirementsAreMet={
            kanLøseAksjonspunkt && !!harDataSomIkkeHarBlittTattMedIBehandling && visFortsettknapp === false
          }
        />

        <Tabs
          value={activeStep?.id}
          onChange={(clickedId: string) => {
            dispatch({ type: ActionType.ACTIVATE_STEP, step: steps.find(step => step.id === clickedId) });
          }}
        >
          <Tabs.List>
            {steps.map(step => (
              <Tabs.Tab
                key={step.id}
                value={step.id}
                label={<TabItem label={step.title} showWarningIcon={step === markedStep && !kanLøseAksjonspunkt} />}
              />
            ))}
          </Tabs.List>
        </Tabs>
        <div style={{ marginTop: '1rem', maxWidth: '1204px' }}>
          <div className={styles.medisinskVilkår__vilkårContentContainer}>
            {activeStep === dokumentStegForSakstype && (
              <StruktureringAvDokumentasjon
                navigerTilNesteSteg={navigerTilNesteSteg}
                hentSykdomsstegStatus={() =>
                  refetchSykdomstegStatus()
                    .then(res => hentNyeDokumenterSomIkkeErVurdertHvisNødvendig(res.data))
                    .then(([status, dokumenter]) => {
                      dispatch({
                        type: ActionType.UPDATE_NYE_DOKUMENTER_SOM_IKKE_ER_VURDERT,
                        nyeDokumenterSomIkkeErVurdert: dokumenter,
                      });
                      return [status, dokumenter];
                    })
                }
                sykdomsstegStatus={sykdomstegStatus}
              />
            )}
            {activeStep === tilsynOgPleieSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkårsvurderingAvTilsynOgPleie
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={() => refetchSykdomstegStatus().then(({ data }) => data)}
                  sykdomsstegStatus={sykdomstegStatus}
                />
              </VurderingContext.Provider>
            )}
            {activeStep === langvarigSykdomSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkårsvurderingLangvarigSykdom
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={() => refetchSykdomstegStatus().then(({ data }) => data)}
                  sykdomsstegStatus={sykdomstegStatus}
                />
              </VurderingContext.Provider>
            )}
            {activeStep === livetsSluttfaseSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkarsvurderingAvLivetsSluttfase
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={() => refetchSykdomstegStatus().then(({ data }) => data)}
                  sykdomsstegStatus={sykdomstegStatus}
                />
              </VurderingContext.Provider>
            )}
            {activeStep === toOmsorgspersonerSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkårsvurderingAvToOmsorgspersoner
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={() => refetchSykdomstegStatus().then(({ data }) => data)}
                  sykdomsstegStatus={sykdomstegStatus}
                />
              </VurderingContext.Provider>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MedisinskVilkår;
