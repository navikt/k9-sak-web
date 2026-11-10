import { Heading, HGrid } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
  RadioGroupField,
  TextAreaField,
} from '@fpsak-frontend/form';
import { AksjonspunktHelpText, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';

import PreviewAnkeLink from './PreviewAnkeLink';

const AnkeMerknader = ({
  readOnly = true,
  handleSubmit,
  previewCallback,
  readOnlySubmitButton = true,
  aksjonspunktCode,
  formValues = {},
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Heading size="small" level="2">
        <FormattedMessage id="Ankebehandling.Merknad.Title" />
      </Heading>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Ankebehandling.Merknad.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <HGrid gap="space-4" columns={{ xs: '7fr 5fr' }}>
        <div>
          <FormattedMessage id="Ankebehandling.Merknad.Merknader" />
          <RadioGroupField
            name="erMerknaderMottatt"
            validate={[required]}
            direction="horisontal"
            readOnly={readOnly}
            radios={[
              {
                value: 'ja',
                label: <FormattedMessage id="Ankebehandling.Merknad.Merknader.Ja" />,
              },
              {
                value: 'nei',
                label: <FormattedMessage id="Ankebehandling.Merknad.Merknader.Nei" />,
              },
            ]}
          />
        </div>
      </HGrid>

      <VerticalSpacer sixteenPx />
      <HGrid gap="space-4" columns={{ xs: '7fr 5fr' }}>
        <TextAreaField
          readOnly={readOnly}
          readOnlyHideEmpty={false}
          label={{ id: 'Ankebehandling.Merknad.Merknader.Kommentarer' }}
          name="merknadKommentar"
        />
      </HGrid>
      <VerticalSpacer sixteenPx />
      <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
        <div>
          <ProsessStegSubmitButton
            formName={formProps.form}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={!readOnly}
            hasEmptyRequiredFields={false}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
          <PreviewAnkeLink
            previewCallback={previewCallback}
            fritekstTilBrev={formValues.fritekstTilBrev}
            ankeVurdering={formValues.ankeVurdering}
            aksjonspunktCode={aksjonspunktCode}
          />
        </div>
      </HGrid>
    </FadingPanel>
  </form>
);

const ankeMerknaderFormName = 'ankeMerknaderForm';

const transformValues = (values, aksjonspunktCode) => ({
  erMerknaderMottatt: values.erMerknaderMottatt === 'ja',
  merknadKommentar: values.merknadKommentar,
  kode: aksjonspunktCode,
});

const buildInitialValues = createSelector([ownProps => ownProps.ankeVurderingResultat], resultat => ({
  ankeVurdering: resultat ? resultat.ankeVurdering : null,
  begrunnelse: resultat ? resultat.begrunnelse : null,
  fritekstTilBrev: resultat ? resultat.fritekstTilBrev : null,
}));

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const aksjonspunktCode = initialOwnProps.aksjonspunkter[0].definisjon.kode;
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return (state, ownProps) => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(ankeMerknaderFormName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'ankeVurdering',
      'fritekstTilBrev',
    ),
    onSubmit,
  });
};

const BehandleMerknaderForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: ankeMerknaderFormName,
  })(AnkeMerknader),
);

export default BehandleMerknaderForm;
