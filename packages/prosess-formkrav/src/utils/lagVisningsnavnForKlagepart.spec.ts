import { expect } from 'chai';

import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import lagVisningsnavnForKlagepart from './lagVisningsnavnForKlagepart';

const personstatusKodeverk = 'PERSONSTATUS_TYPE';

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
      },
    };

    const personopplysninger = {
      aktoerId: '12345678',
      navn: 'Petra Tester',
      fnr: '72031833441',
      navBrukerKjonn: {
        kode: 'K',
        kodeverk: 'BRUKER_KJOENN',
      },
      statsborgerskap: { kode: '', kodeverk: '' },
      diskresjonskode: { kode: '', kodeverk: '' },
      sivilstand: { kode: '', kodeverk: '' },
      adresser: [],
      region: { kode: '', kodeverk: '' },
      // erPrivatPerson: true,
      personstatus: {
        kode: personstatusType.DOD,
        kodeverk: personstatusKodeverk,
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: personstatusType.BOSATT,
          kodeverk: personstatusKodeverk,
        },
        overstyrtPersonstatus: {
          kode: personstatusType.DOD,
          kodeverk: personstatusKodeverk,
        },
      },
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
        erPrivatPerson: false,
      },
    };

    const personopplysninger = {
      aktoerId: '12345678',
      navn: 'Petra Tester',
      fnr: '72031833441',
      navBrukerKjonn: {
        kode: 'K',
        kodeverk: 'BRUKER_KJOENN',
      },
      statsborgerskap: { kode: '', kodeverk: '' },
      diskresjonskode: { kode: '', kodeverk: '' },
      sivilstand: { kode: '', kodeverk: '' },
      adresser: [],
      region: { kode: '', kodeverk: '' },
      // erPrivatPerson: true,
      personstatus: {
        kode: personstatusType.DOD,
        kodeverk: personstatusKodeverk,
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: personstatusType.BOSATT,
          kodeverk: personstatusKodeverk,
        },
        overstyrtPersonstatus: {
          kode: personstatusType.DOD,
          kodeverk: personstatusKodeverk,
        },
      },
    };

    const navn = lagVisningsnavnForKlagepart(partId, personopplysninger, arbeidsgiverOpplysningerPerId);
    const expected = `Petra Tester (72031833441)`;
    expect(navn).to.eql(expected);
  });

  it('Viser id for part hvis klagepart ikke finnes i arbeidsgiveropplysninger eller personopplysninger', () => {
    const arbeidsgiverOpplysningerPerId = {
      '56781234': {
        identifikator: '56781234',
        referanse: '56781234',
        navn: 'Svendsen Eksos',
        fødselsdato: null,
        erPrivatPerson: false,
      },
    };

    const personopplysninger = {
      aktoerId: '23456781',
      navn: 'Petra Tester',
      fnr: '72031833441',
      navBrukerKjonn: {
        kode: 'K',
        kodeverk: 'BRUKER_KJOENN',
      },
      statsborgerskap: { kode: '', kodeverk: '' },
      diskresjonskode: { kode: '', kodeverk: '' },
      sivilstand: { kode: '', kodeverk: '' },
      adresser: [],
      region: { kode: '', kodeverk: '' },
      // erPrivatPerson: true,
      personstatus: {
        kode: personstatusType.DOD,
        kodeverk: personstatusKodeverk,
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: personstatusType.BOSATT,
          kodeverk: personstatusKodeverk,
        },
        overstyrtPersonstatus: {
          kode: personstatusType.DOD,
          kodeverk: personstatusKodeverk,
        },
      },
    };

    const navn = lagVisningsnavnForKlagepart(partId, personopplysninger, arbeidsgiverOpplysningerPerId);
    const expected = `12345678`;
    expect(navn).to.eql(expected);
  });
});
