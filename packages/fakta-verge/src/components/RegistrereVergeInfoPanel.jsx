import { behandlingForm } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Alert, BodyLong, BodyShort, Heading, Label } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import vergeAksjonspunkterPropType from '../propTypes/vergeAksjonspunkterPropType';
import FaktaBegrunnelseTextField from './FaktaBegrunnelseTextField';
import FaktaSubmitButton from './FaktaSubmitButton';

/**
 * RegistrereVergeInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp formen for att registrere verge.
 */
export const RegistrereVergeInfoPanelImpl = ({
  intl,
  hasOpenAksjonspunkter,
  submittable = true,
  readOnly,
  initialValues = {},
  aksjonspunkt,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => {
  if (!aksjonspunkt) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        <Heading size="small" className="mb-2">
          Verge
        </Heading>
        <div className="flex flex-col gap-4">
          <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
            {[intl.formatMessage({ id: 'RegistrereVergeInfoPanel.CheckInformation' })]}
          </AksjonspunktHelpText>
          <Alert variant="info">
            <div className="flex flex-col gap-4">
              <Label>Mer om verge for mindreårige</Label>
              <BodyLong>
                Når søker er under 18 år, må en verge signere søknaden. For mindreårige vil det vanligvis være den eller
                de foreldrene som har foreldreansvar, du kan se dette i Modia.
              </BodyLong>
              <BodyLong>
                Hvis vi ikke har signatur må du kontakte vergene, og be dem sende signert papirsøknad og førsteside for
                innsending i søkers fødselsnummer innen en frist. Hvis vi ikke får signatur fra verge, må saken
                henlegges fra Behandlingsmenyen.
              </BodyLong>
              <BodyLong className="mt-2">
                Merk at hvis vi får signatur, må brevene i saken manuelt sendes til vergene i tillegg til søker.
              </BodyLong>
            </div>
          </Alert>
        </div>
        <form onSubmit={formProps.handleSubmit}>
          <VerticalSpacer twentyPx />
          <FaktaBegrunnelseTextField
            isSubmittable={submittable}
            isReadOnly={readOnly}
            hasBegrunnelse={!!initialValues.begrunnelse}
            label={intl.formatMessage({ id: 'RegistrereVergeInfoPanel.Begrunnelse' })}
          />
          <VerticalSpacer twentyPx />
          <FaktaSubmitButton
            formName={formProps.form}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isSubmittable={submittable}
            isReadOnly={readOnly}
            hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            doNotCheckForRequiredFields
          />
        </form>
      </div>
    </>
  );
};

RegistrereVergeInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkt: vergeAksjonspunkterPropType.isRequired,
  initialValues: PropTypes.shape(),
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

const buildInitialValues = createSelector(
  [ownProps => ownProps.verge, ownProps => ownProps.aksjonspunkter],
  (verge, aksjonspunkter) => ({
    begrunnelse:
      verge && verge.begrunnelse
        ? decodeHtmlEntity(verge.begrunnelse)
        : FaktaBegrunnelseTextField.buildInitialValues(
            aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VERGE)[0],
          ).begrunnelse,
  }),
);

const transformValues = values => ({ begrunnelse: values.begrunnelse, kode: aksjonspunktCodes.AVKLAR_VERGE });

const FORM_NAVN = 'RegistrereVergeInfoPanel';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    aksjonspunkt: ownProps.aksjonspunkter[0],
    initialValues: buildInitialValues(ownProps),
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAVN,
  })(injectIntl(RegistrereVergeInfoPanelImpl)),
);
