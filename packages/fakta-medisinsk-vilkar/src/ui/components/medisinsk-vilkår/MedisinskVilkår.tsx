import { get } from '@navikt/k9-http-utils';
import { Box, ChildIcon, Infostripe, Margin, PageContainer, WarningIcon } from '@navikt/k9-react-components';
import axios from 'axios';
import classnames from 'classnames';
import { TabsPure } from 'nav-frontend-tabs';
import React, { useMemo } from 'react';
import Dokument from '../../../types/Dokument';
import { NyeDokumenterResponse } from '../../../types/NyeDokumenterResponse';
import Step, { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingstype from '../../../types/Vurderingstype';
import { finnNesteSteg } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import VurderingContext from '../../context/VurderingContext';
import AksjonspunktFerdigStripe from '../aksjonspunkt-ferdig-stripe/AksjonspunktFerdigStripe';
import NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController from
    '../nye-dokumenter-som-kan-påvirke-eksisterende-vurderinger/NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController';
import StruktureringAvDokumentasjon from '../strukturering-av-dokumentasjon/StruktureringAvDokumentasjon';
import UteståendeEndringerMelding from '../utestående-endringer-melding/UteståendeEndringerMelding';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import ActionType from './actionTypes';
import styles from './medisinskVilkår.less';
import medisinskVilkårReducer from './reducer';

const steps: Step[] = [dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg];

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
                    <WarningIcon />
                </div>
            )}
        </div>
    );
};

