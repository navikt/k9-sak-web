import React, { FunctionComponent } from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import FlexColumn from '@fpsak-frontend/shared-components/src/flexGrid/FlexColumn';
import PeriodpickerField from '@fpsak-frontend/form/src/PeriodpickerField';
import InputField from '@fpsak-frontend/form/src/InputField';
import { ArbeidsforholdPeriode } from './UttakFaktaIndex2';

interface ArbeidsperiodeOwnProps {
  readOnly: boolean;
}

const Arbeidsperioder: FunctionComponent<WrappedFieldArrayProps<ArbeidsforholdPeriode> & ArbeidsperiodeOwnProps> = ({
  fields,
  readOnly,
}) => (
  <>
    {fields.map(fieldId => (
      <fieldset key={fieldId}>
        <FlexRow>
          <FlexColumn>
            <PeriodpickerField
              names={[`${fieldId}.fom`, `${fieldId}.tom`]}
              label={{ id: 'FaktaOmUttakForm.FomTom' }}
              readOnly={readOnly}
            />
          </FlexColumn>
          <FlexColumn>
            <InputField
              readOnly={readOnly}
              name={`${fieldId}.timerIJobbTilVanlig`}
              label={{ id: 'FaktaOmUttakForm.timerIJobbTilVanlig' }}
              bredde="S"
            />
          </FlexColumn>
          <FlexColumn>
            <InputField
              readOnly={readOnly}
              name={`${fieldId}.timerFårJobbet`}
              label={{ id: 'FaktaOmUttakForm.timerFårJobbet' }}
              bredde="S"
            />
          </FlexColumn>
        </FlexRow>
      </fieldset>
    ))}
  </>
);

export default Arbeidsperioder;
