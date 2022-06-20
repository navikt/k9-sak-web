import { expect } from 'chai';
import createVisningsnavnForAktivitet from './createVisningsnavnForAktivitet';

const andelUtenNavn = {
  arbeidsforholdType: 'A',
  arbeidsforholdId: '123',
  arbeidsgiverIdent: '111',
  eksternArbeidsforholdId: '09876',
};

const andelUtenArbeidsforholdId = {
  arbeidsforholdType: 'A',
  arbeidsgiverIdent: '321',
};

const andelMedAlt = {
  arbeidsforholdType: 'A',
  arbeidsgiverIdent: '321',
  arbeidsforholdId: '999888777',
  eksternArbeidsforholdId: '56789',
};

const arbeidsgiverOpplysningerPerId = {
  321: {
    identifikator: '321',
    referanse: '321',
    navn: 'Andeby bank',
    fødselsdato: null,
  },
};

const getKodeverknavn = (kode, kodeverk) => (kode === 'A' ? 'Arbeidstaker' : '');

describe('visningsnavnHelper', () => {
  it('skal lage visningsnavn når vi mangler data for arbeidsgivere', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(
      andelUtenNavn,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    expect(arbeidsgiverNavnOrgnr).to.equal('Arbeidstaker');
  });

  it('skal lage visningsnavn når vi mangler arbeidsforholdId', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(
      andelUtenArbeidsforholdId,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321)');
  });

  it('skal lage visningsnavn når vi ikke mangler noe', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(
      andelMedAlt,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321)...6789');
  });
});
