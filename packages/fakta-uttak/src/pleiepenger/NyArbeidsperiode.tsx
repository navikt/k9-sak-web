import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { behandlingForm } from '@fpsak-frontend/fp-felles/src/behandlingForm';
import { required, hasValidDecimalMaxNumberOfDecimals } from '@fpsak-frontend/utils';
import { numberRegex } from '@fpsak-frontend/utils/src/validation/validatorsHelper';
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
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import { Normaltekst } from 'nav-frontend-typografi';
import { arbeidsprosent } from './uttakUtils';
import styles from './uttakFaktaForm.less';
import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';
import { nyArbeidsperiodeFormName } from './constants';

interface NyArbeidsperiodeProps {
  oppdaterPerioder: (nyPeriode: ArbeidsforholdPeriode) => void;
  behandlingId: number;
  behandlingVersjon: number;
  avbryt: () => void;
  initialPeriodeValues?: ArbeidsforholdPeriode;
  formValues?: {
    timerIJobbTilVanlig: string;
    timerFårJobbet: string;
  };
}

const timerProsent = timer =>
  numberRegex.test(`${timer}`) ? (
    <Normaltekst>{`(${arbeidsprosent(`${timer}`.replace(',', '.'))}%)`}</Normaltekst>
  ) : null;

const NyArbeidsperiode: FunctionComponent<NyArbeidsperiodeProps & InjectedFormProps> = ({
  handleSubmit,
  pristine,
  avbryt,
  formValues,
  initialValues,
}) => {
  const { timerFårJobbet, timerIJobbTilVanlig } = formValues;
  return (
    <>
      <PeriodpickerField names={['fom', 'tom']} label={{ id: 'FaktaOmUttakForm.FomTom' }} validate={[required]} />
      <VerticalSpacer sixteenPx />
      <FlexRow>
        <FlexColumn>
          <InputField
            name="timerIJobbTilVanlig"
            validate={[required, hasValidDecimalMaxNumberOfDecimals(1)]}
            label={{ id: 'FaktaOmUttakForm.timerIJobbTilVanlig' }}
            bredde="S"
            inputMode="decimal"
          />
        </FlexColumn>
        <FlexColumn className={styles.alignWithInput}>{timerProsent(timerIJobbTilVanlig)}</FlexColumn>
      </FlexRow>
      <VerticalSpacer sixteenPx />
      <FlexRow>
        <FlexColumn>
          <InputField
            name="timerFårJobbet"
            validate={[required, hasValidDecimalMaxNumberOfDecimals(1)]}
            label={{ id: 'FaktaOmUttakForm.timerFårJobbet' }}
            bredde="S"
            inputMode="decimal"
          />
        </FlexColumn>
        <FlexColumn className={styles.alignWithInput}>{timerProsent(timerFårJobbet)}</FlexColumn>
      </FlexRow>
      <VerticalSpacer sixteenPx />
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Hovedknapp mini htmlType="button" onClick={handleSubmit} disabled={pristine}>
              <FormattedMessage
                id={initialValues ? 'FaktaOmUttakForm.BekreftEndringer' : 'FaktaOmUttakForm.LeggTilPeriode'}
              />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp htmlType="button" mini onClick={avbryt}>
              <FormattedMessage id="FaktaOmUttakForm.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer sixteenPx />
    </>
  );
};

interface NyArbeidsperiodeForm {
  fom: string;
  tom: string;
  timerIJobbTilVanlig: string;
  timerFårJobbet: string;
}

const transformValues = (values: NyArbeidsperiodeForm): ArbeidsforholdPeriode => ({
  ...values,
  timerIJobbTilVanlig: Number.parseFloat(`${values.timerIJobbTilVanlig}`.replace(',', '.')),
  timerFårJobbet: Number.parseFloat(`${values.timerFårJobbet}`.replace(',', '.')),
});

const mapStateToPropsFactory = (_initialState, initialOwnProps: NyArbeidsperiodeProps) => {
  const { oppdaterPerioder, avbryt, initialPeriodeValues } = initialOwnProps;
  const onSubmit = (values: NyArbeidsperiodeForm) => {
    oppdaterPerioder(transformValues(values));
    avbryt();
  };

  return (state, { behandlingId, behandlingVersjon }: NyArbeidsperiodeProps) => {
    const timerIJobbTilVanlig = behandlingFormValueSelector(
      nyArbeidsperiodeFormName,
      behandlingId,
      behandlingVersjon,
    )(state, 'timerIJobbTilVanlig');
    const timerFårJobbet = behandlingFormValueSelector(
      nyArbeidsperiodeFormName,
      behandlingId,
      behandlingVersjon,
    )(state, 'timerFårJobbet');

    return {
      onSubmit,
      form: nyArbeidsperiodeFormName,
      initialValues: initialPeriodeValues,
      formValues: { timerIJobbTilVanlig, timerFårJobbet },
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    enableReinitialize: true,
  })(NyArbeidsperiode),
);
