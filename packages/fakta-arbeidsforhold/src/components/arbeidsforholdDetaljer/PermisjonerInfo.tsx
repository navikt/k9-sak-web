import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BodyShort } from '@navikt/ds-react';
import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import styles from './permisjonPeriode.module.css';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';

const utledPeriodeLabelKey = (id, index) => id + index;

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
}

const PermisjonerInfo = ({ arbeidsforhold }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
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
                <BodyShort size="small">
                  <FormattedMessage id="PersonArbeidsforholdDetailForm.PermisjonPeriode" />
                </BodyShort>
                <div className={styles.type}>
                  <PeriodLabel
                    dateStringFom={permisjon.permisjonFom}
                    dateStringTom={permisjon.permisjonTom ? permisjon.permisjonTom : ''}
                  />
                </div>
                <BodyShort size="small">
                  <FormattedMessage id="PersonArbeidsforholdDetailForm.Permisjonype" />
                </BodyShort>
                <BodyShort size="small" className={styles.type}>
                  {permisjon.type === '-'
                    ? 'Ukjent'
                    : kodeverkNavnFraKode(permisjon.type, KodeverkType.PERMISJONSBESKRIVELSE_TYPE)}
                </BodyShort>
                <BodyShort size="small">
                  <FormattedMessage id="PersonArbeidsforholdDetailForm.Prosent" />
                </BodyShort>
                <BodyShort size="small" className={styles.type}>
                  {permisjon.permisjonsprosent}
                </BodyShort>
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
