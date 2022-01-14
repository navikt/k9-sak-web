import React from 'react';
import { arbeidstypeTilVisning, Arbeidstype } from '../types/Arbeidstype';

interface ArbeidsgiverMedPerioder {
  arbeidsgiverNavn: string;
  organisasjonsnummer: string;
  perioder: string[];
  arbeidstype: Arbeidstype;
  personIdentifikator: string;
}

interface ArbeidsgiverMedManglendePerioderListeProps {
  arbeidsgivereMedPerioder: ArbeidsgiverMedPerioder[];
}

const arbeidsgiverTekst = ({ arbeidsgiverNavn, organisasjonsnummer, personIdentifikator }) =>
  `arbeidsgiver ${arbeidsgiverNavn} (${organisasjonsnummer || personIdentifikator})`;
const arbeidstypeTekst = (arbeidstype: Arbeidstype) =>
  arbeidstypeTilVisning[arbeidstype]?.toLowerCase() || 'arbeidsgiver';

const ArbeidsgiverMedManglendePerioderListe = ({
  arbeidsgivereMedPerioder,
}: ArbeidsgiverMedManglendePerioderListeProps) => (
  <div>
    {arbeidsgivereMedPerioder.map(
      ({ arbeidsgiverNavn, organisasjonsnummer, perioder, arbeidstype, personIdentifikator }) => (
        <span key={organisasjonsnummer}>
          <p>
            {`Arbeidstid mangler for ${
              arbeidstype === Arbeidstype.ARBEIDSTAKER
                ? arbeidsgiverTekst({ arbeidsgiverNavn, organisasjonsnummer, personIdentifikator })
                : arbeidstypeTekst(arbeidstype)
            } i følgende perioder:`}
          </p>
          <ul>
            {perioder.map(periode => (
              <li key={periode}>{periode}</li>
            ))}
          </ul>
        </span>
      ),
    )}
  </div>
);

export default ArbeidsgiverMedManglendePerioderListe;
