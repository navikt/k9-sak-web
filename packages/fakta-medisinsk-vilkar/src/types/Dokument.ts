import Link from './Link';

export enum Dokumenttype {
    LEGEERKLÆRING = 'LEGEERKLÆRING_SYKEHUS',
    ANDRE_MEDISINSKE_OPPLYSNINGER = 'MEDISINSKE_OPPLYSNINGER',
    MANGLER_MEDISINSKE_OPPLYSNINGER = 'ANNET',
    UKLASSIFISERT = 'UKLASSIFISERT',
}

export const dokumentLabel = {
    LEGEERKLÆRING_SYKEHUS: 'Sykehus/spesialist.',
    MEDISINSKE_OPPLYSNINGER: 'Andre med. oppl.',
    ANNET: 'Ikke med. oppl.',
    UKLASSIFISERT: 'Ikke klassifisert',
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
    links: Link[];
    mottattDato: string;
    mottattTidspunkt: string;
    navn: string;
    type: Dokumenttype;
}

export default Dokument;
