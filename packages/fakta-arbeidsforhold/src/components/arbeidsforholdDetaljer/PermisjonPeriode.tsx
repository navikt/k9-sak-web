import { BodyShort } from '@navikt/ds-react';
import React from 'react';

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

// Helper to get permisjon label text
const getPermisjonLabel = (arbeidsforhold: any): string => {
  const labelId = utledPermisjonLabelID(arbeidsforhold);
  const labels: Record<string, string> = {
    'PersonArbeidsforholdDetailForm.Permisjon': 'Permisjon',
    'PersonArbeidsforholdDetailForm.PermisjonMedDelvisArbeid': 'Permisjon med delvis arbeid',
  };
  return labels[labelId] || labelId;
};

const PermisjonPeriode = ({ arbeidsforhold }: OwnProps) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>
    {arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0 && (
      <div>
        <VerticalSpacer sixteenPx />
        <BodyShort size="small">
          {getPermisjonLabel(arbeidsforhold)}
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
