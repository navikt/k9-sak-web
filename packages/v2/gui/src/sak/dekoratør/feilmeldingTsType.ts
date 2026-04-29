/**
 * @deprecated Skal erstattast med AdditionalInfoError
 */
export type Feilmelding = {
  message: string;
  additionalInfo?: Record<string, string>;
};
