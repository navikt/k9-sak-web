import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { Element } from 'nav-frontend-typografi';
import ArbeidsgiverType from './types/Arbeidsgiver';
import styles from './uttakFaktaForm.less';
import { useUttakContext } from './uttakUtils';

const classNames = classnames.bind(styles);

interface ArbeidsgiverProps {
  arbeidsgiver: ArbeidsgiverType;
}

const Arbeidsgiver: FunctionComponent<ArbeidsgiverProps> = ({ arbeidsgiver }) => {
  const {
    valgtArbeidsgiversOrgNr,
    setValgtArbeidsgiversOrgNr,
    setValgtArbeidsforholdId,
    setValgtPeriodeIndex,
  } = useUttakContext();

  const velgArbeidsgiver = () => {
    setValgtArbeidsgiversOrgNr(arbeidsgiver.organisasjonsnummer);
    setValgtPeriodeIndex(null);
    // TODO: Kun ett arb.forh. til MVP 27. mars. Støtte flere etter det
    setValgtArbeidsforholdId(arbeidsgiver.arbeidsforhold[0].arbeidsgiversArbeidsforholdId);
  };
  const erValgt = valgtArbeidsgiversOrgNr === arbeidsgiver.organisasjonsnummer;

  return (
    <button
      onClick={velgArbeidsgiver}
      type="button"
      className={classNames('arbeidsgiver', {
        'arbeidsgiver--erValgt': erValgt,
      })}
    >
      <Element tag="div">
        <div>{arbeidsgiver.navn}</div>
        <FormattedMessage values={{ orgNr: arbeidsgiver.organisasjonsnummer }} id="FaktaOmUttakForm.OrgNr" />
      </Element>
    </button>
  );
};

export default Arbeidsgiver;
