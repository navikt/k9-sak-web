import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import {
  BehandlingspunktBegrunnelseTextField,
  ProsessPanelTemplate,
  VilkarResultPicker,
} from '@fpsak-frontend/fp-felles';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt, FastsattOpptjening, Opptjening, SubmitCallback, Vilkårresultat } from '@k9-sak-web/types';
import { Element } from 'nav-frontend-typografi';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import OpptjeningVilkarView from './OpptjeningVilkarView';
import VilkarFields from './VilkarFields';

const FORM_NAME = 'OpptjeningVilkarForm';

interface VilkårField {
  erVilkarOk: boolean;
  begrunnelse: string;
}

interface OpptjeningVilkarAksjonspunktPanelImplProps {
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  vilkårsresultat: Vilkårresultat;
  behandlingVersjon: number;
  fastsattOpptjening: FastsattOpptjening;
  isApOpen: boolean;
  lovReferanse?: string;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  vilkårIndex: number;
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
export const OpptjeningVilkarAksjonspunktPanelImpl = ({
  behandlingId,
  behandlingVersjon,
  erVilkarOk,
  fastsattOpptjening,
  isApOpen,
  lovReferanse,
  originalErVilkarOk,
  readOnly,
  readOnlySubmitButton,
  dirty,
  handleSubmit,
  form,
  vilkårIndex,
  opptjeninger,
  vilkarFields,
}: OpptjeningVilkarAksjonspunktPanelImplProps & StateProps & InjectedFormProps) => {
  const formProps = useMemo(
    () => ({
      handleSubmit,
      form,
    }),
    [handleSubmit, form],
  );

  const isFormComplete = () => {
    const isAllTabsCreated = opptjeninger.length === vilkarFields?.length;
    return isAllTabsCreated
      ? !vilkarFields.some(vilkarField => !vilkarField.begrunnelse || vilkarField.erVilkarOk === undefined)
      : false;
  };

  return (
    <ProsessPanelTemplate
      titleCode="OpptjeningVilkarAksjonspunktPanel.Opptjeningsvilkaret"
      isAksjonspunktOpen={isApOpen}
      formProps={formProps}
      isDirty={dirty}
      readOnlySubmitButton={readOnlySubmitButton}
      readOnly={readOnly}
      lovReferanse={lovReferanse}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      originalErVilkarOk={originalErVilkarOk}
      isPeriodisertFormComplete={isFormComplete()}
      rendreFakta={() => (
        <>
          <VerticalSpacer sixteenPx />
          <OpptjeningVilkarView
            months={fastsattOpptjening.opptjeningperiode.måneder}
            days={fastsattOpptjening.opptjeningperiode.dager}
            fastsattOpptjeningActivities={fastsattOpptjening.fastsattOpptjeningAktivitetList}
            opptjeningFomDate={fastsattOpptjening.opptjeningFom}
            opptjeningTomDate={fastsattOpptjening.opptjeningTom}
          />
        </>
      )}
    >
      <Element>
        <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.SokerHarVurdertOpptjentRettTilPleiepenger" />
      </Element>
      <VilkarFields erVilkarOk={erVilkarOk} readOnly={readOnly} fieldPrefix={`vilkarFields[${vilkårIndex}]`} />
    </ProsessPanelTemplate>
  );
};

export const buildInitialValues = createSelector(
  [
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.vilkårsresultat,
    ownProps => ownProps.aksjonspunkter,
    ownProps => ownProps.status,
    ownProps => ownProps.vilkårIndex,
  ],
  (vilkårsresultat, aksjonspunkter, status, vilkårIndex) => ({
    ...VilkarResultPicker.buildInitialValues(vilkårsresultat[vilkårIndex], aksjonspunkter, status),
    ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

interface Values {
  vilkarFields: VilkårField[];
}

const transformValues = (values: Values, aksjonspunkter: Aksjonspunkt[], opptjeninger: Opptjening[]) => ({
  vilkårPerioder: values.vilkarFields.map((vilkarField, index) => ({
    ...vilkarField,
    opptjeningFom: opptjeninger[index].fastsattOpptjening.opptjeningFom,
    opptjeningTom: opptjeninger[index].fastsattOpptjening.opptjeningTom,
  })),
  ...{ kode: aksjonspunkter[0].definisjon.kode },
});

const mapStateToPropsFactory = (initialState, initialOwnProps: OpptjeningVilkarAksjonspunktPanelImplProps) => {
  const { aksjonspunkter, submitCallback, vilkårIndex, opptjeninger } = initialOwnProps;
  const onSubmit = values => submitCallback([transformValues(values, aksjonspunkter, opptjeninger)]);

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
    )(state, `vilkarFields[${vilkårIndex}].erVilkarOk`),
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
  })(OpptjeningVilkarAksjonspunktPanelImpl),
);

export default OpptjeningVilkarAksjonspunktPanel;
