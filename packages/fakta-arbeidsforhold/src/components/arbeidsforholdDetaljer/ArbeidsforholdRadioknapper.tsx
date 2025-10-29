import { Label, RadioGroupField } from '@fpsak-frontend/form';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { required } from '@fpsak-frontend/utils';
import React from 'react';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';

interface OwnProps {
  formName: string;
  behandlingId: number;
  behandlingVersjon: number;
}

/**
 * Component: ArbeidsforholdRadioknapper
 * Ansvarlig for å håndtere visning av RadioKnapper for arbeidsforhold
 * som står i aksjonspunktet 5080 i fakta om arbeidsforhold.
 */
const ArbeidsforholdRadioknapper = ({
  behandlingId,
  behandlingVersjon,
  formName,
}: OwnProps & WrappedComponentProps) => (
  <RadioGroupField
    name="arbeidsforholdHandlingField"
    validate={[required]}
    isVertical
    radios={[
      {
        value: arbeidsforholdHandlingType.BASERT_PÅ_INNTEKTSMELDING,
        label: <Label input="Arbeidsforholdet er aktivt" textOnly />,
        element: (
          <BehandlingFormFieldCleaner
            formName={formName}
            fieldNames={['arbeidsforholdHandlingField']}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          >
            <LeggTilArbeidsforholdFelter
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              formName={formName}
              readOnly={false}
            />
          </BehandlingFormFieldCleaner>
        ),
      },
      {
        value: arbeidsforholdHandlingType.BRUK,
        label: <Label input="Fortsett behandling" textOnly />,
      },
    ]}
  />
);

export default injectIntl(ArbeidsforholdRadioknapper);
