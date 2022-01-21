import * as httpUtils from '@navikt/k9-http-utils';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import ContainerContract from '../../../../types/ContainerContract';
import ContainerContext from '../../../context/ContainerContext';
import queryClient from '../../../context/queryClient';
import MedisinskVilkår from '../MedisinskVilkår';

jest.mock('nav-frontend-modal');

const statusEndpointMock = 'statusEndpointMock';

const vurderingsoversiktMock = {
    perioderSomKanVurderes: [],
    resterendeVurderingsperioder: [{ fom: '2028-01-01', tom: '2028-01-01' }],
    resterendeValgfrieVurderingsperioder: [],
    søknadsperioderTilBehandling: [],
    vurderingselementer: [],
    links: [],
} as any;

const httpErrorHandlerMock = () => null;
const contextWrapper = (ui, contextValues?: Partial<ContainerContract>) =>
    render(
        <QueryClientProvider client={queryClient}>
            <ContainerContext.Provider
                value={
                    {
                        httpErrorHandler: httpErrorHandlerMock,
                        endpoints: { status: statusEndpointMock },
                        ...contextValues,
                    } as any
                }
            >
                {ui}
            </ContainerContext.Provider>
        </QueryClientProvider>
    );

const renderMedisinskVilkår = (contextValues?: Partial<ContainerContract>) =>
    contextWrapper(<MedisinskVilkår />, contextValues);

describe('MedisinskVilkår', () => {
    let httpGetSpy = null;

    beforeAll(() => {
        httpGetSpy = jest.spyOn(httpUtils, 'get');
    });

    const mockResolvedGetApiCall = (data) => {
        httpGetSpy.mockImplementation(() => new Promise((resolve) => resolve(data)));
    };

    it('should render spinner while getting sykdomsstegStatus, then render Infostripe with text when data has been received', async () => {
        mockResolvedGetApiCall({ manglerDiagnosekode: true });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Sykdomsvurderingen gjelder barnet og er felles for alle parter./)).toBeInTheDocument();
        });
    });

    it('should activate dokument-step by default when that is the step that needs work next', async () => {
        mockResolvedGetApiCall({ manglerGodkjentLegeerklæring: true, dokumenter: [] });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Ingen dokumenter å vise/i)).toBeInTheDocument();
        });
    });

    it('should activate ktp-step by default when that is the step that needs work next', async () => {
        mockResolvedGetApiCall({ manglerVurderingAvKontinuerligTilsynOgPleie: true, ...vurderingsoversiktMock });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Vurdering av tilsyn og pleie/i)).toBeInTheDocument();
        });
    });

    it('should activate to omsorgspersoner-step by default when that is the step that needs work next', async () => {
        mockResolvedGetApiCall({ manglerVurderingAvToOmsorgspersoner: true, ...vurderingsoversiktMock });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Vurdering av to omsorgspersoner/i)).toBeInTheDocument();
        });
    });

    it('should render Fortsett-button if aksjonspunkt is solveable and user is in KTP or 2OP step, but hidden in dokument step', async () => {
        mockResolvedGetApiCall({
            kanLøseAksjonspunkt: true,
            ...vurderingsoversiktMock,
        });
        const { getByText, getAllByText, queryByText } = renderMedisinskVilkår({
            readOnly: false,
            visFortsettknapp: true,
        });
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(async () => {
            expect(queryByText(/Sykdom er ferdig vurdert og du kan gå videre i behandlingen/i)).toBeNull();
            expect(queryByText(/OBS! Det er gjort endringer i sykdomssteget/i)).toBeNull();
            userEvent.click(getAllByText(/Tilsyn og pleie/i)[0]);
            expect(getByText(/Sykdom er ferdig vurdert og du kan gå videre i behandlingen/i)).toBeInTheDocument();
            userEvent.click(getAllByText(/To omsorgspersoner/i)[0]);
            expect(getByText(/Sykdom er ferdig vurdert og du kan gå videre i behandlingen/i)).toBeInTheDocument();
        });
    });

    it('should render Fortsett-button with warning message if harDataSomIkkeHarBlittTattMedIBehandling while aksjonspunkt is not active', async () => {
        mockResolvedGetApiCall({
            kanLøseAksjonspunkt: true,
            harDataSomIkkeHarBlittTattMedIBehandling: true,
            ...vurderingsoversiktMock,
        });
        const { getByText, getAllByText } = renderMedisinskVilkår({
            readOnly: false,
            visFortsettknapp: false,
        });
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(async () => {
            expect(getByText(/OBS! Det er gjort endringer i sykdomssteget/i)).toBeInTheDocument();
            userEvent.click(getAllByText(/Tilsyn og pleie/i)[0]);
            expect(getByText(/OBS! Det er gjort endringer i sykdomssteget/i)).toBeInTheDocument();
            userEvent.click(getAllByText(/To omsorgspersoner/i)[0]);
            expect(getByText(/OBS! Det er gjort endringer i sykdomssteget/i)).toBeInTheDocument();
        });
    });

    it('should call the provided onFinished-function when clicking standard Fortsett-button to solve aksjonspunkt', async () => {
        const onFinishedWrapper = { onFinished: () => null };
        const onFinishedSpy = jest.spyOn(onFinishedWrapper, 'onFinished');

        mockResolvedGetApiCall({
            kanLøseAksjonspunkt: true,
            ...vurderingsoversiktMock,
        });
        const { getByText, getAllByText } = renderMedisinskVilkår({
            readOnly: false,
            visFortsettknapp: true,
            onFinished: onFinishedWrapper.onFinished,
        });
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(async () => {
            userEvent.click(getAllByText(/Tilsyn og pleie/i)[0]);
            expect(onFinishedSpy).not.toHaveBeenCalled();
            userEvent.click(getAllByText(/Fortsett/i)[0]);
            expect(onFinishedSpy).toHaveBeenCalled();
        });
    });

    it('should call the provided onFinished-function when clicking Fortsett-button with warning message to solve aksjonspunkt', async () => {
        const onFinishedWrapper = { onFinished: () => null };
        const onFinishedSpy = jest.spyOn(onFinishedWrapper, 'onFinished');

        mockResolvedGetApiCall({
            kanLøseAksjonspunkt: true,
            harDataSomIkkeHarBlittTattMedIBehandling: true,
            ...vurderingsoversiktMock,
        });
        const { getByText, getAllByText } = renderMedisinskVilkår({
            readOnly: false,
            visFortsettknapp: false,
        });
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(async () => {
            expect(onFinishedSpy).not.toHaveBeenCalled();
            userEvent.click(getAllByText(/Fortsett/i)[0]);
        });
    });
});
