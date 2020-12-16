import React from 'react';
import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import PropTypes from 'prop-types';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { arbeidsforholdV2PropType } from '@fpsak-frontend/prop-types/src/arbeidsforholdPropType';
import arbeidsforholdKilder from '../../kodeverk/arbeidsforholdKilder';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';

const isKildeAaRegisteret = arbeidsforhold =>
  arbeidsforhold.kilde && arbeidsforhold.kilde.includes(arbeidsforholdKilder.AAREGISTERET);

/**
 * Component: ArbeidsforholdRadioknapper
 * Ansvarlig for å håndtere visning av RadioKnapper for arbeidsforhold
 * som står i aksjonspunktet 5080 i fakta om arbeidsforhold.
 */
const ArbeidsforholdRadioknapper = ({ arbeidsforhold, behandlingId, behandlingVersjon, formName }) => (
  <RadioGroupField name="arbeidsforholdHandlingField" validate={[required]} direction="vertical">
    <RadioOption
      label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt' }}
      value={arbeidsforholdHandlingType.LAGT_TIL_AV_SAKSBEHANDLER}
    >
      <BehandlingFormFieldCleaner formName={formName} fieldNames={['aktivtArbeidsforholdHandlingField']}>
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
      value={arbeidsforholdHandlingType.BASERT_PÅ_INNTEKTSMELDING}
      disabled={isKildeAaRegisteret(arbeidsforhold)}
    />
  </RadioGroupField>
);

ArbeidsforholdRadioknapper.propTypes = {
  arbeidsforhold: arbeidsforholdV2PropType.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  formName: PropTypes.string.isRequired,
};

export default ArbeidsforholdRadioknapper;
