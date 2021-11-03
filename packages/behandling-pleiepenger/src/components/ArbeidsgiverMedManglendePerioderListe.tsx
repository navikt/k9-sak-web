import React from 'react';
import Arbeidstype, { arbeidstypeTilVisning } from '../types/Arbeidstype';

interface ArbeidsgiverMedPerioder {
  arbeidsgiverNavn: string;
  organisasjonsnummer: string;
  perioder: string[];
  arbeidstype: Arbeidstype;
}

interface ArbeidsgiverMedManglendePerioderListeProps {
  arbeidsgivereMedPerioder: ArbeidsgiverMedPerioder[];
}

const arbeidsgiverTekst = ({ arbeidsgiverNavn, organisasjonsnummer }) =>
  `arbeidsgiver ${arbeidsgiverNavn} (${organisasjonsnummer})`;
const arbeidstypeTekst = (arbeidstype: Arbeidstype) => arbeidstypeTilVisning[arbeidstype]?.toLowerCase() || 'arbeidsgiver';

const ArbeidsgiverMedManglendePerioderListe = ({
  arbeidsgivereMedPerioder,
}: ArbeidsgiverMedManglendePerioderListeProps) => (
  <div>
    {arbeidsgivereMedPerioder.map(({ arbeidsgiverNavn, organisasjonsnummer, perioder, arbeidstype }) => (
      <span key={organisasjonsnummer}>
        <p>
          {`Arbeidstid mangler for ${
            arbeidstype === Arbeidstype.AT
              ? arbeidsgiverTekst({ arbeidsgiverNavn, organisasjonsnummer })
              : arbeidstypeTekst(arbeidstype)
          } i følgende perioder:`}
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
