import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer, PeriodLabel } from '@fpsak-frontend/shared-components';

import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import styles from './permisjonPeriode.less';

const utledPeriodeLabelKey = (id, index) => id + index;

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
}

const PermisjonerInfo: FunctionComponent<OwnProps> = ({ arbeidsforhold }) => (
  <>
    {arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0 && (
      <div>
        <VerticalSpacer sixteenPx />
        {arbeidsforhold.permisjoner.map((permisjon, index) => (
          <div>
            <VerticalSpacer sixteenPx />
            <div className={styles.container} key={utledPeriodeLabelKey(arbeidsforhold.id, index)}>
              <Normaltekst>
                <FormattedMessage id="PersonArbeidsforholdDetailForm.PermisjonPeriode" />
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

export default PermisjonerInfo;
