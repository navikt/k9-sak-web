import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm } from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { omit } from '@fpsak-frontend/utils';

import { arbeidsforholdV2PropType } from '@fpsak-frontend/prop-types/src/arbeidsforholdPropType';
import arbeidsforholdAksjonspunkterPropType from '../propTypes/arbeidsforholdAksjonspunkterPropType';
import PersonArbeidsforholdPanelV2 from './PersonArbeidsforholdPanelV2';
import { BekreftOgForsettKnappV2 } from './BekreftOgForsettKnappV2';

// ----------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------

const formName = 'ArbeidsforholdInfoPanelV2';

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

export const fjernIdFraArbeidsforholdLagtTilAvSaksbehandler = arbeidsforhold =>
  arbeidsforhold.map(a => {
    if (a.lagtTilAvSaksbehandler === true) {
      return {
        ...a,
        id: null,
      };
    }
    return a;
  });

const harAksjonspunkt = (aksjonspunktCode, aksjonspunkter) =>
  aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

/**
 * ArbeidsforholdInfoPanelImpl:
 * Ansvarlig for å rendre aksjonspunktteksten, arbeidsforholdene, og
 * bekreft & fortsett knappen
 * */
export const ArbeidsforholdInfoPanelImplV2 = ({
  aksjonspunkter,
  readOnly,
  alleMerknaderFraBeslutter,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  hasOpenAksjonspunkter,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => {
  const { host } = window.location;
  const shouldDisableSubmitButton = formProps.pristine || host !== 'app-q1.adeo.no';

  return (
    <>
      {aksjonspunkter.length > 0 && (
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter && !readOnly}>
          {[
            <FormattedMessage
              key="ArbeidsforholdInfoPanelAksjonspunktV2"
              id="ArbeidsforholdInfoPanel.AvklarArbeidsforhold"
            />,
          ]}
        </AksjonspunktHelpTextTemp>
      )}
      <h3>
        <FormattedMessage id="PersonArbeidsforholdPanel.ArbeidsforholdHeader" />
      </h3>
      <form onSubmit={formProps.handleSubmit}>
        <PersonArbeidsforholdPanelV2
          readOnly={readOnly}
          arbeidsforhold={arbeidsforhold}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          hasAksjonspunkter={aksjonspunkter.length > 0}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          alleKodeverk={alleKodeverk}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        {harAksjonspunkt(aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, aksjonspunkter) && (
          <BekreftOgForsettKnappV2
            readOnly={shouldDisableSubmitButton}
            isSubmitting={formProps.submitting}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
      </form>
    </>
  );
};

ArbeidsforholdInfoPanelImplV2.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdV2PropType),
  aksjonspunkter: PropTypes.arrayOf(arbeidsforholdAksjonspunkterPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

const buildInitialValues = createSelector([ownProps => ownProps.arbeidsforhold], arbeidsforhold => ({
  ...PersonArbeidsforholdPanelV2.buildInitialValues(arbeidsforhold),
}));

const transformValues = values => {
  const arbeidsforhold = fjernIdFraArbeidsforholdLagtTilAvSaksbehandler(values.arbeidsforhold);
  return {
    arbeidsforhold: arbeidsforhold.map(a =>
      omit(
        a,

        'navn',
        'fomDato',
        'tomDato',
        'erEndret',
        'replaceOptions',
        'originalFomDato',
        'arbeidsforholdHandlingField',
        'aktivtArbeidsforholdHandlingField',
      ),
    ),
    kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
  };
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    onSubmit,
  });
};
export default connect(mapStateToPropsFactory)(behandlingForm({ form: formName })(ArbeidsforholdInfoPanelImplV2));
