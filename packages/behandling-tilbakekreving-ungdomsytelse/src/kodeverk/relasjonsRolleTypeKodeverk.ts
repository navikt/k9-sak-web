import { RelasjonsRolleType } from '@navikt/ft-prosess-tilbakekreving-foreldelse';

const relasjonsRolleTypeKodeverk = [
  { kode: RelasjonsRolleType.MOR, navn: 'Mor', kodeverk: 'RELASJON_ROLLE_TYPE' },
  { kode: RelasjonsRolleType.FAR, navn: 'Far', kodeverk: 'RELASJON_ROLLE_TYPE' },
  { kode: RelasjonsRolleType.MEDMOR, navn: 'Medmor', kodeverk: 'RELASJON_ROLLE_TYPE' },
  { kode: RelasjonsRolleType.DELTAKER, navn: 'Deltaker', kodeverk: 'RELASJON_ROLLE_TYPE' },
];

export default relasjonsRolleTypeKodeverk;
