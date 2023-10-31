import { Brevmaler } from "@k9-sak-web/types";

const brevmaler: Brevmaler = {
  "INNHEN": {
    "navn": "Innhent dokumentasjon",
    "mottakere": [
      {
        "id": "2821629142423",
        "type": "AKTØRID",
        "harVarsel": false
      },
      {
        "id": "123456789",
        "type": "ORGNR",
        "harVarsel": false
      },
      {
        "id": "987654321",
        "type": "ORGNR",
        "harVarsel": false
      }
    ],
    "linker": [],
    "støtterFritekst": true,
    "støtterTittelOgFritekst": false,
    "kode": "INNHEN"
  },
  "GENERELT_FRITEKSTBREV": {
    "navn": "Fritekst generelt brev",
    "mottakere": [
      {
        "id": "2821629142423",
        "type": "AKTØRID",
        "harVarsel": false
      },
      {
        "id": "123456789",
        "type": "ORGNR",
        "harVarsel": false
      },
      {
        "id": "987654321",
        "type": "ORGNR",
        "harVarsel": false
      }
    ],
    "linker": [],
    "støtterFritekst": false,
    "støtterTittelOgFritekst": true,
    "kode": "GENERELT_FRITEKSTBREV"
  },
  "INNHENT_MEDISINSKE_OPPLYSNINGER": {
    "navn": "Innhent medisinske opplysninger fritekstbrev",
    "mottakere": [
      {
        "id": "2821629142423",
        "type": "AKTØRID",
        "harVarsel": false
      }
    ],
    "linker": [],
    "støtterFritekst": true,
    "støtterTittelOgFritekst": false,
    "kode": "INNHENT_MEDISINSKE_OPPLYSNINGER"
  },
  "VARSEL_FRITEKST": {
    "navn": "Varselsbrev fritekst",
    "mottakere": [
      {
        "id": "2821629142423",
        "type": "AKTØRID",
        "harVarsel": false
      }
    ],
    "linker": [],
    "støtterFritekst": true,
    "støtterTittelOgFritekst": false,
    "kode": "VARSEL_FRITEKST"
  }
}

export default brevmaler;
