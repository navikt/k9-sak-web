enum RestApiState {
  NOT_STARTED = 'NOT_STARTED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NO_PATH = 'NO_PATH',
}

export default RestApiState;

export const isRequestNotDone = (state: RestApiState): boolean =>
  state === RestApiState.NOT_STARTED || state === RestApiState.LOADING;

export const isRequestNotToBeDone = (state: RestApiState): boolean =>
  state == RestApiState.NO_PATH;
