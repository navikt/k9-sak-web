export type Feilmelding = {
  message: string;
  additionalInfo?: {
    feilmelding: string;
    url: string;
  };
};
