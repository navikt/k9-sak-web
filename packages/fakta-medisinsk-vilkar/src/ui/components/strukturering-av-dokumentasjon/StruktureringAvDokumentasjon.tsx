import { get } from '@navikt/k9-http-utils';
import { Box, Margin, NavigationWithDetailView, PageContainer } from '@navikt/k9-react-components';
import axios from 'axios';
import React, { useMemo } from 'react';
import Dokument from '../../../types/Dokument';
import Dokumentoversikt from '../../../types/Dokumentoversikt';
import { DokumentoversiktResponse } from '../../../types/DokumentoversiktResponse';
import { StepId } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import { nesteStegErVurdering } from '../../../util/statusUtils';
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
import styles from './struktureringAvDokumentasjon.less';

interface StruktureringAvDokumentasjonProps {
    navigerTilNesteSteg: () => void;
    hentSykdomsstegStatus: () => Promise<[SykdomsstegStatusResponse, Dokument[]]>;
    sykdomsstegStatus: SykdomsstegStatusResponse;
}

const StruktureringAvDokumentasjon = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    sykdomsstegStatus,
}: StruktureringAvDokumentasjonProps): JSX.Element => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
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

    const sjekkStatus = () => {
        dispatch({ type: ActionType.PENDING });
        hentSykdomsstegStatus()
            .then(() => {
                getDokumentoversikt().then(({ dokumenter }: DokumentoversiktResponse) => {
                    const nyDokumentoversikt = new Dokumentoversikt(dokumenter);
                    visDokumentoversikt(nyDokumentoversikt);
                    åpneDokumentSomMåBehandles(nyDokumentoversikt);
                });
            })
            .catch(handleError);
    };

    return (
        <PageContainer isLoading={isLoading} hasError={dokumentoversiktFeilet} key={StepId.Dokument} preventUnmount>
            <DokumentoversiktMessages
                dokumentoversikt={dokumentoversikt}
                harRegistrertDiagnosekode={!sykdomsstegStatus.manglerDiagnosekode}
                kanNavigereVidere={nesteStegErVurdering(sykdomsstegStatus)}
                navigerTilNesteSteg={navigerTilNesteSteg}
            />
            {dokumentoversikt?.harDokumenter() === true && (
                <div className={styles.dokumentoversikt}>
                    <NavigationWithDetailView
                        navigationSection={() => (
                            <>
                                <Dokumentnavigasjon
                                    tittel="Dokumenter til behandling"
                                    dokumenter={dokumentoversikt.ustrukturerteDokumenter}
                                    onDokumentValgt={velgDokument}
                                    valgtDokument={valgtDokument}
                                    expandedByDefault
                                />
                                <Box marginTop={Margin.large}>
                                    <Dokumentnavigasjon
                                        tittel="Andre dokumenter"
                                        dokumenter={dokumentoversikt.strukturerteDokumenter}
                                        onDokumentValgt={velgDokument}
                                        valgtDokument={valgtDokument}
                                        displayFilterOption
                                    />
                                </Box>
                            </>
                        )}
                        showDetailSection={visDokumentDetails}
                        detailSection={() => (
                            <Dokumentdetaljer
                                dokument={valgtDokument}
                                onChange={sjekkStatus}
                                editMode={visRedigeringAvDokument}
                                onEditClick={() => dispatch({ type: ActionType.REDIGER_DOKUMENT })}
                                strukturerteDokumenter={dokumentoversikt?.strukturerteDokumenter}
                            />
                        )}
                    />

                    <Box marginTop={Margin.xxLarge}>
                        <DokumentasjonFooter
                            firstSectionRenderer={() => (
                                <Innleggelsesperiodeoversikt onInnleggelsesperioderUpdated={sjekkStatus} />
                            )}
                            secondSectionRenderer={() => <Diagnosekodeoversikt onDiagnosekoderUpdated={sjekkStatus} />}
                            thirdSectionRenderer={() => (
                                <SignertSeksjon harGyldigSignatur={dokumentoversikt.harGyldigSignatur()} />
                            )}
                        />
                    </Box>
                </div>
            )}
        </PageContainer>
    );
};

export default StruktureringAvDokumentasjon;
