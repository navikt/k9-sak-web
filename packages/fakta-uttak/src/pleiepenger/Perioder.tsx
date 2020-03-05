import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp } from 'nav-frontend-knapper';
import addSvg from '@fpsak-frontend/assets/images/add-circle.svg';
import { Image } from '@fpsak-frontend/shared-components';
import styles from './uttakFaktaForm.less';
import PeriodeKnapp from './PeriodeKnapp';
import { Arbeidsforhold } from './UttakFaktaIndex2';

interface PerioderProps {
  valgtArbeidsforhold: Arbeidsforhold;
  leggTilPeriode: () => void;
  buttonDisabled: boolean;
}

const Perioder: FunctionComponent<PerioderProps> = ({ valgtArbeidsforhold, leggTilPeriode, buttonDisabled }) => {
  const intl = useIntl();

  if (!valgtArbeidsforhold) {
    return (
      <Normaltekst className={styles.kursiv}>
        <FormattedMessage id="FaktaOmUttakForm.IngenArbeidsforholdValgt" />
      </Normaltekst>
    );
  }

  return (
    <div>
      {valgtArbeidsforhold.perioder.map((periode, index) => (
        <PeriodeKnapp
          periode={periode}
          periodeIndex={index}
          key={`${valgtArbeidsforhold.arbeidsgiversArbeidsforholdId}-${periode.fom}-${periode.tom}`}
        />
      ))}
      <Flatknapp htmlType="button" onClick={leggTilPeriode} disabled={buttonDisabled} mini form="kompakt">
        <Image src={addSvg} className={styles.image} />
        <span>{intl.formatMessage({ id: 'FaktaOmUttakForm.LeggTilPeriode' })}</span>
      </Flatknapp>
    </div>
  );
};

export default Perioder;
