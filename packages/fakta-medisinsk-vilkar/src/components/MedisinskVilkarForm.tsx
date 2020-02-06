import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import MedisinskVilkårValues from '../types/MedisinskVilkårValues';
// import BehovForEnEllerToOmsorgspersonerFields from './BehovForEnEllerToOmsorgspersonerFields';
import BehovForKontinuerligTilsynOgPleieFields from './BehovForKontinuerligTilsynOgPleieFields';
import DiagnosekodeSelector from './DiagnosekodeSelector';
import DiagnoseRadio from './DiagnoseRadio';
import InnlagtBarnPeriodeFieldArray from './InnlagtBarnPeriodeFieldArray';
import InnlagtBarnRadio from './InnlagtBarnRadio';
import Legeerklaering from './Legeerklaering';
import styles from './medisinskVilkar.less';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';
// import OmsorgspersonerPeriodeFieldArray from './OmsorgspersonerPeriodeFieldArray';
// import OmsorgspersonerRadio from './OmsorgspersonerRadio';
import PerioderMedBehovForKontinuerligTilsynOgPleieFieldArray from './PerioderMedBehovForKontinuerligTilsynOgPleieFieldArray';

interface MedisinskVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  hasOpenAksjonspunkter: boolean;
  submittable: boolean;
}

interface StateProps {
  harDiagnose: boolean;
  erInnlagt: boolean;
  harBehovForToOmsorgspersoner: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
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
  harBehovForKontinuerligTilsynOgPleie: boolean;
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
  harDiagnose,
  erInnlagt,
  // harBehovForToOmsorgspersoner,
  harBehovForKontinuerligTilsynOgPleie,
}: MedisinskVilkarFormProps & StateProps & InjectedFormProps & WrappedComponentProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.headingContainer}>
        <Systemtittel>
          <FormattedMessage id="MedisinskVilkarForm.Fakta" />
        </Systemtittel>
      </div>
      <div className={styles.fieldContainer}>
        <InnlagtBarnRadio readOnly={readOnly} />
        <FieldArray
          name={MedisinskVilkårValues.INNLEGGELSESPERIODER}
          component={InnlagtBarnPeriodeFieldArray}
          props={{ readOnly, erInnlagt }}
        />
      </div>
      {/* <div className={styles.fieldContainer}>
        <OmsorgspersonerRadio readOnly={readOnly} />
        <FieldArray
          name="omsorgspersonerPerioder"
          component={OmsorgspersonerPeriodeFieldArray}
          props={{ readOnly, harBehovForToOmsorgspersoner }}
        />
      </div> */}
      {/* <div className={styles.fieldContainer}>
        <BeredskapRadio readOnly={readOnly} />
      </div> */}
      <div className={styles.fieldContainer}>
        <DiagnoseRadio readOnly={readOnly} />
        {harDiagnose && <DiagnosekodeSelector readOnly={readOnly} />}
      </div>
      <div className={styles.fieldContainer}>
        <Legeerklaering readOnly={readOnly} />
      </div>
      <div className={styles.headingContainer}>
        <Systemtittel>
          <FormattedMessage id="MedisinskVilkarForm.Vilkår" />
        </Systemtittel>
      </div>
      <div className={styles.fieldContainer}>
        <BehovForKontinuerligTilsynOgPleieFields readOnly={readOnly} />
        {harBehovForKontinuerligTilsynOgPleie && (
          <FieldArray
            name={MedisinskVilkårValues.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
            component={PerioderMedBehovForKontinuerligTilsynOgPleieFieldArray}
            props={{ readOnly }}
          />
        )}
      </div>
      {/* <div className={styles.fieldContainer}>
        <BehovForEnEllerToOmsorgspersonerFields readOnly={readOnly} />
        <FieldArray
          name="perioderMedBehovForEnEllerToOmsorgspersoner"
          component={PerioderMedBehovForEnEllerToOmsorgspersonerFieldArray}
          props={{ readOnly }}
        />
      </div> */}
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

// const getValidLegeerklaeringSignatar = (signatar: string) => {
//   const validLegeerklaeringSignatar = ['sykehuslege', 'legeispesialisthelsetjenesten', 'fastlege', 'annenyrkesgruppe'];
//   return validLegeerklaeringSignatar.includes(signatar) ? signatar : '';
// };

const transformValues = values => ({
  kode: aksjonspunktCodes.MEDISINSK_VILKAAR,
  begrunnelse: values.begrunnelseLegeerklaering,
  ...values,
});

// const buildInitialValues = createSelector(
//   [(props: { legeerklaeringDto: LegeerklaeringDto }) => props.legeerklaeringDto],
//   legeerklaeringDto => {
//     const legeerklaeringSignatar = getValidLegeerklaeringSignatar(legeerklaeringDto.legeerklaeringSignatar);

//     return {
//       ...legeerklaeringDto,
//       legeerklaeringSignatar,
//     };
//   },
// );

const mapStateToPropsFactory = (_, props: MedisinskVilkarFormProps) => {
  const { submitCallback } = props;
  const onSubmit = values => submitCallback([transformValues(values)]);

  // const legeerklaeringDto = {
  //   erInnlagt: true,
  //   innlagtBarnPerioder: [
  //     {
  //       fom: '2019-09-16',
  //       tom: '2019-10-16',
  //     },
  //   ],
  //   harBehovForToOmsorgspersoner: true,
  //   omsorgspersonerPerioder: [
  //     {
  //       fom: '2019-11-09',
  //       tom: '2019-12-24',
  //     },
  //   ],
  //   harBehovForBeredskapNattevaak: true,
  //   harDiagnose: true,
  //   legeerklaeringSignatar: 'fastlege',
  // };

  return state => ({
    onSubmit,
    // initialValues: buildInitialValues({ legeerklaeringDto }),
    [MedisinskVilkårValues.HAR_DIAGNOSE]: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, MedisinskVilkårValues.HAR_DIAGNOSE),
    [MedisinskVilkårValues.ER_INNLAGT]: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, MedisinskVilkårValues.ER_INNLAGT),
    [MedisinskVilkårValues.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, MedisinskVilkårValues.HAR_BEHOV_FOR_TO_OMSORGSPERSONER),
    [MedisinskVilkårValues.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, MedisinskVilkårValues.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE),
  });
};

const connectedComponent = connect(mapStateToPropsFactory)(
  behandlingFormTs({
    form: formName,
    enableReinitialize: true,
  })(MedisinskVilkarForm),
);

export default injectIntl(connectedComponent);
