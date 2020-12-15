import React from 'react';
import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import PropTypes from 'prop-types';
import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import arbeidsforholdKilder from '../../kodeverk/arbeidsforholdKilder';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';
import arbeidsforholdHandling from '../../kodeverk/arbeidsforholdHandling';

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
      value={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
    <RadioOption
      label={{ id: 'PersonArbeidsforholdDetailForm.FjernArbeidsforholdet' }}
      value={arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD}
      disabled={
        isKildeAaRegisteret(arbeidsforhold) ||
        arbeidsforhold.handlingType === arbeidsforholdHandlingType.LAGT_TIL_AV_SAKSBEHANDLER
      }
    />
  </RadioGroupField>
);

ArbeidsforholdRadioknapper.propTypes = {
  arbeidsforhold: arbeidsforholdPropType.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  formName: PropTypes.string.isRequired,
};

export default ArbeidsforholdRadioknapper;
