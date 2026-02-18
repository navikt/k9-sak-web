import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';

const utledPermisjonLabelID = arbeidsforhold => {
  if (arbeidsforhold.permisjoner.length > 1) {
    return 'PersonArbeidsforholdDetailForm.Permisjoner';
  }
  return 'PersonArbeidsforholdDetailForm.Permisjon';
};

const utledPeriodeLabelKey = (id, index) => id + index;

interface OwnProps {
  arbeidsforhold: ArbeidsforholdV2;
}

const PermisjonPeriode = ({ arbeidsforhold }: OwnProps) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>
    {arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0 && (
      <div>
        <VerticalSpacer sixteenPx />
        <BodyShort size="small">
          <FormattedMessage id={utledPermisjonLabelID(arbeidsforhold)} />
        </BodyShort>
        {arbeidsforhold.permisjoner.map((permisjon, index) => (
          <div key={utledPeriodeLabelKey(arbeidsforhold.id, index)}>
            <PeriodLabel
              dateStringFom={permisjon.permisjonFom}
              dateStringTom={permisjon.permisjonTom ? permisjon.permisjonTom : ''}
            />
          </div>
        ))}
        <VerticalSpacer sixteenPx />
      </div>
    )}
  </>
);

export default PermisjonPeriode;
