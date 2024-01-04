export interface FormState {
  getState: (string) => string;
  deleteState: (string) => void;
  setState: (string, object) => void;
}
