export interface Adresse {
  adresseType: string;
  adresselinje1: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postNummer?: string;
  poststed?: string;
  land?: string;
}

export type BostedSokerPersonopplysninger = {
  navn: string;
  adresser: Adresse[];
  sivilstand: string;
  region: string;
  personstatus: string;
  avklartPersonstatus: {
    overstyrtPersonstatus: string;
  };
};
