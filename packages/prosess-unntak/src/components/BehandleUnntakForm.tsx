import {
  RadioGroupField,
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import {
  AksjonspunktHelpText,
  FlexColumn,
  FlexContainer,
  FlexRow,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { Heading } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import FritekstTextField from './FritekstTextField';

const FORM_NAME = 'BehandleUnntakForm';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  sprakkode: string;
}

export const BehandleUnntakForm = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  handleSubmit,
  readOnlySubmitButton,
  sprakkode,
  ...formProps
}: OwnProps & InjectedFormProps) => (
  <form onSubmit={handleSubmit}>
    <FlexContainer>
      <FlexRow>
        <Heading size="small" level="2">
          <FormattedMessage id="Unntak.Title" />
        </Heading>
      </FlexRow>
      <VerticalSpacer twentyPx />

      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[
          <FormattedMessage
            id="Unntak.AvklarAkjsonspunkt"
            key={aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR}
          />,
        ]}
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />

      <FritekstTextField sprakkode={sprakkode} readOnly={readOnly} />

      <VerticalSpacer twentyPx />

      <RadioGroupField
        name="behandlingsresultat"
        validate={[required]}
        direction="horizontal"
        readOnly={readOnly}
        radios={[
          {
            value: behandlingResultatType.INNVILGET,
            label: <FormattedMessage id="Unntak.Innvilg" />,
          },
          {
            value: behandlingResultatType.AVSLATT,
            label: <FormattedMessage id="Unntak.Avslå" />,
          },
        ]}
      />

      <FlexColumn>
        <ProsessStegSubmitButton
          formName={formProps.form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isReadOnly={readOnly}
          isSubmittable={!readOnlySubmitButton}
          isBehandlingFormSubmitting={isBehandlingFormSubmitting}
          isBehandlingFormDirty={isBehandlingFormDirty}
          hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
        />
      </FlexColumn>
    </FlexContainer>
  </form>
);

export const buildInitialValues = createSelector(
  // @ts-ignore Fiks dette!
  [ownProps => ownProps.vilkårsresultat, ownProps => ownProps.behandlingsresultat, ownProps => ownProps.vilkar],
  (vilkårsresultat, behandlingsresultat, vilkar) => ({
    periode: vilkårsresultat ? vilkårsresultat[0].periode : null,
    avslagsårsak: vilkårsresultat ? vilkårsresultat[0].avslagsårsak : null,
    utfall: vilkårsresultat ? vilkårsresultat[0].utfall : null,
    behandlingsresultat: behandlingsresultat ? behandlingsresultat?.type : null,
    begrunnelse: vilkar ? vilkar[0].perioder[0].begrunnelse : null,
  }),
);

export const transformValues = values => ({
  periode: values.periode,
  avslagsårsak: values.avslagsårsak,
  utfall: values.utfall,
  behandlingResultatType: values.behandlingsresultat,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR,
});

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'periode',
      'begrunnelse',
      'avslagsårsak',
      'utfall',
    ),
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
  })(BehandleUnntakForm),
);
