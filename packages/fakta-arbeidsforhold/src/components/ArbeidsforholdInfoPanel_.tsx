import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { InjectedFormProps } from 'redux-form';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm } from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { omit } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Arbeidsforhold, KodeverkMedNavn, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import BekreftOgForsettKnapp from './BekreftOgForsettKnapp';
import PersonArbeidsforholdPanel from './PersonArbeidsforholdPanel';
import CustomArbeidsforhold from '../typer/CustomArbeidsforholdTsType';

// ----------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------

const formName = 'ArbeidsforholdInfoPanel';

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

export const fjernIdFraArbeidsforholdLagtTilAvSaksbehandler = (arbeidsforhold: Arbeidsforhold[]): Arbeidsforhold[] =>
  arbeidsforhold.map(a => {
    if (a.lagtTilAvSaksbehandler === true) {
      return {
        ...a,
        id: null,
      };
    }
    return a;
  });

const harAksjonspunkt = (aksjonspunktCode: string, aksjonspunkter: Aksjonspunkt[]) =>
  aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

// interface ArbeidsforholdInfoPanelProps {
//   behandlingId: number;
//   behandlingVersjon: number;
//   readOnly: boolean;
//   submitCallback: (props: SubmitCallback[]) => void;
// }

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  aksjonspunkter: Aksjonspunkt[];
  arbeidsforhold: Arbeidsforhold[];
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
  skalKunneLeggeTilNyeArbeidsforhold: boolean;
  skalKunneLageArbeidsforholdBasertPaInntektsmelding: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  alleMerknaderFraBeslutter: { [key: string]: { notAccepted?: boolean } };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

type Props = OwnProps & InjectedFormProps;

/**
 * ArbeidsforholdInfoPanelImpl:
 * Ansvarlig for å rendre aksjonspunktteksten, arbeidsforholdene, og
 * bekreft & fortsett knappen
 * */
export const ArbeidsforholdInfoPanelImpl: FunctionComponent<Props> = ({
  aksjonspunkter,
  readOnly,
  hasOpenAksjonspunkter,
  skalKunneLeggeTilNyeArbeidsforhold,
  skalKunneLageArbeidsforholdBasertPaInntektsmelding,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  arbeidsgiverOpplysningerPerId,
  ...formProps
}) => {
  const { host } = window.location;
  const shouldDisableSubmitButton = (!hasOpenAksjonspunkter && formProps.pristine) || host !== 'app-q1.adeo.no';

  return (
    <>
      {aksjonspunkter.length > 0 && (
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter && !readOnly}>
          {[
            <FormattedMessage
              key="ArbeidsforholdInfoPanelAksjonspunkt"
              id={
                skalKunneLeggeTilNyeArbeidsforhold
                  ? 'ArbeidsforholdInfoPanel.IngenArbeidsforholdRegistrert'
                  : 'ArbeidsforholdInfoPanel.AvklarArbeidsforhold'
              }
            />,
          ]}
        </AksjonspunktHelpTextTemp>
      )}
      <form onSubmit={formProps.handleSubmit}>
        <PersonArbeidsforholdPanel
          readOnly={readOnly}
          hasAksjonspunkter={aksjonspunkter.length > 0}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          skalKunneLeggeTilNyeArbeidsforhold={skalKunneLeggeTilNyeArbeidsforhold}
          skalKunneLageArbeidsforholdBasertPaInntektsmelding={skalKunneLageArbeidsforholdBasertPaInntektsmelding}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          alleKodeverk={alleKodeverk}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
        {harAksjonspunkt(aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, aksjonspunkter) && (
          <BekreftOgForsettKnapp
            readOnly={readOnly || shouldDisableSubmitButton}
            isSubmitting={formProps.submitting}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
      </form>
    </>
  );
};

type FormValues = {
  arbeidsforhold: CustomArbeidsforhold[];
};

const buildInitialValues = createSelector(
  [(ownProps: OwnProps) => ownProps.arbeidsforhold, (ownProps: OwnProps) => ownProps.arbeidsgiverOpplysningerPerId],
  (arbeidsforhold, arbeidsgiverOpplysningerPerId): FormValues => ({
    ...PersonArbeidsforholdPanel.buildInitialValues(arbeidsforhold, arbeidsgiverOpplysningerPerId),
  }),
);

const transformValues = (values: FormValues): any => {
  const arbeidsforhold = fjernIdFraArbeidsforholdLagtTilAvSaksbehandler(values.arbeidsforhold);
  return {
    arbeidsforhold: arbeidsforhold.map(a =>
      omit(
        a,
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
export default connect(mapStateToPropsFactory)(behandlingForm({ form: formName })(ArbeidsforholdInfoPanelImpl));
