import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { Element } from 'nav-frontend-typografi';
import styles from './uttakFaktaForm.less';
import { useUttakContext } from './uttakUtils';
import Arbeid from './types/Arbeid';

const classNames = classnames.bind(styles);

interface ArbeidsgiverProps {
  arbeid: Arbeid;
}

const Arbeidsgiver: FunctionComponent<ArbeidsgiverProps> = ({ arbeid }) => {
  const { valgtArbeidsforholdId, setValgtArbeidsforholdId, setValgtFomTom } = useUttakContext();

  const velgArbeidsgiver = () => {
    setValgtArbeidsforholdId(arbeid.arbeidsforhold.arbeidsforholdId);
    setValgtFomTom(null);
  };

  const erValgt = arbeid.arbeidsforhold.arbeidsforholdId === valgtArbeidsforholdId;

  // TODO: håndtere at aktørId istedenfor orgnr er satt. må da oppdatere valgtArbeidsgiversOrgnr
  return (
    <button
      onClick={velgArbeidsgiver}
      type="button"
      className={classNames('arbeidsgiver', {
        'arbeidsgiver--erValgt': erValgt,
      })}
    >
      <Element tag="div">
        <FormattedMessage id="FaktaOmUttakForm.OrgNr" />
        <div>{arbeid.arbeidsforhold.organisasjonsnummer}</div>
      </Element>
    </button>
  );
};

export default Arbeidsgiver;
