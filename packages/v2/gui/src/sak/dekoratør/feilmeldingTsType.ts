/**
 * @deprecated Skal erstattast med AdditionalInfoError
 */
export type Feilmelding = {
  message: string;
  additionalInfo?: {
    feilmelding: string;
    url: string;
  };
};
