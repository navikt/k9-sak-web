export enum Dokumenttype {
  LEGEERKLÆRING = 'LEGEERKLÆRING_SYKEHUS',
  ANDRE_MEDISINSKE_OPPLYSNINGER = 'MEDISINSKE_OPPLYSNINGER',
  MANGLER_MEDISINSKE_OPPLYSNINGER = 'ANNET',
  UKLASSIFISERT = 'UKLASSIFISERT',
  LEGEERKLÆRING_ANNEN = 'LEGEERKLÆRING_ANNEN',
  LEGEERKLÆRING_MED_DOKUMENTASJON_AV_OPPLÆRING = 'LEGEERKLÆRING_MED_DOKUMENTASJON_AV_OPPLÆRING',
  DOKUMENTASJON_AV_OPPLÆRING = 'DOKUMENTASJON_AV_OPPLÆRING',
}

export const dokumentLabel = {
  LEGEERKLÆRING_SYKEHUS: 'Sykehus/spesialist.',
  MEDISINSKE_OPPLYSNINGER: 'Andre med. oppl.',
  ANNET: 'Ikke med. oppl.',
  UKLASSIFISERT: 'Ikke klassifisert',
  LEGEERKLÆRING_ANNEN: 'Legeerklæring',
  LEGEERKLÆRING_MED_DOKUMENTASJON_AV_OPPLÆRING: 'Legeerklæring/kursdok.',
  DOKUMENTASJON_AV_OPPLÆRING: 'Kursdok.',
};

export interface Dokument {
  annenPartErKilde: boolean;
  behandlet: boolean;
  benyttet: boolean;
  bruktTilMinstEnVurdering: boolean;
  datert: string;
  duplikatAvId: string;
  duplikater: string[];
  fremhevet: boolean;
  id: string;
  links: any[];
  mottattDato: string;
  mottattTidspunkt: string;
  navn: string;
  type: Dokumenttype;
}

export default Dokument;