const MedisinskVilkår = (): JSX.Element => {
    const [state, dispatch] = React.useReducer(medisinskVilkårReducer, {
        isLoading: true,
        hasError: null,
        activeStep: null,
        markedStep: null,
        sykdomsstegStatus: null,
        nyeDokumenterSomIkkeErVurdert: [],
    });

    const { isLoading, hasError, activeStep, markedStep, sykdomsstegStatus, nyeDokumenterSomIkkeErVurdert } = state;
    const { endpoints, httpErrorHandler, visFortsettknapp } = React.useContext(ContainerContext);

    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const hentSykdomsstegStatus = async () => {
        try {
            const status = await get<SykdomsstegStatusResponse>(endpoints.status, httpErrorHandler, {
                cancelToken: httpCanceler.token,
            });
            const nesteSteg = finnNesteSteg(status);
            dispatch({
                type: ActionType.UPDATE_STATUS,
                sykdomsstegStatus: status,
                step: nesteSteg,
            });
            return status;
        } catch (error) {
            dispatch({
                type: ActionType.SHOW_ERROR,
            });
            throw new Error(error);
        }
    };

    const hentNyeDokumenterSomIkkeErVurdertHvisNødvendig = (status): Promise<[SykdomsstegStatusResponse, Dokument[]]> =>
        new Promise((resolve, reject) => {
            if (status.nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
                get<NyeDokumenterResponse>(endpoints.nyeDokumenter, httpErrorHandler, {
                    cancelToken: httpCanceler.token,
                }).then(
                    (dokumenter) => resolve([status, dokumenter]),
                    (error) => reject(error)
                );
            } else {
                resolve([status, []]);
            }
        });

    React.useEffect(() => {
        hentSykdomsstegStatus()
            .then(hentNyeDokumenterSomIkkeErVurdertHvisNødvendig)
            .then(([sykdomsstegStatusResponse, nyeDokumenterSomIkkeErVurdertResponse]) => {
                const step = finnNesteSteg(sykdomsstegStatusResponse, true);
                if (step !== null) {
                    dispatch({
                        type: ActionType.MARK_AND_ACTIVATE_STEP,
                        step,
                        nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
                    });
                } else {
                    dispatch({
                        type: ActionType.ACTIVATE_DEFAULT_STEP,
                        nyeDokumenterSomIkkeErVurdert: nyeDokumenterSomIkkeErVurdertResponse,
                    });
                }
            });

        return () => {
            httpCanceler.cancel();
        };
    }, []);

    const navigerTilNesteSteg = () => {
        const nesteSteg = finnNesteSteg(sykdomsstegStatus);
        dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
    };

    const navigerTilSteg = (nesteSteg: Step, ikkeMarkerSteg?: boolean) => {
        if (sykdomsstegStatus.kanLøseAksjonspunkt || ikkeMarkerSteg) {
            dispatch({ type: ActionType.ACTIVATE_STEP_AND_CLEAR_MARKING, step: nesteSteg });
        } else {
            dispatch({ type: ActionType.NAVIGATE_TO_STEP, step: nesteSteg });
        }
    };

    const afterEndringerUtifraNyeDokumenterRegistrert = () => {
        dispatch({ type: ActionType.ENDRINGER_UTIFRA_NYE_DOKUMENTER_REGISTRERT });
        hentSykdomsstegStatus().then(
            ({
                kanLøseAksjonspunkt,
                manglerVurderingAvKontinuerligTilsynOgPleie,
                manglerVurderingAvToOmsorgspersoner,
            }) => {
                if (kanLøseAksjonspunkt) {
                    navigerTilSteg(toOmsorgspersonerSteg, true);
                } else if (!manglerVurderingAvKontinuerligTilsynOgPleie && manglerVurderingAvToOmsorgspersoner) {
                    navigerTilSteg(toOmsorgspersonerSteg);
                }
            }
        );
    };

    const kanLøseAksjonspunkt = sykdomsstegStatus?.kanLøseAksjonspunkt;
    const harDataSomIkkeHarBlittTattMedIBehandling = sykdomsstegStatus?.harDataSomIkkeHarBlittTattMedIBehandling;
    const manglerVurderingAvNyeDokumenter = sykdomsstegStatus?.nyttDokumentHarIkkekontrollertEksisterendeVurderinger;

    return (
        <PageContainer isLoading={isLoading} hasError={hasError}>
            <Infostripe
                element={
                    <>
                        <span>Vurderingen gjelder pleietrengende og er felles for alle parter.</span>
                    </>
                }
                iconRenderer={() => <ChildIcon />}
            />
            <div className={styles.medisinskVilkår}>
                <h1 style={{ fontSize: 22 }}>Sykdom</h1>
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
                        nyeDokumenterSomIkkeErVurdert &&
                        manglerVurderingAvNyeDokumenter &&
                        markedStep !== dokumentSteg &&
                        activeStep !== dokumentSteg
                    }
                />

                <WriteAccessBoundContent
                    contentRenderer={() => <AksjonspunktFerdigStripe />}
                    otherRequirementsAreMet={
                        kanLøseAksjonspunkt &&
                        visFortsettknapp === true &&
                        markedStep !== dokumentSteg &&
                        activeStep !== dokumentSteg
                    }
                />
                <WriteAccessBoundContent
                    contentRenderer={() => <UteståendeEndringerMelding />}
                    otherRequirementsAreMet={
                        kanLøseAksjonspunkt && !!harDataSomIkkeHarBlittTattMedIBehandling && visFortsettknapp === false
                    }
                />
                <TabsPure
                    kompakt
                    tabs={steps.map((step) => ({
                        label: (
                            <TabItem label={step.title} showWarningIcon={step === markedStep && !kanLøseAksjonspunkt} />
                        ),
                        aktiv: step === activeStep,
                    }))}
                    onChange={(event, clickedIndex) => {
                        dispatch({ type: ActionType.ACTIVATE_STEP, step: steps[clickedIndex] });
                    }}
                />
                <div style={{ marginTop: '1rem', maxWidth: '1204px' }}>
                    <div className={styles.medisinskVilkår__vilkårContentContainer}>
                        {activeStep === dokumentSteg && (
                            <StruktureringAvDokumentasjon
                                navigerTilNesteSteg={navigerTilNesteSteg}
                                hentSykdomsstegStatus={() =>
                                    hentSykdomsstegStatus()
                                        .then(hentNyeDokumenterSomIkkeErVurdertHvisNødvendig)
                                        .then(([status, dokumenter]) => {
                                            dispatch({
                                                type: ActionType.UPDATE_NYE_DOKUMENTER_SOM_IKKE_ER_VURDERT,
                                                nyeDokumenterSomIkkeErVurdert: dokumenter,
                                            });
                                            return [status, dokumenter];
                                        })
                                }
                                sykdomsstegStatus={sykdomsstegStatus}
                            />
                        )}
                        {activeStep === tilsynOgPleieSteg && (
                            <VurderingContext.Provider
                                value={{ vurderingstype: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE }}
                            >
                                <VilkårsvurderingAvTilsynOgPleie
                                    navigerTilNesteSteg={navigerTilSteg}
                                    hentSykdomsstegStatus={hentSykdomsstegStatus}
                                    sykdomsstegStatus={sykdomsstegStatus}
                                />
                            </VurderingContext.Provider>
                        )}
                        {activeStep === toOmsorgspersonerSteg && (
                            <VurderingContext.Provider value={{ vurderingstype: Vurderingstype.TO_OMSORGSPERSONER }}>
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
