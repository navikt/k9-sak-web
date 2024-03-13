import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { useKodeverkV2 } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverk.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';

import styles from './permisjonPeriode.module.css';

const utledPeriodeLabelKey = (id, index) => id + index;

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
}

const PermisjonerInfo = ({ arbeidsforhold }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkV2();
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0 && (
        <div>
          <VerticalSpacer sixteenPx />
          {arbeidsforhold.permisjoner.map((permisjon, index) => (
            <div>
              <VerticalSpacer sixteenPx />
              <div key={utledPeriodeLabelKey(arbeidsforhold.id, index)}>
                <Normaltekst>
                  <FormattedMessage id="PersonArbeidsforholdDetailForm.PermisjonPeriode" />
                </Normaltekst>
                <div className={styles.type}>
                  <PeriodLabel
                    dateStringFom={permisjon.permisjonFom}
                    dateStringTom={permisjon.permisjonTom ? permisjon.permisjonTom : ''}
                  />
                </div>
                <Normaltekst>
                  <FormattedMessage id="PersonArbeidsforholdDetailForm.Permisjonype" />
                </Normaltekst>
                <Normaltekst className={styles.type}>
                  {permisjon.type === '-'
                    ? 'Ukjent'
                    : kodeverkNavnFraKode(permisjon.type, KodeverkType.PERMISJONSBESKRIVELSE_TYPE)}
                </Normaltekst>
                <Normaltekst>
                  <FormattedMessage id="PersonArbeidsforholdDetailForm.Prosent" />
                </Normaltekst>
                <Normaltekst className={styles.type}>{permisjon.permisjonsprosent}</Normaltekst>
              </div>
            </div>
          ))}
          <VerticalSpacer sixteenPx />
        </div>
      )}
    </>
  );
};

export default PermisjonerInfo;
