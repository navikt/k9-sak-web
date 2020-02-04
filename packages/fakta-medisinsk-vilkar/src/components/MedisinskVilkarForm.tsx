import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import BeredskapRadio from './BeredskapRadio';
import DiagnoseFieldArray from './DiagnoseFieldArray';
import DiagnoseRadio from './DiagnoseRadio';
import InnlagtBarnPeriodeFieldArray from './InnlagtBarnPeriodeFieldArray';
import InnlagtBarnRadio from './InnlagtBarnRadio';
import Legeerklaering from './Legeerklaering';
import styles from './medisinskVilkar.less';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';
import OmsorgspersonerPeriodeFieldArray from './OmsorgspersonerPeriodeFieldArray';
import OmsorgspersonerRadio from './OmsorgspersonerRadio';

interface MedisinskVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  hasOpenAksjonspunkter: boolean;
  submittable: boolean;
}

interface StateProps {
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

const formName = 'MedisinskVilkarForm';

export const MedisinskVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  form,
  readOnly,
  hasOpenAksjonspunkter,
  submittable,
  hasDiagnose,
  isInnlagt,
  toOmsorgspersoner,
  intl,
}: MedisinskVilkarFormProps & StateProps & InjectedFormProps & WrappedComponentProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.fieldContainer}>
        <InnlagtBarnRadio readOnly={readOnly} />
        <FieldArray
          name="innlagtBarnPerioder"
          component={InnlagtBarnPeriodeFieldArray}
          props={{ readOnly, isInnlagt }}
        />
      </div>
      <div className={styles.fieldContainer}>
        <OmsorgspersonerRadio readOnly={readOnly} />
        <FieldArray
          name="omsorgspersonerPerioder"
          component={OmsorgspersonerPeriodeFieldArray}
          props={{ readOnly, toOmsorgspersoner }}
        />
      </div>
      <div className={styles.fieldContainer}>
        <BeredskapRadio readOnly={readOnly} />
      </div>
      <div className={styles.fieldContainer}>
        <DiagnoseRadio readOnly={readOnly} />
        <FieldArray name="diagnoser" component={DiagnoseFieldArray} props={{ readOnly, intl, hasDiagnose }} />
      </div>
      <div className={styles.fieldContainer}>
        <Legeerklaering readOnly={readOnly} />
      </div>
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
  kode: aksjonspunktCodes.MEDISINSK_VILKAAR,
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

const connectedComponent = connect(mapStateToPropsFactory)(
  behandlingFormTs({
    form: formName,
    enableReinitialize: true,
  })(MedisinskVilkarForm),
);

export default injectIntl(connectedComponent);
