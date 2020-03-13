import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp } from 'nav-frontend-knapper';
import addSvg from '@fpsak-frontend/assets/images/add-circle.svg';
import { Image } from '@fpsak-frontend/shared-components';
import styles from './uttakFaktaForm.less';
import PeriodeKnapp from './PeriodeKnapp';
import { Arbeidsforhold } from './types/Arbeidfsforhold';

interface PerioderProps {
  valgtArbeidsforhold: Arbeidsforhold;
  leggTilPeriode?: () => void;
}

const Perioder: FunctionComponent<PerioderProps> = ({ valgtArbeidsforhold, leggTilPeriode }) => {
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
      {leggTilPeriode && (
        <Flatknapp htmlType="button" onClick={leggTilPeriode} mini form="kompakt">
          <Image src={addSvg} className={styles.image} />
          <span>{intl.formatMessage({ id: 'FaktaOmUttakForm.LeggTilNyPeriode' })}</span>
        </Flatknapp>
      )}
    </div>
  );
};

export default Perioder;
