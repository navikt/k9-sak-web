import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer, PeriodLabel } from '@fpsak-frontend/shared-components';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';

import styles from './permisjonPeriode.less';

const utledPeriodeLabelKey = (id, index) => id + index;

const permisjonstyper = {
  PERMISJON_MED_FORELDREPENGER: 'Permisjon med foreldrepenger',
  PERMISJON: 'Permisjon',
  UTDANNINGSPERMISJON: 'Utdanningspermisjon',
  VELFERDSPERMISJON: 'Velferdspermisjon',
  PERMITTERING: 'Permittering',
  PERMISJON_VED_MILITÆRTJENESTE: 'Permisjon ved militærtjeneste',
};

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
}

const PermisjonerInfo = ({ arbeidsforhold }: OwnProps) => (
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
                {permisjon.type.kode === '-' ? 'Ukjent' : permisjonstyper[permisjon.type.kode]}
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

export default PermisjonerInfo;
