import { behandlingForm } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { omit } from '@fpsak-frontend/utils';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import Panel from 'nav-frontend-paneler';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { BekreftOgForsettKnapp } from './BekreftOgForsettKnapp';
import PersonArbeidsforholdPanel from './PersonArbeidsforholdPanel';

import styles from './arbeidsforholdInfoPanel.module.css';

// ----------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------

const formName = 'ArbeidsforholdInfoPanel';

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

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  aksjonspunkter: Aksjonspunkt[];
  arbeidsforhold: ArbeidsforholdV2[];
  submitCallback: (...args: any[]) => any;
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  alleMerknaderFraBeslutter: { [key: string]: { notAccepted?: boolean } };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

/**
 * ArbeidsforholdInfoPanelImpl:
 * Ansvarlig for å rendre aksjonspunktteksten, arbeidsforholdene, og
 * bekreft & fortsett knappen
 * */
export const ArbeidsforholdInfoPanelImpl = ({
  aksjonspunkter,
  readOnly,
  alleMerknaderFraBeslutter,
  arbeidsgiverOpplysningerPerId,
  hasOpenAksjonspunkter,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  intl,
  ...formProps
}: PureOwnProps & InjectedFormProps & WrappedComponentProps) => {
  const shouldDisableSubmitButton = formProps.pristine;
  const harAksjonspunktAvklarArbeidsforhold = harAksjonspunkt(aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, aksjonspunkter);

  return (
    <>
      {aksjonspunkter.length > 0 && (
        <Panel className={styles.begrunnelseSaksbehandler}>
          <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter && !readOnly}>
            {[
              <FormattedMessage
                key="ArbeidsforholdInfoPanelAksjonspunkt"
                id="ArbeidsforholdInfoPanel.AvklarArbeidsforhold"
              />,
            ]}
          </AksjonspunktHelpTextTemp>
        </Panel>
      )}
      <h3>
        <FormattedMessage id="PersonArbeidsforholdPanel.ArbeidsforholdHeader" />
      </h3>
      <form onSubmit={formProps.handleSubmit}>
        <PersonArbeidsforholdPanel
          intl={intl}
          readOnly={readOnly}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          harAksjonspunktAvklarArbeidsforhold={harAksjonspunktAvklarArbeidsforhold}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          alleKodeverk={alleKodeverk}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        {harAksjonspunktAvklarArbeidsforhold && (
          <BekreftOgForsettKnapp readOnly={shouldDisableSubmitButton} isSubmitting={formProps.submitting} />
        )}
      </form>
    </>
  );
};

type FormValues = {
  arbeidsforhold: ArbeidsforholdV2[];
};

const buildInitialValues = createSelector(
  [
    (ownProps: PureOwnProps) => ownProps.arbeidsforhold,
    (ownProps: PureOwnProps) => ownProps.arbeidsgiverOpplysningerPerId,
  ],
  (arbeidsforhold): FormValues => ({
    ...PersonArbeidsforholdPanel.buildInitialValues(arbeidsforhold),
  }),
);

const transformValues = (values: FormValues): any => {
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

const lagSubmitFn = createSelector(
  [(ownProps: PureOwnProps) => ownProps.submitCallback],
  submitCallback => (values: FormValues) => submitCallback([transformValues(values)]),
);

const mapStateToProps = (_state, ownProps: PureOwnProps) => ({
  initialValues: buildInitialValues(ownProps),
  onSubmit: lagSubmitFn(ownProps),
});

export default connect(mapStateToProps)(behandlingForm({ form: formName })(injectIntl(ArbeidsforholdInfoPanelImpl)));
