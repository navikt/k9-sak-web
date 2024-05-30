import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';

// mock data av type Template som brukast i ny Messages komponent.
export const templates = [
  {
    navn: 'Innhent dokumentasjon',
    mottakere: [
      {
        id: '2821629142423',
        type: 'AKTØRID',
      },
      {
        id: '123456789',
        type: 'ORGNR',
      },
      {
        id: '987654321',
        type: 'ORGNR',
      },
    ],
    støtterTredjepartsmottaker: true,
    linker: [],
    støtterFritekst: true,
    støtterTittelOgFritekst: false,
    kode: 'INNHEN',
  },
  {
    navn: 'Fritekst generelt brev',
    mottakere: [
      {
        id: '2821629142423',
        type: 'AKTØRID',
      },
      {
        id: '123456789',
        type: 'ORGNR',
      },
      {
        id: '987654321',
        type: 'ORGNR',
      },
    ],
    støtterTredjepartsmottaker: true,
    linker: [],
    støtterFritekst: false,
    støtterTittelOgFritekst: true,
    kode: 'GENERELT_FRITEKSTBREV',
  },
  {
    navn: 'Innhent medisinske opplysninger fritekstbrev',
    mottakere: [
      {
        id: '2821629142423',
        type: 'AKTØRID',
      },
    ],
    støtterTredjepartsmottaker: true,
    linker: [],
    støtterFritekst: true,
    støtterTittelOgFritekst: false,
    kode: 'INNHENT_MEDISINSKE_OPPLYSNINGER',
  },
  {
    navn: 'Varselsbrev fritekst',
    mottakere: [
      {
        id: '2821629142423',
        type: 'AKTØRID',
      },
    ],
    linker: [],
    støtterFritekst: true,
    støtterTittelOgFritekst: false,
    kode: 'VARSEL_FRITEKST',
    støtterTredjepartsmottaker: false,
  },
] satisfies Template[];
