import { safeJSONParse } from '@fpsak-frontend/utils';

const state = {};

const getState = (key: string) => safeJSONParse(state[key]);

const deleteState = (key: string) => {
  delete state[key];
};

const setState = (key: string, data: any) => {
  state[key] = JSON.stringify(data);
};

export default {
  getState,
  deleteState,
  setState,
};
