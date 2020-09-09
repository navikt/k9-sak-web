/*
 "aktivitetStatus": {
            "kode": "AT",
            "kodeverk": "AKTIVITET_STATUS"
          },
          "inntektskategori": {
            "kode": "ARBEIDSTAKER",
            "kodeverk": "INNTEKTSKATEGORI"
          },
          "aktørId": null,
          "arbeidsforholdId": "fddaa46b-e776-4d8e-8a12-878d6820eba6",
          "arbeidsforholdType": {
            "kode": "-",
            "kodeverk": "OPPTJENING_AKTIVITET_TYPE"
          },
          "arbeidsgiverNavn": "BEDRIFT1 AS",
          "arbeidsgiverOrgnr": "915142990",
          "eksternArbeidsforholdId": "ARB002-001",
          "refusjon": 185,
          "sisteUtbetalingsdato": "2020-04-28",
          "stillingsprosent": 0,
          "tilSoker": 0,
          "utbetalingsgrad": 100,
          "uttak": [
            {
              "periode": {
                "fom": "2020-04-20",
                "tom": "2020-04-24"
              },
              "utbetalingsgrad": 100,
              "utfall": "INNVILGET"
            }

            */

export const getAktivitet = (aktivitetStatus, getKodeverknavn) => {
  return getKodeverknavn(aktivitetStatus);
};

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAndel = (andel, getKodeverknavn) => {
  if (!andel.arbeidsgiverNavn) {
    return andel.aktivitetStatus ? getKodeverknavn(andel.aktivitetStatus) : '';
  }
  return andel.arbeidsforholdId
    ? `${andel.arbeidsgiverNavn} (${andel.arbeidsgiverOrgnr})${getEndCharFromId(andel.eksternArbeidsforholdId)}`
    : `${andel.arbeidsgiverNavn} (${andel.arbeidsgiverOrgnr})`;
};

export default createVisningsnavnForAndel;
