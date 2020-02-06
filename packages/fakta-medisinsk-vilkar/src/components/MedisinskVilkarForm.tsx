import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  dateRangesNotOverlapping,
  hasValidDate,
  required,
  minLength,
  maxLength,
  hasValidText,
} from '@fpsak-frontend/utils';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { FlexColumn, FlexRow, PeriodFieldArray, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { PeriodpickerField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import MedisinskVilkårConsts from '@k9-frontend/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import BehovForKontinuerligTilsynOgPleieFields from './BehovForKontinuerligTilsynOgPleieFields';
import DiagnosekodeSelector from './DiagnosekodeSelector';
import DiagnoseRadio from './DiagnoseRadio';
import InnlagtBarnPeriodeFieldArray from './InnlagtBarnPeriodeFieldArray';
import InnlagtBarnRadio from './InnlagtBarnRadio';
import Legeerklaering from './Legeerklaering';
import styles from './medisinskVilkar.less';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';

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
  [MedisinskVilkårConsts.PERIODER_MED_TILSYN_OG_PLEIE]: any;
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
          name={MedisinskVilkårConsts.INNLEGGELSESPERIODER}
          component={InnlagtBarnPeriodeFieldArray}
          props={{ readOnly, erInnlagt }}
        />
      </div>
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
            name={MedisinskVilkårConsts.PERIODER_MED_TILSYN_OG_PLEIE}
            rerenderOnEveryChange
            component={({ fields }) => {
              if (fields.length === 0) {
                fields.push({ fom: '', tom: '', behovForToOmsorgspersoner: undefined });
              }
              return (
                <div className={styles.pickerContainer}>
                  <PeriodFieldArray
                    fields={fields}
                    emptyPeriodTemplate={{
                      fom: '',
                      tom: '',
                    }}
                    shouldShowAddButton
                    readOnly={readOnly}
                  >
                    {(fieldId, index, getRemoveButton) => {
                      return (
                        <div className={styles.periodeContainer}>
                          <FlexRow key={fieldId} wrap>
                            <FlexColumn>
                              <PeriodpickerField
                                names={[
                                  `${fieldId}.${MedisinskVilkårConsts.FOM}`,
                                  `${fieldId}.${MedisinskVilkårConsts.TOM}`,
                                ]}
                                validate={[required, hasValidDate, dateRangesNotOverlapping]}
                                defaultValue={null}
                                readOnly={readOnly}
                                label={{ id: 'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder' }}
                              />
                            </FlexColumn>
                            <FlexColumn>{getRemoveButton()}</FlexColumn>
                          </FlexRow>
                          <FlexRow>
                            <FlexColumn>
                              <Element>
                                <FormattedMessage id="MedisinskVilkarForm.BehovForEnEllerToOmsorgspersoner" />
                              </Element>
                              <VerticalSpacer eightPx />
                              <TextAreaField
                                name={`${fieldId}.${MedisinskVilkårConsts.BEGRUNNELSE}`}
                                label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                                validate={[required, minLength(3), maxLength(400), hasValidText]}
                                readOnly={readOnly}
                              />
                              <RadioGroupField
                                name={`${fieldId}.behovForToOmsorgspersoner`}
                                bredde="M"
                                validate={[required]}
                                readOnly={readOnly}
                              >
                                <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJaHele' }} value="jaHele" />
                                <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJaDeler' }} value="jaDeler" />
                                <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value="nei" />
                              </RadioGroupField>
                            </FlexColumn>
                          </FlexRow>
                          {fields.get(index).behovForToOmsorgspersoner === 'jaDeler' && (
                            <FlexRow>
                              <FieldArray
                                name={MedisinskVilkårConsts.PERIODER_MED_UTVIDET_TILSYN_OG_PLEIE}
                                component={utvidetTilsynFieldProps => {
                                  return (
                                    <PeriodFieldArray
                                      fields={utvidetTilsynFieldProps.fields}
                                      emptyPeriodTemplate={{
                                        fom: '',
                                        tom: '',
                                      }}
                                      shouldShowAddButton
                                      readOnly={readOnly}
                                    >
                                      {fieldProps => (
                                        <>
                                          <FlexColumn>
                                            <PeriodpickerField
                                              names={[`${fieldProps}.fom`, `${fieldProps}.tom`]}
                                              validate={[required, hasValidDate, dateRangesNotOverlapping]}
                                              defaultValue={null}
                                              readOnly={readOnly}
                                              label={{ id: 'MedisinskVilkarForm.BehovForTo.Periode' }}
                                            />
                                          </FlexColumn>
                                        </>
                                      )}
                                    </PeriodFieldArray>
                                  );
                                }}
                              />
                            </FlexRow>
                          )}
                        </div>
                      );
                    }}
                  </PeriodFieldArray>
                </div>
              );
            }}
            props={{ readOnly }}
          />
        )}
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

  return state => ({
    onSubmit,
    // initialValues: buildInitialValues({ legeerklaeringDto }),
    [MedisinskVilkårConsts.DIAGNOSEKODE]: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, MedisinskVilkårConsts.DIAGNOSEKODE),
    erInnlagt: !!behandlingFormValueSelector(formName, props.behandlingId, props.behandlingVersjon)(state, 'erInnlagt'),
    behovForToOmsorgspersoner: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, 'behovForToOmsorgspersoner'),
    harBehovForKontinuerligTilsynOgPleie: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, 'harBehovForKontinuerligTilsynOgPleie'),
    [MedisinskVilkårConsts.PERIODER_MED_TILSYN_OG_PLEIE]: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    ),
    harDiagnose: !!behandlingFormValueSelector(
      formName,
      props.behandlingId,
      props.behandlingVersjon,
    )(state, 'harDiagnose'),
  });
};

const connectedComponent = connect(mapStateToPropsFactory)(
  behandlingFormTs({
    form: formName,
    enableReinitialize: true,
  })(MedisinskVilkarForm),
);

export default injectIntl(connectedComponent);
