import React, { type JSX } from 'react';
import ContainerContext from '../../../context/ContainerContext';
import type { Arbeidsgiver } from '../../../types/KompletthetData';

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
