import type { JSX } from 'react';
import useContainerContext from '../../../context/useContainerContext';
import { Arbeidsgiver } from '../../../types/KompletthetData';

interface ArbeidsgiverTekstProps {
  arbeidsgiver: Arbeidsgiver;
}

const ArbeidsgiverTekst = ({ arbeidsgiver }: ArbeidsgiverTekstProps): JSX.Element => {
  const { arbeidsforhold } = useContainerContext();
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
