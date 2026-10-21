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
import { aksjonspunktStatus, type AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType, type AksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import OverstyringAksjonspunktVarsel from '@k9-sak-web/gui/shared/overstyring/OverstyringAksjonspunktVarsel.js';
import { skalViseOverstyringAksjonspunktVarsel } from '@k9-sak-web/gui/shared/overstyring/overstyringsaksjonspunkt.js';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Kodeverk } from '@k9-sak-web/types';
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
  språkkode: Kodeverk;
  aksjonspunkter?: Aksjonspunkt[];
  erOverstyrer?: boolean;
}

const aksjonspunktTyper: ReadonlyArray<string> = Object.values(aksjonspunktType);
const aksjonspunktStatuser: ReadonlyArray<string> = Object.values(aksjonspunktStatus);
const erAksjonspunktType = (kode: string): kode is AksjonspunktType => aksjonspunktTyper.includes(kode);
const erAksjonspunktStatus = (kode: string): kode is AksjonspunktStatus => aksjonspunktStatuser.includes(kode);
const tilAksjonspunktType = (kode?: string) => (kode !== undefined && erAksjonspunktType(kode) ? kode : undefined);
const tilAksjonspunktStatus = (kode?: string) => (kode !== undefined && erAksjonspunktStatus(kode) ? kode : undefined);

const OverstyringVarsel = ({
  aksjonspunkter,
  erOverstyrer,
}: {
  aksjonspunkter: Aksjonspunkt[];
  erOverstyrer: boolean;
}) => {
  const aksjonspunkterForVarsel = aksjonspunkter.map(ap => ({
    aksjonspunktType: tilAksjonspunktType(ap.aksjonspunktType?.kode),
    status: tilAksjonspunktStatus(ap.status?.kode),
  }));
  if (!skalViseOverstyringAksjonspunktVarsel(aksjonspunkterForVarsel, erOverstyrer)) {
    return null;
  }
  return (
    <>
      <OverstyringAksjonspunktVarsel
        aksjonspunkter={aksjonspunkterForVarsel}
        erOverstyrer={erOverstyrer}
        overstyrtHva="vilkårsvurderingen"
      />
      <VerticalSpacer twentyPx />
    </>
  );
};

export const BehandleUnntakForm = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  handleSubmit,
  readOnlySubmitButton,
  språkkode,
  aksjonspunkter = [],
  erOverstyrer = false,
  // alleKodeverk,
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
      <OverstyringVarsel aksjonspunkter={aksjonspunkter} erOverstyrer={erOverstyrer} />

      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[
          <FormattedMessage
            id="Unntak.AvklarAkjsonspunkt"
            key={aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR}
          />,
        ]}
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />

      <FritekstTextField språkkode={språkkode} readOnly={readOnly} />

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

const buildInitialValues = createSelector(
  [ownProps => ownProps.vilkårsresultat, ownProps => ownProps.behandlingsresultat, ownProps => ownProps.vilkar],
  (vilkårsresultat, behandlingsresultat, vilkar) => ({
    periode: vilkårsresultat ? vilkårsresultat[0].periode : null,
    avslagsårsak: vilkårsresultat ? vilkårsresultat[0].avslagsårsak : null,
    utfall: vilkårsresultat ? vilkårsresultat[0].utfall : null,
    behandlingsresultat: behandlingsresultat ? behandlingsresultat?.type?.kode : null,
    begrunnelse: vilkar ? vilkar[0].perioder[0].begrunnelse : null,
  }),
);

const transformValues = values => ({
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

// Kompileringsfeil her betyr at BRUK_V2_PROSESS_UNNTAK er fjernet fra FeatureToggles.
// Slett hele packages/prosess-unntak og fjern v1-grenen i UnntakProsessStegPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_PROSESS_UNNTAK'];
