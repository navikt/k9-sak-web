import React from 'react';
import { Arbeidsgiver } from '../../../types/KompletthetData';
import ContainerContext from '../../../context/ContainerContext';

interface ArbeidsgiverTekstProps {
  arbeidsgiver: Arbeidsgiver;
}

const ArbeidsgiverTekst = ({ arbeidsgiver }: ArbeidsgiverTekstProps): JSX.Element => {
  const { arbeidsforhold } = React.useContext(ContainerContext);
  const id = arbeidsgiver.arbeidsgiver;
  const tekst = arbeidsforhold[id].navn || arbeidsforhold[id].fødselsdato;
  return (
    <span>
      {tekst} (Arbeidsforhold {arbeidsgiver.arbeidsforhold})
    </span>
  );
};

export default ArbeidsgiverTekst;
