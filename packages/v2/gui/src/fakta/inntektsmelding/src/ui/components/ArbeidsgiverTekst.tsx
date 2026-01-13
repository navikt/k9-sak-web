import type { JSX } from 'react';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { Arbeidsgiver } from '../../types/KompletthetData';

interface ArbeidsgiverTekstProps {
  arbeidsgiver: Arbeidsgiver;
}

const ArbeidsgiverTekst = ({ arbeidsgiver }: ArbeidsgiverTekstProps): JSX.Element => {
  const { arbeidsforhold } = useInntektsmeldingContext();
  const id = arbeidsgiver.arbeidsgiver;
  const arbeidsgiverInfo = arbeidsforhold[id];
  const tekst = arbeidsgiverInfo?.navn ?? arbeidsgiverInfo?.fødselsdato ?? id;
  return (
    <span>
      {tekst} (Arbeidsforhold {arbeidsgiver.arbeidsforhold})
    </span>
  );
};

export default ArbeidsgiverTekst;
