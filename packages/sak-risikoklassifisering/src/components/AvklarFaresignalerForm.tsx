import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ariaCheck, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption, TextAreaField, behandlingForm } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Risikoklassifisering, Aksjonspunkt } from '@k9-sak-web/types';

import faresignalVurdering from '../kodeverk/faresignalVurdering';

import styles from './avklarFaresignalerForm.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const formName = 'avklarFaresignalerForm';
export const begrunnelseFieldName = 'begrunnelse';
export const radioFieldName = 'avklarFaresignalerRadio';

export type VuderFaresignalerAp = {
  kode: string;
  harInnvirketBehandlingen: boolean;
  begrunnelse: string;
};

interface PureOwnProps {
  aksjonspunkt?: Aksjonspunkt;
  readOnly: boolean;
  risikoklassifisering: Risikoklassifisering;
  submitCallback: (verdier: VuderFaresignalerAp) => Promise<any>;
}

/**
 * IngenRisikoPanel
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
export const AvklarFaresignalerForm = ({ readOnly, aksjonspunkt, ...formProps }: PureOwnProps & InjectedFormProps) => (
  <FlexContainer>
    <form onSubmit={formProps.handleSubmit}>
      <FlexRow>
        <FlexColumn className={styles.fullWidth}>
          <TextAreaField
            name={begrunnelseFieldName}
            label={<FormattedMessage id="Risikopanel.Forms.Vurdering" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      <VerticalSpacer sixteenPx />
      <FlexRow>
        <FlexColumn>
          <Normaltekst>
            <FormattedMessage id="Risikopanel.Form.Resultat" />
          </Normaltekst>
        </FlexColumn>
      </FlexRow>
      <VerticalSpacer eightPx />
      <FlexRow>
        <FlexColumn>
          <RadioGroupField
            name={radioFieldName}
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
            isEdited={!isAksjonspunktOpen(aksjonspunkt.status)}
          >
            <RadioOption label={<FormattedMessage id="Risikopanel.Form.Innvirkning" />} value />
            <RadioOption label={<FormattedMessage id="Risikopanel.Form.IngenInnvirkning" />} value={false} />
          </RadioGroupField>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Hovedknapp
            mini
            spinner={formProps.submitting}
            disabled={!formProps.dirty || readOnly || formProps.submitting}
            onClick={ariaCheck}
          >
            <FormattedMessage id="Risikopanel.Form.Bekreft" />
          </Hovedknapp>
        </FlexColumn>
      </FlexRow>
    </form>
  </FlexContainer>
);

export const buildInitialValues = createSelector(
  [(ownProps: PureOwnProps) => ownProps.risikoklassifisering, (ownProps: PureOwnProps) => ownProps.aksjonspunkt],
  (risikoklassifisering, aksjonspunkt) => {
    if (aksjonspunkt && aksjonspunkt.begrunnelse && risikoklassifisering && risikoklassifisering.faresignalVurdering) {
      return {
        [begrunnelseFieldName]: aksjonspunkt.begrunnelse,
        [radioFieldName]: risikoklassifisering.faresignalVurdering === faresignalVurdering.INNVIRKNING,
      };
    }
    return undefined;
  },
);

const transformValues = (values): VuderFaresignalerAp => ({
  kode: aksjonspunktCodes.VURDER_FARESIGNALER,
  harInnvirketBehandlingen: values[radioFieldName],
  begrunnelse: values[begrunnelseFieldName],
});

const mapStateToPropsFactory = (_initialState, ownProps: PureOwnProps) => {
  const onSubmit = values => ownProps.submitCallback(transformValues(values));
  const initialValues = buildInitialValues(ownProps);
  return () => ({
    initialValues,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({ form: formName })(AvklarFaresignalerForm));
