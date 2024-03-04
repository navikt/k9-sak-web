import { FagsakPerson } from '@k9-sak-web/types';
import lagVisningsnavnForKlagepart from './lagVisningsnavnForKlagepart';

describe('lagVisningsnavnForKlagepart', () => {
  const partId = '12345678';

  it('Viser navn og id for arbeidsgiver hvis klagepart finnes i arbeidsgiveropplysninger', () => {
    const arbeidsgiverOpplysningerPerId = {
      '12345678': {
        identifikator: '12345678',
        referanse: '12345678',
        navn: 'Svendsen Eksos',
        fødselsdato: null,
        erPrivatPerson: false,
        arbeidsforholdreferanser: [],
      },
    };

    const fagsakPerson: FagsakPerson = {
      aktørId: '12345678',
      navn: 'Petra Tester',
      personnummer: '72031833441',
      alder: 0,
      erDod: false,
      erKvinne: false,
      personstatusType: undefined,
    };

    const navn = lagVisningsnavnForKlagepart(partId, fagsakPerson, arbeidsgiverOpplysningerPerId);
    const expected = `Svendsen Eksos (12345678)`;
    expect(navn).toBe(expected);
  });

  it('Viser navn og id for person hvis klagepart finnes i personopplysninger', () => {
    const arbeidsgiverOpplysningerPerId = {
      '56781234': {
        identifikator: '56781234',
        referanse: '56781234',
        navn: 'Svendsen Eksos',
        fødselsdato: null,
        erPrivatPerson: false,
        arbeidsforholdreferanser: [],
      },
    };

    const fagsakPerson: FagsakPerson = {
      aktørId: '12345678',
      navn: 'Petra Tester',
      personnummer: '72031833441',
      alder: 0,
      erDod: false,
      erKvinne: false,
      personstatusType: undefined,
    };

    const navn = lagVisningsnavnForKlagepart(partId, fagsakPerson, arbeidsgiverOpplysningerPerId);
    const expected = `Petra Tester (72031833441)`;
    expect(navn).toBe(expected);
  });

  it('Viser id for part hvis klagepart ikke finnes i arbeidsgiveropplysninger eller personopplysninger', () => {
    const arbeidsgiverOpplysningerPerId = {
      '56781234': {
        identifikator: '56781234',
        referanse: '56781234',
        navn: 'Svendsen Eksos',
        fødselsdato: null,
        erPrivatPerson: false,
        arbeidsforholdreferanser: [],
      },
    };

    const fagsakPerson: FagsakPerson = {
      aktørId: '23456781',
      navn: 'Petra Tester',
      personnummer: '72031833441',
      alder: 0,
      erDod: false,
      erKvinne: false,
      personstatusType: undefined,
    };

    const navn = lagVisningsnavnForKlagepart(partId, fagsakPerson, arbeidsgiverOpplysningerPerId);
    const expected = `12345678`;
    expect(navn).toBe(expected);
  });
});
