import createVisningsnavnForAktivitet from './visningsnavnHelper';

const andelUtenArbeidsforholdId = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsgiverIdent: '321',
};

const andelMedAlt = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsgiverIdent: '321',
  arbeidsforholdId: '999888777',
  eksternArbeidsforholdId: '56789',
};

const arbeidsgiverOpplysningerPerId = {
  321: {
    erPrivatPerson: false,
    identifikator: '321',
    referanse: '123',
    navn: 'Andeby bank',
  },
};

describe('visningsnavnHelper', () => {
  it('skal lage visningsnavn når vi mangler arbeidsforholdId', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(
      arbeidsgiverOpplysningerPerId[andelUtenArbeidsforholdId.arbeidsgiverIdent],
      undefined,
    );
    expect(arbeidsgiverNavnOrgnr).toBe('Andeby bank (321)');
  });

  it('skal lage visningsnavn når vi ikke mangler noe', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(
      arbeidsgiverOpplysningerPerId[andelMedAlt.arbeidsgiverIdent],
      andelMedAlt.eksternArbeidsforholdId,
    );
    expect(arbeidsgiverNavnOrgnr).toBe('Andeby bank (321)...6789');
  });
});
