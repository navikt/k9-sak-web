import { behandlingForm, behandlingFormValueSelector, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { VilkarResultPicker, ProsessStegBegrunnelseTextField, ProsessPanelTemplate } from '@k9-sak-web/prosess-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Opptjening, SubmitCallback, Vilkårresultat, Vilkarperiode } from '@k9-sak-web/types';
import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import VilkarFields from './VilkarFields';

const FORM_NAME = 'OpptjeningVilkarForm';

const midlertidigInaktiv = {
  TYPE_A: '7847A',
  TYPE_B: '7847B',
};

interface VilkårField {
  erVilkarOk: boolean;
  begrunnelse: string;
}

interface OpptjeningVilkarAksjonspunktPanelImplProps {
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  vilkårsresultat: Vilkårresultat;
  behandlingVersjon: number;
  isApOpen: boolean;
  lovReferanse?: string;
  erOmsorgspenger?: boolean;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  periodeIndex: number;
  vilkårPerioder: Vilkarperiode[];
  opptjeninger: Opptjening[];
  vilkarFields: VilkårField[];
}

interface StateProps {
  erVilkarOk: boolean;
  originalErVilkarOk: boolean;
}

/**
 * OpptjeningVilkarAksjonspunktPanel
 *
 * Presentasjonskomponent. Viser panel for å løse aksjonspunkt for avslått opptjeningsvilkår
 */
export const OpptjeningVilkarAksjonspunktPanelImpl: FunctionComponent<
  OpptjeningVilkarAksjonspunktPanelImplProps & StateProps & InjectedFormProps & WrappedComponentProps
> = ({
  intl,
  behandlingId,
  behandlingVersjon,
  erVilkarOk,
  isApOpen,
  lovReferanse,
  erOmsorgspenger,
  originalErVilkarOk,
  readOnly,
  readOnlySubmitButton,
  dirty,
  handleSubmit,
  form,
  periodeIndex,
  vilkårPerioder,
  vilkarFields,
}) => {
  const formProps = useMemo(
    () => ({
      handleSubmit,
      form,
    }),
    [handleSubmit, form],
  );

  const isFormComplete = () => {
    const isAllTabsCreated = Array.isArray(vilkårPerioder) && vilkårPerioder.length === vilkarFields?.length;
    return isAllTabsCreated
      ? !vilkarFields.some(vilkarField => !vilkarField.begrunnelse || vilkarField.erVilkarOk === undefined)
      : false;
  };

  return (
    <ProsessPanelTemplate
      title={intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.Opptjeningsvilkaret' })}
      isAksjonspunktOpen={isApOpen}
      formName={formProps.form}
      handleSubmit={formProps.handleSubmit}
      isDirty={dirty}
      readOnlySubmitButton={readOnlySubmitButton}
      readOnly={readOnly}
      lovReferanse={lovReferanse}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      originalErVilkarOk={originalErVilkarOk}
      isPeriodisertFormComplete={isFormComplete()}
    >
      <Element>
        <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.SokerHarVurdertOpptjentRettTilOmsorgspenger" />
      </Element>

      <VerticalSpacer sixteenPx />

      {!erOmsorgspenger ? (
        <RadioGroupField name="innvilgelseMerknadKode" validate={[required]}>
          <RadioOption
            label={{ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivA' }}
            value={midlertidigInaktiv.TYPE_A}
          />
          <RadioOption
            label={{ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivB' }}
            value={midlertidigInaktiv.TYPE_B}
          />
        </RadioGroupField>
      ) : null}

      <VilkarFields erVilkarOk={erVilkarOk} readOnly={readOnly} fieldPrefix={`vilkarFields[${periodeIndex}]`} />
    </ProsessPanelTemplate>
  );
};

export const buildInitialValues = createSelector(
  [
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.vilkårsresultat,
    ownProps => ownProps.aksjonspunkter,
    ownProps => ownProps.status,
  ],
  (vilkårsresultat, aksjonspunkter, status) => ({
    ...VilkarResultPicker.buildInitialValues(vilkårsresultat?.avslagsårsak?.kode, aksjonspunkter, status),
    ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

interface Values {
  vilkarFields: VilkårField[];
  innvilgelseMerknadKode: string;
}

const transformValues = (
  values: Values,
  erOmsorgspenger: boolean,
  aksjonspunkter: Aksjonspunkt[],
  vilkårPerioder: Vilkarperiode[],
  opptjeninger: Opptjening[],
) => ({
  vilkårPeriodeVurderinger: values.vilkarFields.map((vilkarField, index) => ({
    ...vilkarField,
    innvilgelseMerknadKode: erOmsorgspenger ? midlertidigInaktiv.TYPE_B : values.innvilgelseMerknadKode,
    periode: Array.isArray(vilkårPerioder) && vilkårPerioder[index] ? vilkårPerioder[index].periode : {},
  })),
  opptjeningPerioder: Array.isArray(opptjeninger)
    ? opptjeninger.map(opptjening => ({
        fom: opptjening.fastsattOpptjening.opptjeningFom,
        tom: opptjening.fastsattOpptjening.opptjeningTom,
      }))
    : [],
  ...{ kode: Array.isArray(aksjonspunkter) && aksjonspunkter.length ? aksjonspunkter[0].definisjon.kode : null },
});

const mapStateToPropsFactory = (initialState, initialOwnProps: OpptjeningVilkarAksjonspunktPanelImplProps) => {
  const {
    erOmsorgspenger,
    aksjonspunkter,
    submitCallback,
    periodeIndex,
    vilkårPerioder,
    opptjeninger,
  } = initialOwnProps;
  const onSubmit = values =>
    submitCallback([transformValues(values, erOmsorgspenger, aksjonspunkter, vilkårPerioder, opptjeninger)]);

  const isOpenAksjonspunkt = initialOwnProps.aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === initialOwnProps.status;

  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    originalErVilkarOk: erVilkarOk,
    erVilkarOk: behandlingFormValueSelector(
      FORM_NAME,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, `vilkarFields[${periodeIndex}].erVilkarOk`),
    lovReferanse: ownProps.lovReferanse,
    vilkarFields: behandlingFormValueSelector(
      FORM_NAME,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, `vilkarFields`),
  });
};

const OpptjeningVilkarAksjonspunktPanel = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
    enableReinitialize: true,
  })(injectIntl(OpptjeningVilkarAksjonspunktPanelImpl)),
);

export default OpptjeningVilkarAksjonspunktPanel;
