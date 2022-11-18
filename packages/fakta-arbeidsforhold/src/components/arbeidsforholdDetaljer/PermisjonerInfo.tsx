import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { VerticalSpacer, PeriodLabel } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import styles from './permisjonPeriode.less';

const utledPeriodeLabelKey = (id, index) => id + index;

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const PermisjonerInfo = ({ arbeidsforhold, alleKodeverk }: OwnProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk);
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
                  {permisjon.type === '-' ? 'Ukjent' : getKodeverknavn(permisjon.type, KodeverkType.PERSONSTATUS_TYPE)}
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
