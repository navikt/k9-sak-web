import { httpUtils } from '@fpsak-frontend/utils';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ChildEyesFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Alert, Box, Tabs, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import React, { useMemo, type JSX } from 'react';

import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';
import Dokument from '../../../types/Dokument';
import { NyeDokumenterResponse } from '../../../types/NyeDokumenterResponse';
import Step, {
  langvarigSykdomSteg,
  livetsSluttfaseSteg,
  StepId,
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
import { Infostripe } from '@k9-sak-web/gui/shared/infostripe/Infostripe.js';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController from '../nye-dokumenter-som-kan-påvirke-eksisterende-vurderinger/NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController';
import StruktureringAvDokumentasjon from '../strukturering-av-dokumentasjon/StruktureringAvDokumentasjon';
import UteståendeEndringerMelding from '../utestående-endringer-melding/UteståendeEndringerMelding';
import VilkarsvurderingAvLivetsSluttfase from '../vilkarsvurdering-av-livets-sluttfase/VilkarsvurderingAvLivetsSluttfase';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import VilkårsvurderingLangvarigSykdom from '../vilkårsvurdering-langvarig-sykdom/VilkarsvurderingLangvarigSykdom';
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

const sykdomTittel = (fagsakYtelseType: FagsakYtelsesType | undefined) => {
  if (fagsakYtelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return 'Sykdom og opplæring';
  }

  if (fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
    return 'Livets sluttfase';
  }

  return 'Sykdom';
};

const MedisinskVilkår = (): JSX.Element => {
  const [state, dispatch] = React.useReducer(medisinskVilkårReducer, {
    isLoading: true,
    hasError: false,
    activeStep: null,
    markedStep: null,
    sykdomsstegStatus: null,
    nyeDokumenterSomIkkeErVurdert: [],
  });

  const { isLoading, hasError, activeStep, markedStep, sykdomsstegStatus, nyeDokumenterSomIkkeErVurdert } = state;
  const { endpoints, httpErrorHandler, visFortsettknapp, fagsakYtelseType, readOnly } =
    React.useContext(ContainerContext);

  const dokumentStegForSakstype = stegForSakstype(fagsakYtelseType).find(stepObj => stepObj.id === StepId.Dokument);

  const finnNesteStegFn = (nesteSteg: SykdomsstegStatusResponse, isOnMount?: boolean) => {
    switch (fagsakYtelseType) {
      case fagsakYtelsesType.OPPLÆRINGSPENGER:
        return finnNesteStegForOpplæringspenger(nesteSteg, isOnMount);
      case fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE:
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

  const { isLoading: diagnosekoderLoading, data: diagnosekoderData } = useQuery({
    queryKey: ['diagnosekodeResponse'],
    queryFn: hentDiagnosekoder,
    enabled: !erFagsakOLPEllerPLS(fagsakYtelseType),
    placeholderData: { diagnosekoder: [], links: [], behandlingUuid: '', versjon: '' },
    staleTime: 10000,
  });

  const diagnosekoder = endpoints.diagnosekoder ? diagnosekoderData?.diagnosekoder : [];
  const diagnosekoderTekst =
    Array.isArray(diagnosekoder) && diagnosekoder.length > 0 ? `${diagnosekoder.join(', ')}` : 'Kode mangler';

  const hentSykdomsstegStatus = async () => {
    try {
      const status = await httpUtils.get<SykdomsstegStatusResponse>(endpoints.status, httpErrorHandler, {
        signal: controller.signal,
      });
      const nesteSteg = finnNesteStegFn(status);
      dispatch({
        type: ActionType.UPDATE_STATUS,
        sykdomsstegStatus: status,
        step: nesteSteg,
      });
      return status;
    } catch (error) {
      dispatch({
        type: ActionType.SHOW_ERROR,
        step: null,
      });
      throw new Error(error);
    }
  };

  const hentNyeDokumenterSomIkkeErVurdertHvisNødvendig = (status): Promise<[SykdomsstegStatusResponse, Dokument[]]> =>
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

  React.useEffect(() => {
    void hentSykdomsstegStatus()
      .then(hentNyeDokumenterSomIkkeErVurdertHvisNødvendig)
      .then(([sykdomsstegStatusResponse, nyeDokumenterSomIkkeErVurdertResponse]) => {
        const step = finnNesteStegFn(sykdomsstegStatusResponse, true);
        if (step !== null) {
          dispatch({
            type: ActionType.MARK_AND_ACTIVATE_STEP,
            step,
            nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
          });
        } else {
          dispatch({
            type: ActionType.ACTIVATE_DEFAULT_STEP,
            step: dokumentStegForSakstype ?? null,
            nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
          });
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const navigerTilNesteSteg = () => {
    if (!sykdomsstegStatus) return;
    const nesteSteg = finnNesteStegFn(sykdomsstegStatus);
    dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
  };

  const navigerTilSteg = (nesteSteg: Step, ikkeMarkerSteg?: boolean) => {
    if (sykdomsstegStatus?.kanLøseAksjonspunkt || ikkeMarkerSteg) {
      dispatch({ type: ActionType.ACTIVATE_STEP_AND_CLEAR_MARKING, step: nesteSteg });
    } else {
      dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
    }
  };

  const afterEndringerUtifraNyeDokumenterRegistrert = () => {
    dispatch({
      type: ActionType.ENDRINGER_UTIFRA_NYE_DOKUMENTER_REGISTRERT,
      step: null,
    });
    void hentSykdomsstegStatus().then(
      ({
        kanLøseAksjonspunkt,
        manglerVurderingAvKontinuerligTilsynOgPleie,
        manglerVurderingAvToOmsorgspersoner,
        manglerVurderingAvLangvarigSykdom,
      }) => {
        if (kanLøseAksjonspunkt) {
          navigerTilSteg(toOmsorgspersonerSteg, true);
        } else if (!manglerVurderingAvKontinuerligTilsynOgPleie && manglerVurderingAvToOmsorgspersoner) {
          navigerTilSteg(toOmsorgspersonerSteg);
        } else if (manglerVurderingAvLangvarigSykdom) {
          navigerTilSteg(langvarigSykdomSteg);
        }
      },
    );
  };

  const kanLøseAksjonspunkt = sykdomsstegStatus?.kanLøseAksjonspunkt;
  const ikkeSammenMedBarnet = sykdomsstegStatus?.ikkeSammenMedBarnet;
  const harDataSomIkkeHarBlittTattMedIBehandling = sykdomsstegStatus?.harDataSomIkkeHarBlittTattMedIBehandling;
  const manglerVurderingAvNyeDokumenter = sykdomsstegStatus?.nyttDokumentHarIkkekontrollertEksisterendeVurderinger;

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
    <PageContainer isLoading={isLoading} hasError={hasError}>
      <Infostripe
        content={
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
        iconRenderer={() => <ChildEyesFillIcon fontSize="1.5rem" />}
      />

      <div className={styles.medisinskVilkår}>
        <VStack paddingBlock="2">
          <h1 style={{ fontSize: 22 }}>{sykdomTittel(fagsakYtelseType)}</h1>
          {ikkeSammenMedBarnet === true && (
            <Alert variant="warning">
              Søker har opplyst om utenlandsopphold uten barnet i søknadsperioden. Sjekk søknaden og korriger den
              aktuelle perioden via punsj, slik at det ikke utbetales pleiepenger for perioden søker ikke pleier barnet.
            </Alert>
          )}
        </VStack>
        <WriteAccessBoundContent
          contentRenderer={() => (
            <Box marginBlock="0 4">
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
          readOnly={readOnly}
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
          readOnly={readOnly}
        />
        <WriteAccessBoundContent
          contentRenderer={() => <UteståendeEndringerMelding />}
          otherRequirementsAreMet={
            kanLøseAksjonspunkt && !!harDataSomIkkeHarBlittTattMedIBehandling && visFortsettknapp === false
          }
          readOnly={readOnly}
        />

        <Tabs
          value={activeStep?.id}
          onChange={(clickedId: string) => {
            dispatch({ type: ActionType.ACTIVATE_STEP, step: steps.find(step => step.id === clickedId) ?? null });
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
                  hentSykdomsstegStatus()
                    .then(hentNyeDokumenterSomIkkeErVurdertHvisNødvendig)
                    .then(([status, dokumenter]) => {
                      dispatch({
                        type: ActionType.UPDATE_NYE_DOKUMENTER_SOM_IKKE_ER_VURDERT,
                        nyeDokumenterSomIkkeErVurdert: dokumenter,
                        step: null,
                      });
                      return [status, dokumenter];
                    })
                }
                sykdomsstegStatus={sykdomsstegStatus}
              />
            )}
            {activeStep === tilsynOgPleieSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkårsvurderingAvTilsynOgPleie
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={hentSykdomsstegStatus}
                  sykdomsstegStatus={sykdomsstegStatus}
                />
              </VurderingContext.Provider>
            )}
            {activeStep === langvarigSykdomSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkårsvurderingLangvarigSykdom
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={hentSykdomsstegStatus}
                  sykdomsstegStatus={sykdomsstegStatus}
                />
              </VurderingContext.Provider>
            )}
            {activeStep === livetsSluttfaseSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkarsvurderingAvLivetsSluttfase
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={hentSykdomsstegStatus}
                  sykdomsstegStatus={sykdomsstegStatus}
                />
              </VurderingContext.Provider>
            )}
            {activeStep === toOmsorgspersonerSteg && (
              <VurderingContext.Provider value={contextValue}>
                <VilkårsvurderingAvToOmsorgspersoner
                  navigerTilNesteSteg={navigerTilSteg}
                  hentSykdomsstegStatus={hentSykdomsstegStatus}
                  sykdomsstegStatus={sykdomsstegStatus}
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
