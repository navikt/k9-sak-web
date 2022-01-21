import React from 'react';
import axios from 'axios';
import * as httpUtils from '@navikt/k9-http-utils';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import VilkårsvurderingAvToOmsorgspersoner from '../VilkårsvurderingAvToOmsorgspersoner';
import ContainerContext from '../../../context/ContainerContext';
import VurderingContext from '../../../context/VurderingContext';
import Vurderingstype from '../../../../types/Vurderingstype';
import { dokumentSteg } from '../../../../types/Step';

const vurderingsoversiktEndpoint = 'vurderingsoversikt-mock';
const vurderingsopprettelseEndpoint = 'vurderingsopprettelse-mock';

const httpErrorHandlerMock = () => null;
const cancelTokenMock = { cancelToken: 'foo' };

jest.mock('nav-frontend-modal');

const vurderingsoversiktMock = {
    perioderSomKanVurderes: [],
    resterendeVurderingsperioder: [],
    resterendeValgfrieVurderingsperioder: [],
    søknadsperioderTilBehandling: [],
    vurderingselementer: [],
    links: [
        {
            rel: 'sykdom-vurdering-opprettelse',
            href: vurderingsopprettelseEndpoint,
            requestPayload: {
                behandlingUuid: 'foo',
            },
        },
    ],
} as any;

window.scroll = () => null;

const onFinishedMock = {
    fn: () => null,
};

const contextWrapper = (ui) =>
    render(
        <ContainerContext.Provider
            value={
                {
                    endpoints: { vurderingsoversiktBehovForToOmsorgspersoner: vurderingsoversiktEndpoint },
                    httpErrorHandler: httpErrorHandlerMock,
                    readOnly: false,
                    onFinished: onFinishedMock.fn,
                } as any
            }
        >
            <VurderingContext.Provider value={{ vurderingstype: Vurderingstype.TO_OMSORGSPERSONER }}>
                {ui}
            </VurderingContext.Provider>
        </ContainerContext.Provider>
    );

const navigerTilNesteStegMock = {
    fn: () => null,
};

const getFunctionThatReturnsAResolvedPromise = (data) => () => new Promise((resolve) => resolve(data));

const sykdomsstegFerdigStatusMock = {
    fn: getFunctionThatReturnsAResolvedPromise({ kanLøseAksjonspunkt: true }),
};

const sykdomsstegDokumentUferdigStatusMock = {
    fn: getFunctionThatReturnsAResolvedPromise({ kanLøseAksjonspunkt: false, harUklassifiserteDokumenter: true }),
};

const sykdomsstegToOmsorgspersonerUferdigStatusMock = {
    fn: getFunctionThatReturnsAResolvedPromise({
        kanLøseAksjonspunkt: false,
        harUklassifiserteDokumenter: false,
        manglerVurderingAvToOmsorgspersoner: true,
    }),
};

const renderVilkårsvurderingComponent = (
    kanLøseAksjonspunkt?: boolean,
    harUklassifiserteDokumenter?: boolean,
    manglerToOmsorgspersonerVurdering?: boolean
) => {
    let hentSykdomsstegStatusMock = sykdomsstegFerdigStatusMock;
    if (kanLøseAksjonspunkt) {
        hentSykdomsstegStatusMock = sykdomsstegFerdigStatusMock;
    }
    if (harUklassifiserteDokumenter) {
        hentSykdomsstegStatusMock = sykdomsstegDokumentUferdigStatusMock;
    }
    if (manglerToOmsorgspersonerVurdering) {
        hentSykdomsstegStatusMock = sykdomsstegToOmsorgspersonerUferdigStatusMock;
    }

    return contextWrapper(
        <VilkårsvurderingAvToOmsorgspersoner
            navigerTilNesteSteg={navigerTilNesteStegMock.fn}
            sykdomsstegStatus={{ manglerGodkjentLegeerklæring: false } as any}
            hentSykdomsstegStatus={hentSykdomsstegStatusMock.fn as any}
        />
    );
};

