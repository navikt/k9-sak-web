import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import InnlagtBarnPeriodeFieldArray from './InnlagtBarnPeriodeFieldArray';
import Legeerklaering from './Legeerklaering';
import styles from './medisinskVilkar.less';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';
import OmsorgspersonerPeriodeFieldArray from './OmsorgspersonerPeriodeFieldArray';

interface MedisinskVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  hasOpenAksjonspunkter: boolean;
  submittable: boolean;
}

interface StateProps {
  initialValues: any;
}

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const MedisinskVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  form,
  readOnly,
  hasOpenAksjonspunkter,
  submittable,
}: MedisinskVilkarFormProps & StateProps & InjectedFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <FlexContainer wrap>
        <FlexRow wrap>
          <FlexColumn className={styles.fieldColumn}>
            <Element>
              <FormattedMessage id="MedisinskVilkarForm.Innlagt" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField
              direction="vertical"
              name="innlagtField"
              bredde="M"
              validate={[required]}
              readOnly={readOnly}
            >
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
            </RadioGroupField>
            <FieldArray name="innlagtBarnPerioder" component={InnlagtBarnPeriodeFieldArray} props={{ readOnly }} />
            <VerticalSpacer thirtyTwoPx />

            <Element>
              <FormattedMessage id="MedisinskVilkarForm.Omsorgspersoner" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField
              direction="vertical"
              name="omsorgspersonerField"
              bredde="M"
              validate={[required]}
              readOnly={readOnly}
            >
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
            </RadioGroupField>
            <FieldArray
              name="omsorgspersonerPerioder"
              component={OmsorgspersonerPeriodeFieldArray}
              props={{ readOnly }}
            />
            <VerticalSpacer thirtyTwoPx />

            <Element>
              <FormattedMessage id="MedisinskVilkarForm.Beredskap" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField
              direction="vertical"
              name="nattevaakField"
              bredde="M"
              validate={[required]}
              readOnly={readOnly}
            >
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
            </RadioGroupField>

            <VerticalSpacer thirtyTwoPx />

            <Element>
              <FormattedMessage id="MedisinskVilkarForm.AlvorligSykdom" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField
              direction="vertical"
              name="sykdomField"
              bredde="M"
              validate={[required]}
              readOnly={readOnly}
            >
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
            </RadioGroupField>
            <TextAreaField
              name="begrunnelseSykdomField"
              label={<FormattedMessage id="MedisinskVilkarForm.NotatKommentar" />}
              validate={[required, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly} // TODO  && overstyringDisabled
            />

            <VerticalSpacer thirtyTwoPx />

            <Element>
              <FormattedMessage id="MedisinskVilkarForm.Tilsyn" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField
              direction="vertical"
              name="tilsynField"
              bredde="M"
              validate={[required]}
              readOnly={readOnly}
            >
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
            </RadioGroupField>
          </FlexColumn>

          <FlexColumn className={styles.fieldColumn}>
            <Legeerklaering readOnly={readOnly} />
            <MedisinskVilkarFormButtons
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              form={form}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
              readOnly={readOnly}
              submittable={submittable}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </form>
  );
};

const transformValues = values => ({
  kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, // TODO
  begrunnelse: values.begrunnelse,
  ...values,
});

const buildInitialValues = createSelector([], () => ({}));

const mapStateToPropsFactory = (state, props: MedisinskVilkarFormProps) => {
  const { submitCallback } = props;
  const onSubmit = values => submitCallback([transformValues(values)]);

  return () => ({
    onSubmit,
    initialValues: buildInitialValues(props),
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingFormTs({
    form: 'MedisinskVilkarForm',
  })(MedisinskVilkarForm),
);
