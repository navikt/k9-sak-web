import { httpUtils } from '@fpsak-frontend/utils';
import { render, screen, waitFor } from '@testing-library/react';
import ContainerContext from '../../../context/ContainerContext';
import VurderingsdetaljerFetcher from '../VurderingsdetaljerFetcher';

const mockedContent = 'mockedContent';
const mockedUrl = 'mockedUrl';
const httpErrorHandlerMock = () => null;

const vurderingMock = {
  versjoner: [],
  annenInformasjon: {
    resterendeVurderingsperioder: [],
    perioderSomKanVurderes: [],
  },
};

const contextWrapper = ui =>
  render(
    <ContainerContext.Provider
      value={
        {
          httpErrorHandler: httpErrorHandlerMock,
        } as any
      }
    >
      {ui}
    </ContainerContext.Provider>,
  );

const renderVurderingsdetaljerFetcher = () =>
  contextWrapper(<VurderingsdetaljerFetcher url={mockedUrl} contentRenderer={() => <span>{mockedContent}</span>} />);

describe('VurderingsdetaljerFetcher', () => {
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

  it('should render a spinner while data is being fetched, and render specified content after data has been recieved', async () => {
    mockResolvedGetApiCallOnce(vurderingMock);
    const { getByText } = renderVurderingsdetaljerFetcher();
    expect(getByText('venter', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText(mockedContent)).toBeNull();
    await waitFor(() => expect(getByText(mockedContent)).toBeInTheDocument());
  });

  it('should render a spinner while data is being fetched, and render an error message when http call has failed', async () => {
    mockRejectedGetApiCallOnce();
    const { getByText, queryByText } = renderVurderingsdetaljerFetcher();
    expect(getByText('venter', { exact: false })).toBeInTheDocument();
    expect(queryByText(mockedContent)).toBeNull();
    await waitFor(() => {
      expect(getByText(/Noe gikk galt, vennligst prøv igjen senere/i)).toBeInTheDocument();
      expect(queryByText(mockedContent)).toBeNull();
    });
  });
});
