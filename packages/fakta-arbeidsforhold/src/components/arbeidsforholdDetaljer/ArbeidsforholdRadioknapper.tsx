import { RadioGroupField, RadioOption } from '@k9-sak-web/form';
import arbeidsforholdHandlingType from '@k9-sak-web/kodeverk/src/arbeidsforholdHandlingType';
import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { required } from '@k9-sak-web/utils';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
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
