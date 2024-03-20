import behandleImageURL from '@fpsak-frontend/assets/images/advarsel.svg';
import {
  RadioGroupField,
  RadioOption,
  TextAreaField,
  behandlingForm,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, BeregningsresultatFp, BeregningsresultatUtbetalt } from '@k9-sak-web/types';
import { Label } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';

import styles from './tilbaketrekkpanel.module.css';

const radioFieldName = 'radioVurderTilbaketrekk';
const begrunnelseFieldName = 'begrunnelseVurderTilbaketrekk';
const formName = 'vurderTilbaketrekkForm';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

type FormValues = {
  radioVurderTilbaketrekk: boolean;
  begrunnelseVurderTilbaketrekk: string;
};

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  vurderTilbaketrekkAP?: Aksjonspunkt;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  beregningsresultat?: BeregningsresultatFp | BeregningsresultatUtbetalt;
}

interface MappedOwnProps {
  onSubmit: (formValues: FormValues) => any;
  initialValues: FormValues;
}

export const Tilbaketrekkpanel = ({
  intl,
  readOnly,
  vurderTilbaketrekkAP,
  readOnlySubmitButton,
  behandlingId,
  behandlingVersjon,
  ...formProps
}: PureOwnProps & WrappedComponentProps & InjectedFormProps) => (
  <div>
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image
              className={styles.image}
              alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
              src={behandleImageURL}
            />
          </FlexColumn>
          <FlexColumn>
            <div className={styles.divider} />
          </FlexColumn>
          <FlexColumn className={styles.aksjonspunktText}>
            <div className={styles.oneElement}>
              <Label size="small" as="p" className={styles.wordwrap}>
                <FormattedMessage id="TilkjentYtelse.VurderTilbaketrekk.Aksjonspunkttekst" />
              </Label>
            </div>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
    <VerticalSpacer twentyPx />
    <form onSubmit={formProps.handleSubmit}>
      <Row>
        <Column xs="9">
          <RadioGroupField
            name={radioFieldName}
            validate={[required]}
            direction="horizontal"
            readOnly={readOnly}
            isEdited={!isAksjonspunktOpen(vurderTilbaketrekkAP.status.kode)}
          >
            <RadioOption label={<FormattedMessage id="TilkjentYtelse.VurderTilbaketrekk.Utfør" />} value={false} />
            <RadioOption label={<FormattedMessage id="TilkjentYtelse.VurderTilbaketrekk.Hindre" />} value />
          </RadioGroupField>
        </Column>
      </Row>
      <Row>
        <Column xs="6">
          <TextAreaField
            name={begrunnelseFieldName}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </Column>
      </Row>
      <Row>
        <Column xs="1">
          <VerticalSpacer eightPx />
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
        </Column>
      </Row>
    </form>
  </div>
);

export const transformValues = values => {
  const hindreTilbaketrekk = values[radioFieldName];
  const begrunnelse = values[begrunnelseFieldName];
  return {
    kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
    begrunnelse,
    hindreTilbaketrekk,
  };
};

export const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.vurderTilbaketrekkAP, (state, ownProps) => ownProps.beregningsresultat],
  (ap, tilkjentYtelse) => {
    const tidligereValgt = tilkjentYtelse?.skalHindreTilbaketrekk;
    if (tidligereValgt === undefined || tidligereValgt === null || !ap || !ap.begrunnelse) {
      return undefined;
    }
    return {
      radioVurderTilbaketrekk: tidligereValgt,
      begrunnelseVurderTilbaketrekk: ap.begrunnelse,
    };
  },
);

const lagSubmitFn = createSelector(
  [(ownProps: PureOwnProps) => ownProps.submitCallback],
  submitCallback => (values: FormValues) => submitCallback(transformValues(values)),
);

const mapStateToProps = (state: any, ownProps: PureOwnProps): MappedOwnProps => ({
  onSubmit: lagSubmitFn(ownProps),
  // @ts-ignore Fiks denne (reselect)
  initialValues: buildInitialValues(state, ownProps),
});

export default connect(mapStateToProps)(behandlingForm({ form: formName })(injectIntl(Tilbaketrekkpanel)));
