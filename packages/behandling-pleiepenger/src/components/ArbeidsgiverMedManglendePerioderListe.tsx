import React from 'react';

interface ArbeidsgiverMedPerioder {
  arbeidsgiverNavn: string;
  organisasjonsnummer: string;
  perioder: string[];
}

interface ArbeidsgiverMedManglendePerioderListeProps {
  arbeidsgivereMedPerioder: ArbeidsgiverMedPerioder[];
}

const ArbeidsgiverMedManglendePerioderListe = ({
  arbeidsgivereMedPerioder,
}: ArbeidsgiverMedManglendePerioderListeProps) => (
  <div>
    {arbeidsgivereMedPerioder.map(({ arbeidsgiverNavn, organisasjonsnummer, perioder }) => (
      <span key={organisasjonsnummer}>
        <p>
          Arbeidstid mangler for arbeidsgiver {arbeidsgiverNavn} ({organisasjonsnummer}) i følgende perioder:
        </p>
        <ul>
          {perioder.map(periode => (
            <li key={periode}>{periode}</li>
          ))}
        </ul>
      </span>
    ))}
  </div>
);

export default ArbeidsgiverMedManglendePerioderListe;
