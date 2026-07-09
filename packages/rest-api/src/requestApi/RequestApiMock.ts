import AbstractRequestApi from './AbstractRequestApi';
import RequestRunner from './RequestRunner';

/**
 * RequestApi
 *
 * Denne klassen opprettes med en referanse til et HttpClientApi (for eksempel Axios), context-path og konfig for
 * de enkelte endepunktene. Det blir så satt opp RequestRunner's for endepunktene. Desse kan hentes via metoden @see getRequestRunner.
 */
class RequestApiMock extends AbstractRequestApi {
  mockdata: { [key: string]: RequestRunner } = {};

  execData: { endpointName: string; params: any }[] = [];

  missingPaths: string[] = [];

  public startRequest = (endpointName: string, params?: any): any => {
    const data = this.mockdata[endpointName];
    if (!data) {
      throw new Error(`Det er ikke satt opp mock-data for endepunkt ${endpointName}`);
    }
    this.execData.push({
      endpointName,
      params,
    });
    return data;
  };

  public hasPath = (endpointName: string): boolean => !this.missingPaths.some(p => p === endpointName);

  public setLinks = () => {};

  public setRequestPendingHandler = () => {};

  public setAddErrorMessageHandler = () => {};

  public resetCache = () => {};

  public isMock = () => true;

  public mock = (endpointName: string, data?: any): void => {
    if (Object.keys(this.mockdata).includes(endpointName)) {
      throw new Error(`Det er satt opp mock-data for endepunkt ${endpointName} allerede`);
    }

    this.mockdata = {
      ...this.mockdata,
      [endpointName]: data || {},
    };
  };

  public getRequestMockData = (endpointName: string) =>
    this.execData
      .filter(d => d.endpointName === endpointName)
      .map(d => ({
        params: d.params,
      }));

  public setMissingPath = (endpointName: string) => {
    this.missingPaths.push(endpointName);
  };

  public clearMockData = (endpointName: string) => {
    delete this.mockdata[endpointName];
    this.execData = [...this.execData.filter(d => d.endpointName !== endpointName)];
  };

  public clearAllMockData = () => {
    this.mockdata = {};
    this.execData = [];
    this.missingPaths = [];
  };
}

export default RequestApiMock;
