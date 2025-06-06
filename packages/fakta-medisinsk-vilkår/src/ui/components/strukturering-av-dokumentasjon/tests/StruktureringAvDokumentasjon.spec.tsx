import { httpUtils } from '@fpsak-frontend/utils';
import { render, waitFor } from '@testing-library/react';
import ContainerContext from '../../../context/ContainerContext';
import StruktureringAvDokumentasjon from '../StruktureringAvDokumentasjon';

const dokumentoversiktEndpoint = 'mockedDokumentoversiktEndpoint';
const dokumentoversiktMock = {
  dokumenter: [],
};

const httpErrorHandlerMock = () => null;

const contextWrapper = ui =>
  render(
    <ContainerContext.Provider
      value={
        {
          endpoints: { dokumentoversikt: dokumentoversiktEndpoint },
          httpErrorHandler: httpErrorHandlerMock,
          readOnly: false,
        } as any
      }
    >
      {ui}
    </ContainerContext.Provider>,
  );

const navigerTilNesteStegMock = {
  fn: () => null,
};

const getFunctionThatReturnsAResolvedPromise = data => () =>
  new Promise(resolve => {
    resolve(data);
  });

const sykdomsstegFerdigStatusMock = {
  fn: getFunctionThatReturnsAResolvedPromise({ kanLøseAksjonspunkt: true }),
};

const sykdomsstegDokumentUferdigStatusMock = {
  fn: getFunctionThatReturnsAResolvedPromise({ kanLøseAksjonspunkt: false, harUklassifiserteDokumenter: true }),
};

const sykdomsstegKTPUferdigStatusMock = {
  fn: getFunctionThatReturnsAResolvedPromise({
    kanLøseAksjonspunkt: false,
    harUklassifiserteDokumenter: false,
    manglerVurderingAvKontinuerligTilsynOgPleie: true,
  }),
};

const renderVilkårsvurderingComponent = (
  kanLøseAksjonspunkt?: boolean,
  harUklassifiserteDokumenter?: boolean,
  manglerKTPVurdering?: boolean,
) => {
  let hentSykdomsstegStatusMock = sykdomsstegFerdigStatusMock;
  if (kanLøseAksjonspunkt) {
    hentSykdomsstegStatusMock = sykdomsstegFerdigStatusMock;
  }
  if (harUklassifiserteDokumenter) {
    hentSykdomsstegStatusMock = sykdomsstegDokumentUferdigStatusMock;
  }
  if (manglerKTPVurdering) {
    hentSykdomsstegStatusMock = sykdomsstegKTPUferdigStatusMock;
  }

  return contextWrapper(
    <StruktureringAvDokumentasjon
      navigerTilNesteSteg={navigerTilNesteStegMock.fn}
      sykdomsstegStatus={{ manglerGodkjentLegeerklæring: false } as any}
      hentSykdomsstegStatus={hentSykdomsstegStatusMock.fn as any}
    />,
  );
};

describe('StruktureringAvDokumentasjon', () => {
  let httpGetSpy = null;

  beforeAll(() => {
    httpGetSpy = vi.spyOn(httpUtils, 'get');
  });

  const mockResolvedGetApiCallOnce = data => {
    httpGetSpy.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolve(data);
        }),
    );
  };

  const mockRejectedGetApiCallOnce = () => {
    httpGetSpy.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          reject();
        }),
    );
  };

  describe('when dokumentoversikt-http call is successful and data is in the expected format', () => {
    it('should render vurderingsoversikt presentation properly during and after the data has been fetched', async () => {
      mockResolvedGetApiCallOnce(dokumentoversiktMock);
      const { getByText } = renderVilkårsvurderingComponent();
      expect(getByText('venter', { exact: false })).toBeInTheDocument();
      await waitFor(() => expect(getByText(/Ingen dokumenter å vise/i)).toBeInTheDocument());
    });
  });

  describe('when dokumentoversikt-http call is successful, but data is not in the expected format', () => {
    it('should render vurderingsoversikt presentation properly after error handling', async () => {
      mockResolvedGetApiCallOnce({});
      const { getByText } = renderVilkårsvurderingComponent();
      expect(getByText('venter', { exact: false })).toBeInTheDocument();
      await waitFor(() => expect(getByText(/Noe gikk galt, vennligst prøv igjen senere/i)).toBeInTheDocument());
    });
  });

  describe('when dokumentoversikt-http call fails', () => {
    it('should render vurderingsoversikt properly after error handling', async () => {
      mockRejectedGetApiCallOnce();
      const { getByText } = renderVilkårsvurderingComponent();
      expect(getByText('venter', { exact: false })).toBeInTheDocument();
      await waitFor(() => expect(getByText(/Noe gikk galt, vennligst prøv igjen senere/i)).toBeInTheDocument());
    });
  });
});
