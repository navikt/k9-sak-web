import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp } from 'nav-frontend-knapper';
import addSvg from '@fpsak-frontend/assets/images/add-circle.svg';
import { Image } from '@fpsak-frontend/shared-components';
import styles from './uttakFaktaForm.less';
import PeriodeKnapp from './PeriodeKnapp';
import Arbeid from './types/Arbeid';

interface PerioderProps {
  arbeid: Arbeid[];
  valgtArbeidsforholdId: string;
  leggTilPeriode?: () => void;
}

const Perioder: FunctionComponent<PerioderProps> = ({ arbeid, valgtArbeidsforholdId, leggTilPeriode }) => {
  const intl = useIntl();

  if (!valgtArbeidsforholdId) {
    return (
      <Normaltekst className={styles.kursiv}>
        <FormattedMessage id="FaktaOmUttakForm.IngenArbeidsforholdValgt" />
      </Normaltekst>
    );
  }

  const valgtArbeid = useMemo(() => arbeid.find(arb => arb.arbeidsforhold.arbeidsforholdId === valgtArbeidsforholdId), [
    arbeid,
    valgtArbeidsforholdId,
  ]);

  return (
    <div>
      {Object.entries(valgtArbeid.perioder).map(([fomTom], index) => (
        <PeriodeKnapp
          periodeIndex={index}
          fomTom={fomTom}
          key={`${valgtArbeid.arbeidsforhold.arbeidsforholdId}-${fomTom}`}
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
