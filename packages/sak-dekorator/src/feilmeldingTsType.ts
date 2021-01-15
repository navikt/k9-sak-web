type Feilmelding = {
  message: string;
  additionalInfo?: {
    feilmelding: string;
    url: string;
  };
};

export default Feilmelding;
