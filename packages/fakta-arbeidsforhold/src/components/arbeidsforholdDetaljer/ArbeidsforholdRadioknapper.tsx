import React from 'react';
import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';

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
  <RadioGroupField name="arbeidsforholdHandlingField" validate={[required]} direction="vertical">
    <RadioOption
      label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt' }}
      value={arbeidsforholdHandlingType.BASERT_PÅ_INNTEKTSMELDING}
    >
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
    </RadioOption>
    <VerticalSpacer eightPx />
    <RadioOption
      label={{ id: 'PersonArbeidsforholdDetailForm.FortsettBehandling' }}
      value={arbeidsforholdHandlingType.BRUK}
    />
  </RadioGroupField>
);

export default injectIntl(ArbeidsforholdRadioknapper);
