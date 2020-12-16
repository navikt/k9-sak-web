import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer, PeriodLabel } from '@fpsak-frontend/shared-components';

import styles from './permisjonPeriode.less';
import { arbeidsforholdV2PropType } from '../../../../prop-types/src/arbeidsforholdPropType';

const utledPeriodeLabelKey = (id, index) => id + index;

const PermisjonPeriode = ({ arbeidsforhold }) => (
  <>
    {arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0 && (
      <div>
        <VerticalSpacer sixteenPx />
        {arbeidsforhold.permisjoner.map((permisjon, index) => (
          <div>
            <VerticalSpacer sixteenPx />
            <div className={styles.container} key={utledPeriodeLabelKey(arbeidsforhold.id, index)}>
              <Normaltekst>
                <FormattedMessage id="PersonArbeidsforholdDetailForm.Permisjon" />
              </Normaltekst>
              <div className={styles.type}>
                <PeriodLabel
                  dateStringFom={permisjon.permisjonFom}
                  dateStringTom={permisjon.permisjonTom ? permisjon.permisjonTom : ''}
                />
              </div>
              <Normaltekst className={styles.div}>
                <FormattedMessage id="PersonArbeidsforholdDetailForm.Permisjonype" />
              </Normaltekst>
              <Normaltekst className={styles.type}>{permisjon.type}</Normaltekst>
            </div>
          </div>
        ))}
        <VerticalSpacer sixteenPx />
      </div>
    )}
  </>
);

PermisjonPeriode.propTypes = {
  arbeidsforhold: arbeidsforholdV2PropType.isRequired,
};

export default PermisjonPeriode;
