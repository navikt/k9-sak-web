import { expect } from 'chai';

import lagVisningsnavnForKlagepart from './visningsNavn';

describe('lagVisningsnavnForKlagepart', () => {
  const partId = '12345678';

  it('Viser navn og id for arbeidsgiver hvis klagepart finnes i arbeidsgiveropplysninger', () => {
    const arbeidsgiverOpplysningerPerId = {
      '12345678': {
        identifikator: '12345678',
        referanse: '12345678',
        navn: 'Svendsen Eksos',
        fødselsdato: null,
      },
    };

    const personopplysninger = {
      aktoerId: '12345678',
      navn: 'Petra Tester',
    };

    const navn = lagVisningsnavnForKlagepart(partId, personopplysninger, arbeidsgiverOpplysningerPerId);
    const expected = `Svendsen Eksos (12345678)`;
    expect(navn).to.eql(expected);
  });

  it('Viser navn og id for person hvis klagepart finnes i personopplysninger', () => {
    const arbeidsgiverOpplysningerPerId = {
      '56781234': {
        identifikator: '56781234',
        referanse: '56781234',
        navn: 'Svendsen Eksos',
        fødselsdato: null,
      },
    };

    const personopplysninger = {
      aktoerId: '12345678',
      navn: 'Petra Tester',
    };

    const navn = lagVisningsnavnForKlagepart(partId, personopplysninger, arbeidsgiverOpplysningerPerId);
    const expected = `Petra Tester (12345678)`;
    expect(navn).to.eql(expected);
  });

  it('Viser id for part hvis klagepart ikke finnes i arbeidsgiveropplysninger eller personopplysninger', () => {
    const arbeidsgiverOpplysningerPerId = {
      '56781234': {
        identifikator: '56781234',
        referanse: '56781234',
        navn: 'Svendsen Eksos',
        fødselsdato: null,
      },
    };

    const personopplysninger = {
      aktoerId: '23456781',
      navn: 'Petra Tester',
    };

    const navn = lagVisningsnavnForKlagepart(partId, personopplysninger, arbeidsgiverOpplysningerPerId);
    const expected = `12345678`;
    expect(navn).to.eql(expected);
  });
});
