import { get } from '@navikt/k9-http-utils';
import { Box, Margin, PageContainer } from '@navikt/k9-react-components';
import { Period } from '@navikt/k9-period-utils';
import React, { useMemo } from 'react';
import axios from 'axios';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { PeriodeMedEndring, PerioderMedEndringResponse } from '../../../types/PeriodeMedEndring';
import OverlappendePeriodeModal from '../overlappende-periode-modal/OverlappendePeriodeModal';
import ActionType from './actionTypes';
import vurderingControllerReducer from './reducer';
import { postEndreVurdering, postEndreVurderingDryRun } from '../../../api/api';
import ContainerContext from '../../context/ContainerContext';
import scrollUp from '../../../util/viewUtils';
import LagreVurderingFeiletMelding from '../lagre-vurdering-feilet-melding/LagreVurderingFeiletMelding';

interface EndreVurderingControllerProps {
    endreVurderingLink: Link;
    dataTilVurderingUrl: string;
    onVurderingLagret: () => void;
    formRenderer: (
        dokumenter: Dokument[],
        onSubmit: (vurderingsversjon: Vurderingsversjon) => void,
        isSubmitting: boolean
    ) => React.ReactNode;
    vurderingsid: string;
    vurderingsversjonId: string;
}

const EndreVurderingController = ({
    endreVurderingLink,
    dataTilVurderingUrl,
    onVurderingLagret,
    formRenderer,
    vurderingsid,
    vurderingsversjonId,
}: EndreVurderingControllerProps): JSX.Element => {
    const { httpErrorHandler } = React.useContext(ContainerContext);

    const [state, dispatch] = React.useReducer(vurderingControllerReducer, {
        sjekkForEksisterendeVurderingerPågår: false,
        lagringAvVurderingPågår: false,
        lagreVurderingHarFeilet: false,
        hentDataTilVurderingPågår: true,
        hentDataTilVurderingHarFeilet: false,
        dokumenter: [],
        perioderMedEndring: [],
        overlappendePeriodeModalOpen: false,
        vurderingsversjonTilLagringFraModal: null,
    });

    const {
        sjekkForEksisterendeVurderingerPågår,
        lagringAvVurderingPågår,
        lagreVurderingHarFeilet,
        hentDataTilVurderingPågår,
        hentDataTilVurderingHarFeilet,
        dokumenter,
        perioderMedEndring,
        overlappendePeriodeModalOpen,
        vurderingsversjonTilLagringFraModal,
    } = state;

    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    function endreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        dispatch({ type: ActionType.LAGRING_AV_VURDERING_PÅBEGYNT });
        return postEndreVurdering(
            endreVurderingLink.href,
            endreVurderingLink.requestPayload.behandlingUuid,
            vurderingsid,
            nyVurderingsversjon,
            httpErrorHandler,
            httpCanceler.token
        ).then(
            () => {
                onVurderingLagret();
                dispatch({ type: ActionType.VURDERING_LAGRET });
                scrollUp();
            },
            () => {
                dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
                scrollUp();
            }
        );
    }

    const sjekkForEksisterendeVurderinger = (
        nyVurderingsversjon: Vurderingsversjon
    ): Promise<PerioderMedEndringResponse> =>
        postEndreVurderingDryRun(
            endreVurderingLink.href,
            endreVurderingLink.requestPayload.behandlingUuid,
            vurderingsid,
            nyVurderingsversjon,
            httpErrorHandler,
            httpCanceler.token
        );

    const advarOmEksisterendeVurderinger = (
        nyVurderingsversjon: Vurderingsversjon,
        perioderMedEndringValue: PeriodeMedEndring[]
    ) => {
        dispatch({
            type: ActionType.ADVAR_OM_EKSISTERENDE_VURDERINGER,
            perioderMedEndring: perioderMedEndringValue,
            vurderingsversjonTilLagringFraModal: nyVurderingsversjon,
        });
    };

    const initializePerioderMedEndringer = (perioderMedEndringResponse: PerioderMedEndringResponse) =>
        perioderMedEndringResponse.perioderMedEndringer.map(({ periode: { fom, tom }, ...otherFields }) => ({
            periode: new Period(fom, tom),
            ...otherFields,
        }));

    const beOmBekreftelseFørLagringHvisNødvendig = (nyVurderingsversjon: Vurderingsversjon) => {
        dispatch({ type: ActionType.SJEKK_FOR_EKSISTERENDE_VURDERINGER_PÅBEGYNT });
        const nyVurderingsversjonMedVersjonId = { ...nyVurderingsversjon, versjon: vurderingsversjonId };
        sjekkForEksisterendeVurderinger(nyVurderingsversjonMedVersjonId).then(
            (perioderMedEndringerResponse) => {
                const perioderMedEndringer = initializePerioderMedEndringer(perioderMedEndringerResponse);
                const harOverlappendePerioder = perioderMedEndringer?.length > 0;
                if (harOverlappendePerioder) {
                    advarOmEksisterendeVurderinger(nyVurderingsversjonMedVersjonId, perioderMedEndringer);
                } else {
                    endreVurdering(nyVurderingsversjonMedVersjonId);
                }
            },
            () => {
                dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
            }
        );
    };

    function hentDataTilVurdering(): Promise<Dokument[]> {
        if (!dataTilVurderingUrl) {
            return new Promise((resolve) => resolve([]));
        }
        return get(dataTilVurderingUrl, httpErrorHandler, { cancelToken: httpCanceler.token });
    }

    const handleHentDataTilVurderingError = () => {
        dispatch({ type: ActionType.HENT_DATA_TIL_VURDERING_HAR_FEILET });
    };

    React.useEffect(() => {
        let isMounted = true;
        dispatch({ type: ActionType.HENT_DATA_TIL_VURDERING });
        hentDataTilVurdering()
            .then((dokumenterResponse: Dokument[]) => {
                if (isMounted) {
                    dispatch({ type: ActionType.HENTET_DATA_TIL_VURDERING, dokumenter: dokumenterResponse });
                }
            })
            .catch(handleHentDataTilVurderingError);

        return () => {
            isMounted = false;
            httpCanceler.cancel();
        };
    }, []);

    const isSubmitting = lagringAvVurderingPågår || sjekkForEksisterendeVurderingerPågår;
    return (
        <PageContainer isLoading={hentDataTilVurderingPågår} hasError={hentDataTilVurderingHarFeilet} preventUnmount>
            {lagreVurderingHarFeilet && (
                <Box marginBottom={Margin.medium}>
                    <LagreVurderingFeiletMelding />
                </Box>
            )}
            {formRenderer(dokumenter, beOmBekreftelseFørLagringHvisNødvendig, isSubmitting)}
            {lagreVurderingHarFeilet && (
                <Box marginTop={Margin.medium}>
                    <LagreVurderingFeiletMelding />
                </Box>
            )}
            <OverlappendePeriodeModal
                appElementId="app"
                perioderMedEndring={perioderMedEndring || []}
                onCancel={() => dispatch({ type: ActionType.LAGRING_AV_VURDERING_AVBRUTT })}
                onConfirm={() => {
                    endreVurdering(vurderingsversjonTilLagringFraModal).then(() => {
                        dispatch({ type: ActionType.VURDERING_LAGRET, perioderMedEndring });
                    });
                }}
                isOpen={overlappendePeriodeModalOpen}
                isSubmitting={lagringAvVurderingPågår}
            />
        </PageContainer>
    );
};

export default EndreVurderingController;
