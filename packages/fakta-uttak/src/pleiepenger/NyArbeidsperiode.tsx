import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { behandlingForm } from '@fpsak-frontend/fp-felles/src/behandlingForm';
import { required, hasValidDecimalMaxNumberOfDecimals } from '@fpsak-frontend/utils';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import FlexColumn from '@fpsak-frontend/shared-components/src/flexGrid/FlexColumn';
import PeriodpickerField from '@fpsak-frontend/form/src/PeriodpickerField';
import InputField from '@fpsak-frontend/form/src/InputField';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';
import { FormattedMessage } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import { InjectedFormProps } from 'redux-form';
import { FlexContainer } from '@fpsak-frontend/shared-components/index';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import { ArbeidsforholdPeriode } from './UttakFaktaIndex2';

interface NyArbeidsperiodeProps {
  oppdaterPerioder: (nyPeriode: ArbeidsforholdPeriode) => ArbeidsforholdPeriode[];
  id: string;
  behandlingId: number;
  behandlingVersjon: number;
  avbryt: () => void;
}

export const formName = id => `UttakFaktaForm-${id}`;

// TODO anders: vis % av vanlig arbeid når begge er fylt inn
const NyArbeidsperiode: FunctionComponent<NyArbeidsperiodeProps & InjectedFormProps> = ({
  handleSubmit,
  pristine,
  avbryt,
}) => (
  <>
    <fieldset>
      <FlexRow>
        <FlexColumn>
          <PeriodpickerField names={['fom', 'tom']} label={{ id: 'FaktaOmUttakForm.FomTom' }} validate={[required]} />
        </FlexColumn>
        <FlexColumn>
          <InputField
            name="timerIJobbTilVanlig"
            validate={[required, hasValidDecimalMaxNumberOfDecimals(1)]}
            label={{ id: 'FaktaOmUttakForm.timerIJobbTilVanlig' }}
            bredde="S"
            inputMode="decimal"
          />
        </FlexColumn>
        <FlexColumn>
          <InputField
            name="timerFårJobbet"
            validate={[required, hasValidDecimalMaxNumberOfDecimals(1)]}
            label={{ id: 'FaktaOmUttakForm.timerFårJobbet' }}
            bredde="S"
            inputMode="decimal"
          />
        </FlexColumn>
      </FlexRow>
    </fieldset>
    <VerticalSpacer sixteenPx />
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <Hovedknapp mini htmlType="button" onClick={handleSubmit} disabled={pristine}>
            <FormattedMessage id="FaktaOmUttakForm.Oppdater" />
          </Hovedknapp>
        </FlexColumn>
        <FlexColumn>
          <Knapp htmlType="button" mini onClick={avbryt}>
            <FormattedMessage id="FaktaOmUttakForm.Avbryt" />
          </Knapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </>
);

interface NyArbeidsperiodeForm {
  fom: string;
  tom: string;
  timerIJobbTilVanlig: string;
  timerFårJobbet: string;
}

const transformValues = (values: NyArbeidsperiodeForm): ArbeidsforholdPeriode => ({
  ...values,
  timerIJobbTilVanlig: Number.parseFloat(values.timerIJobbTilVanlig.replace(',', '.')),
  timerFårJobbet: Number.parseFloat(values.timerFårJobbet.replace(',', '.')),
});

const mapStateToPropsFactory = (_initialState, initialOwnProps: NyArbeidsperiodeProps) => {
  const { oppdaterPerioder, id, avbryt } = initialOwnProps;
  const onSubmit = (values: NyArbeidsperiodeForm) => {
    oppdaterPerioder(transformValues(values));
    avbryt();
  };

  return () => ({
    onSubmit,
    form: formName(id),
    initialValues: {},
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    enableReinitialize: true,
  })(NyArbeidsperiode),
);
