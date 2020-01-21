import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import DiagnoseFieldArray from './DiagnoseFieldArray';
import InnlagtBarnPeriodeFieldArray from './InnlagtBarnPeriodeFieldArray';
import Legeerklaering from './Legeerklaering';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';
import OmsorgspersonerPeriodeFieldArray from './OmsorgspersonerPeriodeFieldArray';

interface MedisinskVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  hasOpenAksjonspunkter: boolean;
  submittable: boolean;
  intl: IntlShape;
}

interface StateProps {
  initialValues: any;
  hasDiagnose: boolean;
  isInnlagt: boolean;
  toOmsorgspersoner: boolean;
}

interface Periode {
  fom: string;
  tom: string;
}

interface LegeerklaeringDto {
  beredskapNattevak: boolean;
  diagnose: boolean;
  innlagt: boolean;
  innlagtBarnPerioder: Periode[];
  legeerklaeringSignatar: string;
  omsorgspersoner: boolean;
  omsorgspersonerPerioder: Periode[];
}

// const minLength3 = minLength(3);
// const maxLength1500 = maxLength(1500);

const formName = 'MedisinskVilkarForm';

const MedisinskVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  form,
  readOnly,
  hasOpenAksjonspunkter,
  submittable,
  intl,
  hasDiagnose,
  isInnlagt,
  toOmsorgspersoner,
}: MedisinskVilkarFormProps & StateProps & InjectedFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <Element>
        <FormattedMessage id="MedisinskVilkarForm.Innlagt" />
      </Element>
      <VerticalSpacer eightPx />
      <RadioGroupField name="innlagt" bredde="M" validate={[required]} readOnly={readOnly}>
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
      </RadioGroupField>
      <FieldArray name="innlagtBarnPerioder" component={InnlagtBarnPeriodeFieldArray} props={{ readOnly, isInnlagt }} />
      <VerticalSpacer twentyPx />

      <Element>
        <FormattedMessage id="MedisinskVilkarForm.Omsorgspersoner" />
      </Element>
      <VerticalSpacer eightPx />
      <RadioGroupField name="omsorgspersoner" bredde="M" validate={[required]} readOnly={readOnly}>
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
      </RadioGroupField>
      <FieldArray
        name="omsorgspersonerPerioder"
        component={OmsorgspersonerPeriodeFieldArray}
        props={{ readOnly, toOmsorgspersoner }}
      />
      <VerticalSpacer twentyPx />

      <Element>
        <FormattedMessage id="MedisinskVilkarForm.Beredskap" />
      </Element>
      <VerticalSpacer eightPx />
      <RadioGroupField name="beredskapNattevak" bredde="M" validate={[required]} readOnly={readOnly}>
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
      </RadioGroupField>

      <VerticalSpacer twentyPx />

      {/* <Element>
              <FormattedMessage id="MedisinskVilkarForm.Beredskap" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField name="nattevaakField" bredde="M" validate={[required]} readOnly={readOnly}>
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
            </RadioGroupField>

            <VerticalSpacer twentyPx /> */}

      <Element>
        <FormattedMessage id="MedisinskVilkarForm.Diagnose" />
      </Element>
      <VerticalSpacer eightPx />
      <RadioGroupField name="diagnose" bredde="M" validate={[required]} readOnly={readOnly}>
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
        <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
      </RadioGroupField>
      <FieldArray name="diagnoser" component={DiagnoseFieldArray} props={{ readOnly, intl, hasDiagnose }} />
      {/* <SelectField
              readOnly={readOnly}
              name="diagnoseFieldArray"
              label=""
              validate={[required]}
              placeholder={intl.formatMessage({ id: 'MedisinskVilkarForm.DiagnoseArray' })}
              selectValues={[
                <option value="lol" key="lol">
                   <FormattedMessage id="MedisinskVilkarForm.F-90" />
                  test
                </option>,
              ]}
            /> */}

      <VerticalSpacer twentyPx />

      {/* <Element>
              <FormattedMessage id="MedisinskVilkarForm.AlvorligSykdom" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField

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

            <VerticalSpacer twentyPx /> */}

      {/* <Element>
              <FormattedMessage id="MedisinskVilkarForm.Tilsyn" />
            </Element>
            <VerticalSpacer eightPx />
            <RadioGroupField

              name="tilsynField"
              bredde="M"
              validate={[required]}
              readOnly={readOnly}
            >
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
              <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
            </RadioGroupField> */}
      <Legeerklaering readOnly={readOnly} />
      <VerticalSpacer twentyPx />
      <MedisinskVilkarFormButtons
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        form={form}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
        submittable={submittable}
      />
    </form>
  );
};

const getValidLegeerklaeringSignatar = (signatar: string) => {
  const validLegeerklaeringSignatar = ['sykehuslege', 'legeispesialisthelsetjenesten', 'fastlege', 'annenyrkesgruppe'];
  return validLegeerklaeringSignatar.includes(signatar) ? signatar : '';
};

const transformValues = values => ({
  kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, // TODO
  begrunnelse: values.begrunnelseLegeerklaering,
  ...values,
});

const buildInitialValues = createSelector(
  [(props: { legeerklaeringDto: LegeerklaeringDto }) => props.legeerklaeringDto],
  legeerklaeringDto => {
    const legeerklaeringSignatar = getValidLegeerklaeringSignatar(legeerklaeringDto.legeerklaeringSignatar);

    return {
      ...legeerklaeringDto,
      legeerklaeringSignatar,
    };
  },
);

const mapStateToPropsFactory = (_, props: MedisinskVilkarFormProps) => {
  const { submitCallback } = props;
  const onSubmit = values => submitCallback([transformValues(values)]);

  const legeerklaeringDto = {
    innlagt: true,
    innlagtBarnPerioder: [
      {
        fom: '2019-09-16',
        tom: '2019-10-16',
      },
    ],
    omsorgspersoner: true,
    omsorgspersonerPerioder: [
      {
        fom: '2019-11-09',
        tom: '2019-12-24',
      },
    ],
    beredskapNattevak: true,
    diagnose: true,
    legeerklaeringSignatar: 'fastlege',
  };

  return state => ({
    onSubmit,
    initialValues: buildInitialValues({ legeerklaeringDto }),
    hasDiagnose: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, 'diagnose'),
    isInnlagt: !!behandlingFormValueSelector(formName, props.behandlingId, props.behandlingVersjon)(state, 'innlagt'),
    toOmsorgspersoner: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, 'omsorgspersoner'),
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingFormTs({
    form: formName,
    enableReinitialize: true,
  })(MedisinskVilkarForm),
);
