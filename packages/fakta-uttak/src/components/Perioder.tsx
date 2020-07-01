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

  const valgtArbeid = useMemo(() => arbeid.find(arb => arb.arbeidsforhold.arbeidsforholdId === valgtArbeidsforholdId), [
    arbeid,
    valgtArbeidsforholdId,
  ]);

  if (!valgtArbeidsforholdId) {
    return (
      <Normaltekst className={styles.kursiv}>
        <FormattedMessage id="FaktaOmUttakForm.IngenArbeidsforholdValgt" />
      </Normaltekst>
    );
  }

  return (
    <div>
      {valgtArbeid.perioder.map((periode, index) => (
        <PeriodeKnapp
          periodeIndex={index}
          periode={periode}
          key={`${valgtArbeid.arbeidsforhold.arbeidsforholdId}-${periode.fom}-${periode.fom}`}
        />
      ))}
      {leggTilPeriode && (
        <Flatknapp htmlType="button" onClick={leggTilPeriode} mini kompakt>
          <Image src={addSvg} className={styles.image} />
          <span>{intl.formatMessage({ id: 'FaktaOmUttakForm.LeggTilNyPeriode' })}</span>
        </Flatknapp>
      )}
    </div>
  );
};

export default Perioder;
