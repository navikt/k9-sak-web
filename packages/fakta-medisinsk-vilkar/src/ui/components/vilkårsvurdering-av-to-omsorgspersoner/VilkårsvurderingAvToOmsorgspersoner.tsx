import { get } from '@navikt/k9-http-utils';
import { Period } from '@navikt/k9-period-utils';
import { NavigationWithDetailView, PageContainer, Box, Margin } from '@navikt/k9-react-components';
import React, { useMemo } from 'react';
import axios from 'axios';
import Step, { StepId, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { finnNesteSteg } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoversiktMessages from '../vurderingsoversikt-messages/VurderingsoversiktMessages';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';
import Vurderingsdetaljer from '../vurderingsdetaljer/Vurderingsdetaljer';

interface VilkårsvurderingAvToOmsorgspersonerProps {
    navigerTilNesteSteg: (steg: Step) => void;
    hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
    sykdomsstegStatus: SykdomsstegStatusResponse;
}

const VilkårsvurderingAvToOmsorgspersoner = ({
    navigerTilNesteSteg,
    hentSykdomsstegStatus,
    sykdomsstegStatus,
}: VilkårsvurderingAvToOmsorgspersonerProps): JSX.Element => {
    const { endpoints, onFinished, httpErrorHandler, readOnly } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
        visVurderingDetails: false,
        isLoading: true,
        vurderingsoversikt: null,
        valgtVurderingselement: null,
        vurderingsoversiktFeilet: false,
        skalViseRadForNyVurdering: false,
    });

    const {
        vurderingsoversikt,
        isLoading,
        visVurderingDetails,
        valgtVurderingselement,
        vurderingsoversiktFeilet,
        skalViseRadForNyVurdering,
    } = state;

    const { manglerGodkjentLegeerklæring } = sykdomsstegStatus;
    const harGyldigSignatur = !manglerGodkjentLegeerklæring;

    const getVurderingsoversikt = () =>
        get<Vurderingsoversikt>(endpoints.vurderingsoversiktBehovForToOmsorgspersoner, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });

    const visVurderingsoversikt = (nyVurderingsoversikt: Vurderingsoversikt) => {
        dispatch({ type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt: nyVurderingsoversikt });
    };

    const handleError = () => {
        dispatch({ type: ActionType.VURDERINGSOVERSIKT_FEILET });
    };

    const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
        dispatch({ type: ActionType.VIS_NY_VURDERING_FORM, resterendeVurderingsperioder });
    };

    const onAvbryt = () => {
        dispatch({
            type: ActionType.AVBRYT_FORM,
        });
    };

    const åpneFørstePeriodeSomMåBehandles = (nyVurderingsoversikt: Vurderingsoversikt) => {
        const harEnPeriodeSomMåBehandles = nyVurderingsoversikt?.resterendeVurderingsperioder?.length > 0;
        if (harEnPeriodeSomMåBehandles) {
            visNyVurderingForm(nyVurderingsoversikt.resterendeVurderingsperioder);
        }
    };

    React.useEffect(() => {
        let isMounted = true;
        getVurderingsoversikt()
            .then((vurderingsoversiktData) => {
                if (isMounted) {
                    const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
                    visVurderingsoversikt(nyVurderingsoversikt);
                    åpneFørstePeriodeSomMåBehandles(nyVurderingsoversikt);
                }
            })
            .catch(handleError);
        return () => {
            isMounted = false;
            httpCanceler.cancel();
        };
    }, []);

    const velgVurderingselement = (nyvalgtVurderingselement: Vurderingselement) => {
        dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyvalgtVurderingselement });
    };

    const oppdaterVurderingsoversikt = () => {
        dispatch({ type: ActionType.PENDING });
        getVurderingsoversikt().then((vurderingsoversiktData) => {
            const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
            visVurderingsoversikt(nyVurderingsoversikt);
        });
    };

    const onVurderingLagret = () => {
        dispatch({ type: ActionType.PENDING });
        hentSykdomsstegStatus().then((status) => {
            if (status.kanLøseAksjonspunkt) {
                onFinished();
                return;
            }

            const nesteSteg = finnNesteSteg(status);
            if (nesteSteg === toOmsorgspersonerSteg || nesteSteg === null) {
                oppdaterVurderingsoversikt();
            } else if (nesteSteg !== null) {
                navigerTilNesteSteg(nesteSteg);
            }
        });
    };

    const setMargin = () => {
        if (vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur) {
            return Margin.medium;
        }
        return null;
    };

    const skalViseValgfriePerioder = !readOnly && vurderingsoversikt?.resterendeValgfrieVurderingsperioder.length > 0;

    const skalViseOpprettVurderingKnapp =
        !vurderingsoversikt?.harPerioderSomSkalVurderes() && !skalViseRadForNyVurdering && harGyldigSignatur;

    const skalViseNyVurderingForm = visVurderingDetails && !valgtVurderingselement;

    return (
        <PageContainer hasError={vurderingsoversiktFeilet} isLoading={isLoading} key={StepId.ToOmsorgspersoner}>
            <VurderingsoversiktMessages vurderingsoversikt={vurderingsoversikt} harGyldigSignatur={harGyldigSignatur} />
            {vurderingsoversikt?.harPerioderÅVise() && (
                <Box marginTop={setMargin()}>
                    <NavigationWithDetailView
                        navigationSection={() => {
                            if (vurderingsoversikt.harPerioderÅVise()) {
                                return (
                                    <Vurderingsnavigasjon
                                        vurderingselementer={vurderingsoversikt?.vurderingselementer}
                                        resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                                        onVurderingValgt={velgVurderingselement}
                                        onNyVurderingClick={visNyVurderingForm}
                                        visRadForNyVurdering={skalViseRadForNyVurdering}
                                        visOpprettVurderingKnapp={skalViseOpprettVurderingKnapp}
                                        resterendeValgfrieVurderingsperioder={
                                            skalViseValgfriePerioder
                                                ? vurderingsoversikt?.resterendeValgfrieVurderingsperioder
                                                : []
                                        }
                                    />
                                );
                            }
                            return null;
                        }}
                        showDetailSection={visVurderingDetails}
                        detailSection={() => (
                            <Vurderingsdetaljer
                                vurderingsoversikt={vurderingsoversikt}
                                valgtVurderingselement={valgtVurderingselement}
                                radForNyVurderingVises={skalViseRadForNyVurdering}
                                nyVurderingFormVises={skalViseNyVurderingForm}
                                onVurderingLagret={onVurderingLagret}
                                onAvbryt={onAvbryt}
                            />
                        )}
                    />
                </Box>
            )}
        </PageContainer>
    );
};

export default VilkårsvurderingAvToOmsorgspersoner;
