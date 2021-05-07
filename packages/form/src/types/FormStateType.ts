export interface FormStateType {
  getState: (string) => string;
  deleteState: (string) => void;
  setState: (string, object) => void;
}
