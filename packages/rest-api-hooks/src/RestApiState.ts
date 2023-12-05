enum RestApiState {
  NOT_STARTED = 'NOT_STARTED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export default RestApiState;

export const isRequestNotDone = (state: RestApiState): boolean =>
  state === RestApiState.NOT_STARTED || state === RestApiState.LOADING;
