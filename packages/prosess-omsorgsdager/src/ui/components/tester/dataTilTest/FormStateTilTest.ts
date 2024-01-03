export default {
  getState: () => '',
  setState: (key, data) => console.log('setState', key, data),
  deleteState: key => console.log('deleteState', key),
};
