enum ResponseCacheStatus {
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
}

class ResponseCache {
  cache: { [key: string]: { status: ResponseCacheStatus; data: any } } = {};

  public addData = (endpointName: string, data: any): void => {
    this.cache = {
      ...this.cache,
      [endpointName]: { status: ResponseCacheStatus.FETCHED, data },
    };
  };

  public setToFetching = (endpointName: string): void => {
    this.cache = {
      ...this.cache,
      [endpointName]: { status: ResponseCacheStatus.FETCHING, data: undefined },
    };
  };

  public getData = (endpointName: string): any =>
    this.cache[endpointName] ? this.cache[endpointName].data : undefined;

  public hasFetched = (endpointName: string): boolean =>
    this.cache[endpointName] && this.cache[endpointName].status === ResponseCacheStatus.FETCHED;

  public isFetching = (endpointName: string): boolean =>
    this.cache[endpointName] && this.cache[endpointName].status === ResponseCacheStatus.FETCHING;
}

export default ResponseCache;
