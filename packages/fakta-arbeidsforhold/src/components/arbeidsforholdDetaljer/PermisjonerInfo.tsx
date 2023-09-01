import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';

import styles from './permisjonPeriode.css';

const utledPeriodeLabelKey = (id, index) => id + index;

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const PermisjonerInfo = ({ arbeidsforhold, alleKodeverk }: OwnProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
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
                  {permisjon.type.kode === '-' ? 'Ukjent' : getKodeverknavn(permisjon.type)}
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
