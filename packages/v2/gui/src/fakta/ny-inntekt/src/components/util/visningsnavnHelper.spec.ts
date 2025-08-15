import { createVisningsnavnForAktivitetFordeling } from './visningsnavnHelper';

const andelUtenArbeidsforholdId = {
  erPrivatPerson: false,
  identifikator: '321',
  navn: 'Andeby bank',
};

const andelMedAlt = {
  erPrivatPerson: false,
  identifikator: '321',
  navn: 'Andeby bank',
};

describe('visningsnavnHelper', () => {
  it('skal lage visningsnavn når vi mangler arbeidsforholdId', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitetFordeling(andelUtenArbeidsforholdId);
    expect(arbeidsgiverNavnOrgnr).toBe('Andeby bank (321)');
  });

  it('skal lage visningsnavn når vi ikke mangler noe', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitetFordeling(andelMedAlt, '56789');
    expect(arbeidsgiverNavnOrgnr).toBe('Andeby bank (321)...6789');
  });
});
