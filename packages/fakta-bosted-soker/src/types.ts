import KodeverkMedNavn from '@k9-sak-web/types/src/kodeverkMedNavnTsType';

export interface Adresse {
  adresseType: KodeverkMedNavn;
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
  sivilstand: KodeverkMedNavn;
  region: KodeverkMedNavn;
  personstatus: KodeverkMedNavn;
  avklartPersonstatus: {
    overstyrtPersonstatus: KodeverkMedNavn;
  };
};
