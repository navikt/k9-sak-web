
export type PersonopplysningAdresse = Readonly<{
  adresseType?: string;
  adresselinje1?: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postNummer?: string;
  poststed?: string;
  land?: string;
  mottakerNavn?: string;
}>;

export type PersonopplysningerBasic = Readonly<{
  nummer?: number;
  navBrukerKjonn: string;
  statsborgerskap: string;
  avklartPersonstatus: {
    orginalPersonstatus: string;
    overstyrtPersonstatus: string;
  };
  personstatus: string;
  diskresjonskode: string;
  sivilstand: string;
  aktoerId?: string;
  navn: string;
  dodsdato?: string;
  fodselsdato?: string;
  adresser: PersonopplysningAdresse[];
  fnr?: string;
  region: string;
  harVerge?: boolean;
}>;

type Personopplysninger = Readonly<
  PersonopplysningerBasic & {
    annenPart?: PersonopplysningerBasic & {
      barn: PersonopplysningerBasic[];
      barnSoktFor?: PersonopplysningerBasic[];
      barnFraTpsRelatertTilSoknad?: PersonopplysningerBasic[];
    };
    barn?: PersonopplysningerBasic[];
    barnSoktFor?: PersonopplysningerBasic[];
    barnFraTpsRelatertTilSoknad?: PersonopplysningerBasic[];
    pleietrengendePart?: PersonopplysningerBasic;
  }
>;

export default Personopplysninger;
