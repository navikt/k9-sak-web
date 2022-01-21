import { get } from '@navikt/k9-http-utils';
import { Period } from '@navikt/k9-period-utils';
import { PageContainer, Box, Margin } from '@navikt/k9-react-components';
import React, { useMemo } from 'react';
import axios from 'axios';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { PeriodeMedEndring, PerioderMedEndringResponse } from '../../../types/PeriodeMedEndring';
import OverlappendePeriodeModal from '../overlappende-periode-modal/OverlappendePeriodeModal';
import ActionType from './actionTypes';
import vurderingControllerReducer from './reducer';
import { postNyVurdering, postNyVurderingDryRun } from '../../../api/api';
import ContainerContext from '../../context/ContainerContext';
import scrollUp from '../../../util/viewUtils';
import VurderingContext from '../../context/VurderingContext';
import LagreVurderingFeiletMelding from '../lagre-vurdering-feilet-melding/LagreVurderingFeiletMelding';

interface NyVurderingControllerProps {
    opprettVurderingLink: Link;
    dataTilVurderingUrl: string;
    onVurderingLagret: () => void;
    formRenderer: (
        dokumenter: Dokument[],
        onSubmit: (vurderingsversjon: Vurderingsversjon) => void,
        isSubmitting: boolean
    ) => React.ReactNode;
}

const NyVurderingController = ({
    opprettVurderingLink,
    dataTilVurderingUrl,
    onVurderingLagret,
    formRenderer,
}: NyVurderingControllerProps): JSX.Element => {
    const { httpErrorHandler } = React.useContext(ContainerContext);
    const { vurderingstype } = React.useContext(VurderingContext);

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

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        dispatch({ type: ActionType.LAGRING_AV_VURDERING_PÅBEGYNT });
        return postNyVurdering(
            opprettVurderingLink.href,
            opprettVurderingLink.requestPayload.behandlingUuid,
            { ...nyVurderingsversjon, type: vurderingstype },
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
        postNyVurderingDryRun(
            opprettVurderingLink.href,
            opprettVurderingLink.requestPayload.behandlingUuid,
            { ...nyVurderingsversjon, type: vurderingstype },
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
        sjekkForEksisterendeVurderinger(nyVurderingsversjon).then(
            (perioderMedEndringerResponse) => {
                const perioderMedEndringer = initializePerioderMedEndringer(perioderMedEndringerResponse);
                const harOverlappendePerioder = perioderMedEndringer?.length > 0;
                if (harOverlappendePerioder) {
                    advarOmEksisterendeVurderinger(nyVurderingsversjon, perioderMedEndringer);
                } else {
                    lagreVurdering(nyVurderingsversjon);
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
            <OverlappendePeriodeModal
                appElementId="app"
                perioderMedEndring={perioderMedEndring || []}
                onCancel={() => dispatch({ type: ActionType.LAGRING_AV_VURDERING_AVBRUTT })}
                onConfirm={() => {
                    lagreVurdering(vurderingsversjonTilLagringFraModal).then(() => {
                        dispatch({ type: ActionType.VURDERING_LAGRET, perioderMedEndring });
                    });
                }}
                isOpen={overlappendePeriodeModalOpen}
                isSubmitting={lagringAvVurderingPågår}
            />
        </PageContainer>
    );
};

export default NyVurderingController;