describe('VilkårsvurderingAvToOmsorgspersoner', () => {
    let httpGetSpy = null;
    let httpPostSpy = null;

    let sykdomsstegFerdigStatusSpy = null;
    let sykdomsstegDokumentUferdigStatusSpy = null;
    let sykdomsstegToOmsorgspersonerUferdigStatusSpy = null;

    let navigerTilNesteStegSpy = null;
    let onFinishedSpy = null;

    beforeAll(() => {
        httpGetSpy = jest.spyOn(httpUtils, 'get');
        httpPostSpy = jest.spyOn(httpUtils, 'post');

        const mock = jest.spyOn(axios.CancelToken, 'source');
        mock.mockImplementation(
            () =>
                ({
                    token: cancelTokenMock.cancelToken,
                    cancel: () => null,
                } as any)
        );

        sykdomsstegFerdigStatusSpy = jest.spyOn(sykdomsstegFerdigStatusMock, 'fn');
        sykdomsstegDokumentUferdigStatusSpy = jest.spyOn(sykdomsstegDokumentUferdigStatusMock, 'fn');
        sykdomsstegToOmsorgspersonerUferdigStatusSpy = jest.spyOn(sykdomsstegToOmsorgspersonerUferdigStatusMock, 'fn');

        navigerTilNesteStegSpy = jest.spyOn(navigerTilNesteStegMock, 'fn');
        onFinishedSpy = jest.spyOn(onFinishedMock, 'fn');
    });

    const mockResolvedGetApiCallOnce = (data) => {
        httpGetSpy.mockImplementationOnce(() => new Promise((resolve) => resolve(data)));
    };

    const mockRejectedGetApiCallOnce = () => {
        httpGetSpy.mockImplementationOnce(() => new Promise((resolve, reject) => reject()));
    };

    const mockResolvedGetApiCall = (data) => {
        httpGetSpy.mockImplementation(() => new Promise((resolve) => resolve(data)));
    };

    const mockResolvedPostApiCall = (data) => {
        httpPostSpy.mockImplementation(() => new Promise((resolve) => resolve(data)));
    };

    describe('when vurderingsoversikt-http call is successful and data is in the expected format', () => {
        it('should render vurderingsoversikt presentation properly during and after the data has been fetched', async () => {
            mockResolvedGetApiCallOnce(vurderingsoversiktMock);
            const { getByText } = renderVilkårsvurderingComponent();
            expect(getByText(/Venter.../i)).toBeInTheDocument();
            await waitFor(() => expect(getByText(/Ingen perioder å vurdere/i)).toBeInTheDocument());
        });
    });

    describe('when vurderingsoversikt-http call is successful, but data is not in the expected format', () => {
        it('should render vurderingsoversikt presentation properly after error handling', async () => {
            mockResolvedGetApiCallOnce({});
            const { getByText } = renderVilkårsvurderingComponent();
            expect(getByText(/Venter.../i)).toBeInTheDocument();
            await waitFor(() => expect(getByText(/Noe gikk galt, vennligst prøv igjen senere/i)).toBeInTheDocument());
        });
    });

    describe('when vurderingsoversikt-http call fails', () => {
        it('should render vurderingsoversikt properly after error handling', async () => {
            mockRejectedGetApiCallOnce();
            const { getByText } = renderVilkårsvurderingComponent();
            expect(getByText(/Venter.../i)).toBeInTheDocument();
            await waitFor(() => expect(getByText(/Noe gikk galt, vennligst prøv igjen senere/i)).toBeInTheDocument());
        });
    });

    describe('when there are periods that need to be considered', () => {
        beforeEach(() => {
            mockResolvedGetApiCallOnce({
                ...vurderingsoversiktMock,
                resterendeVurderingsperioder: [{ fom: '2028-01-01', tom: '2028-01-01' }],
            });
        });

        it('should open form for periods that need consideration by default', async () => {
            renderVilkårsvurderingComponent();
            await waitFor(() => {
                expect(screen.getByText(/Perioden må vurderes/i)).toBeInTheDocument();
                expect(
                    screen.getByText(/Vurder behov for to omsorgspersoner for 01.01.2028 - 01.01.2028/i)
                ).toBeInTheDocument();
                expect(screen.queryByText('Ny vurdering')).toBeNull();
            });
        });
    });

    describe('when there are no periods that need to be considered', () => {
        beforeEach(() => {
            mockResolvedGetApiCallOnce({
                ...vurderingsoversiktMock,
                vurderingselementer: [{ periode: { fom: '2028-01-01', tom: '2028-01-01' } }],
            });
        });

        it('should open vurdering-form when Ny vurdering-button is clicked, and form should be closeable by clicking Avbryt button', async () => {
            const { getByText, queryByText } = renderVilkårsvurderingComponent();
            await waitFor(() => {
                expect(queryByText(/Vurdering av to omsorgspersoner/)).toBeNull();
                fireEvent.click(screen.getByText('Ny vurdering'));
                expect(getByText(/Vurdering av to omsorgspersoner/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Avbryt/i));
                expect(queryByText(/Vurdering av to omsorgspersoner/)).toBeNull();
            });
        });
    });

    describe('when vurdering form is submitted and it has been saved successfully', () => {
        beforeEach(() => {
            mockResolvedGetApiCall({
                ...vurderingsoversiktMock,
                resterendeVurderingsperioder: [{ fom: '2028-01-01', tom: '2028-01-01' }],
                perioderSomKanVurderes: [{ fom: '2028-01-01', tom: '2028-01-01' }],
            });
        });

        afterEach(() => {
            httpGetSpy.mockClear();
            httpPostSpy.mockClear();
            navigerTilNesteStegSpy.mockClear();
        });

        it('should get new sykdomsstatus after successfully posting vurdering, and when it responds with kanLøseAksjonspunkt=true, it call onFinished()', async () => {
            renderVilkårsvurderingComponent(true);
            await waitFor(async () => {
                const textarea = screen.getByLabelText(/Gjør en vurdering av/i);
                fireEvent.change(textarea, { target: { value: 'Foo Bar Baz' } });
                expect(textarea).toHaveValue('Foo Bar Baz');

                const radio = screen.getByLabelText('Ja');
                fireEvent.click(radio);
            });

            const submitButton = screen.getByText('Bekreft');
            mockResolvedPostApiCall({ perioderMedEndringer: [] });
            fireEvent.click(submitButton);

            await waitFor(() => {
                // one post with dryRun=true, another with dryRun=false
                expect(httpPostSpy).toHaveBeenCalledTimes(2);
                expect(sykdomsstegFerdigStatusSpy).toHaveBeenCalledTimes(1);
                expect(onFinishedSpy).toHaveBeenCalledTimes(1);
            });
        });

        it('should get new sykdomsstatus after successfully posting vurdering, and when it responds with kanLøseAksjonspunkt=false, it should navigate user to whichever step needs work next', async () => {
            renderVilkårsvurderingComponent(false, true);
            await waitFor(async () => {
                const textarea = screen.getByLabelText(/Gjør en vurdering av/i);
                fireEvent.change(textarea, { target: { value: 'Foo Bar Baz' } });
                expect(textarea).toHaveValue('Foo Bar Baz');

                const radio = screen.getByLabelText('Ja');
                fireEvent.click(radio);
            });

            const submitButton = screen.getByText('Bekreft');
            mockResolvedPostApiCall({ perioderMedEndringer: [] });
            fireEvent.click(submitButton);

            await waitFor(() => {
                // one post with dryRun=true, another with dryRun=false
                expect(httpPostSpy).toHaveBeenCalledTimes(2);
                expect(sykdomsstegDokumentUferdigStatusSpy).toHaveBeenCalledTimes(1);
                expect(navigerTilNesteStegSpy).toHaveBeenCalledWith(dokumentSteg);
            });
        });

        it('should get new sykdomsstatus after successfully posting vurdering, and if still not done with to omsorgspersoner, it should get an updated version of vurderingsoversikt data', async () => {
            renderVilkårsvurderingComponent(false, false, true);
            await waitFor(async () => {
                const textarea = screen.getByLabelText(/Gjør en vurdering av/i);
                fireEvent.change(textarea, { target: { value: 'Foo Bar Baz' } });
                expect(textarea).toHaveValue('Foo Bar Baz');

                const radio = screen.getByLabelText('Ja');
                fireEvent.click(radio);
            });

            const submitButton = screen.getByText('Bekreft');
            mockResolvedPostApiCall({ perioderMedEndringer: [] });
            fireEvent.click(submitButton);

            // needed to clear call-count in mock before verifying that oppdaterVurderingsoversikt api-call is being done
            httpGetSpy.mockClear();

            await waitFor(() => {
                // one post with dryRun=true, another with dryRun=false
                expect(httpPostSpy).toHaveBeenCalledTimes(2);
                expect(sykdomsstegToOmsorgspersonerUferdigStatusSpy).toHaveBeenCalledTimes(1);

                expect(httpGetSpy).toHaveBeenCalledTimes(1);
                expect(httpGetSpy).toHaveBeenCalledWith(
                    vurderingsoversiktEndpoint,
                    httpErrorHandlerMock,
                    cancelTokenMock
                );
            });
        });
    });
});
