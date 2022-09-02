import React from 'react';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';

import { CheckboxField } from '@fpsak-frontend/form';
import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@k9-sak-web/fakta-felles';
import { AksjonspunktHelpTextTemp, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';

import VurderAktiviteterPanel from './VurderAktiviteterPanel';

import styles from './avklareAktiviteterPanel.less';

export const BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME = 'begrunnelseAvklareAktiviteter';
export const MANUELL_OVERSTYRING_FIELD = 'manuellOverstyringBeregningAktiviteter';

const { AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER } = avklaringsbehovCodes;

const buildInitialValues = (
  avklaringsbehov,
  avklarAktiviteter,
  aktivtBeregningsgrunnlagIndex,
  periode,
  erTilVurdering,
) => {
  const harAvklarAksjonspunkt = harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov);
  const erOverstyrt = harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, avklaringsbehov);
  let initialValues = {};
  if (avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
    initialValues = VurderAktiviteterPanel.buildInitialValues(
      avklarAktiviteter.aktiviteterTomDatoMapping,
      erOverstyrt,
      harAvklarAksjonspunkt,
    );
  }
  return {
    [MANUELL_OVERSTYRING_FIELD]: erOverstyrt,
    periode,
    erTilVurdering,
    avklaringsbehov,
    avklarAktiviteter,
    ...initialValues,
    aktivtBeregningsgrunnlagIndex,
  };
};

export const getAvklarAktiviteter = createSelector(
  [beregningsgrunnlag => beregningsgrunnlag?.faktaOmBeregning],
  (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.avklarAktiviteter : undefined),
);

export const buildInitialValuesAvklarAktiviteter = createSelector(
  [
    beregningsgrunnlag => beregningsgrunnlag.avklaringsbehov,
    beregningsgrunnlag => getAvklarAktiviteter(beregningsgrunnlag),
    (beregningsgrunnlag, ownProps) => ownProps.aktivtBeregningsgrunnlagIndex,
    (beregningsgrunnlag, ownProps) =>
      ownProps.behandlingResultatPerioder.find(({ periode }) => periode.fom === beregningsgrunnlag.vilkårsperiodeFom)
        .periode,
    (beregningsgrunnlag, ownProps) =>
      ownProps.beregningreferanserTilVurdering.some(
        r => r.skjæringstidspunkt === beregningsgrunnlag.vilkårsperiodeFom && !r.erForlengelse,
      ),
  ],
  buildInitialValues,
);

const skalViseSubmitKnappEllerBegrunnelse = (avklaringsbehov, erOverstyrt, erTilVurdering) =>
  (harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov) || erOverstyrt) && erTilVurdering;

const hasOpenAvklaringsbehov = (kode, avklaringsbehov) =>
  avklaringsbehov.some(ap => ap.definisjon === kode && isAvklaringsbehovOpen(ap.status));

const hasOpenBehovForAvklaringAvAktiviteter = avklaringsbehov =>
  hasOpenAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov) ||
  hasOpenAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, avklaringsbehov);

const AvklareAktiviteterPanelContent = props => {
  const {
    intl,
    readOnly,
    isAvklaringsbehovClosed,
    submittable,
    hasBegrunnelse,
    helpText,
    harAndreAvklaringsbehovIPanel,
    erOverstyrt,
    avklaringsbehov,
    kanOverstyre,
    erBgOverstyrt,
    alleKodeverk,
    behandlingId,
    behandlingVersjon,
    alleBeregningsgrunnlag,
    formValues,
    aktivtBeregningsgrunnlagIndex,
    fields,
    beregningsgrunnlag,
    initializeAktiviteter,
    submitEnabled,
    arbeidsgiverOpplysningerPerId,
    ...formProps
  } = props;
  const avklarAktiviteter = getAvklarAktiviteter(beregningsgrunnlag);
  const skalViseSubmitknappInneforBorderBox =
    (harAndreAvklaringsbehovIPanel || erOverstyrt || erBgOverstyrt) &&
    !hasOpenBehovForAvklaringAvAktiviteter(avklaringsbehov);

  const harFlereBeregningsgrunnlag = Array.isArray(alleBeregningsgrunnlag);

  if (fields.length === 0) {
    if (harFlereBeregningsgrunnlag) {
      alleBeregningsgrunnlag.forEach(currentBeregningsgrunnlag => {
        const initialValues = buildInitialValuesAvklarAktiviteter(currentBeregningsgrunnlag, props);
        fields.push(initialValues);
      });
    } else {
      const initialValues = buildInitialValuesAvklarAktiviteter(beregningsgrunnlag, props);
      fields.push(initialValues);
    }
  }

  return fields.map((field, index) => (
    <div key={field} style={{ display: index === aktivtBeregningsgrunnlagIndex ? 'block' : 'none' }}>
      {(kanOverstyre || erOverstyrt) && fields.get(index).erTilVurdering && (
        <div className={styles.rightAligned}>
          <CheckboxField
            key="manuellOverstyring"
            name={`${field}.${MANUELL_OVERSTYRING_FIELD}`}
            label={{ id: 'AvklareAktiviteter.ManuellOverstyring' }}
            readOnly={harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, avklaringsbehov) || readOnly}
            onChange={initializeAktiviteter}
          />
        </div>
      )}
      {(harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov) || kanOverstyre || erOverstyrt) && (
        <div>
          {harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov) && fields.get(index).erTilVurdering && (
            <AksjonspunktHelpTextTemp isAksjonspunktOpen={!isAvklaringsbehovClosed}>
              {helpText}
            </AksjonspunktHelpTextTemp>
          )}
          {erOverstyrt && fields.get(index).erTilVurdering && (
            <Element>
              <FormattedMessage id="AvklareAktiviteter.OverstyrerAktivitetAdvarsel" />
            </Element>
          )
          }

          {
            formProps.error && (
              <>
                <VerticalSpacer sixteenPx />
                <AlertStripe type="feil">
                  <FormattedMessage id={formProps.error} />
                </AlertStripe>
              </>
            )
          }

          <VerticalSpacer twentyPx />
          <BorderBox>
            {avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping && (
              <VurderAktiviteterPanel
                aktiviteterTomDatoMapping={avklarAktiviteter.aktiviteterTomDatoMapping}
                readOnly={readOnly && !fields.get(index).erTilVurdering}
                isAvklaringsbehovClosed={isAvklaringsbehovClosed}
                erOverstyrt={erOverstyrt}
                alleKodeverk={alleKodeverk}
                values={formValues[index]}
                harAvklaringsbehov={harAvklaringsbehov(AVKLAR_AKTIVITETER, avklaringsbehov)}
                fieldArrayID={`${field}`}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                vilkaarPeriodeFieldArrayIndex={index}
              />
            )}
            <VerticalSpacer twentyPx />
            {skalViseSubmitKnappEllerBegrunnelse(avklaringsbehov, erOverstyrt, fields.get(index).erTilVurdering) && (
              <>
                <FaktaBegrunnelseTextField
                  name={BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME}
                  isSubmittable={submittable}
                  isReadOnly={readOnly}
                  hasBegrunnelse={hasBegrunnelse}
                />
                <VerticalSpacer twentyPx />
                {skalViseSubmitknappInneforBorderBox && (
                  <FaktaSubmitButton
                    buttonText={intl.formatMessage({
                      id: erOverstyrt ? 'AvklarAktivitetPanel.OverstyrText' : 'AvklarAktivitetPanel.ButtonText',
                    })}
                    formName={formProps.form}
                    isSubmittable={submittable && submitEnabled && !formProps.error}
                    isReadOnly={readOnly}
                    hasOpenAksjonspunkter={!isAvklaringsbehovClosed}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                  />
                )}
              </>
            )}
          </BorderBox>
          {
            !skalViseSubmitknappInneforBorderBox &&
            skalViseSubmitKnappEllerBegrunnelse(avklaringsbehov, erOverstyrt, fields.get(index).erTilVurdering) && (
              <>
                <VerticalSpacer twentyPx />
                <FaktaSubmitButton
                  buttonText={erOverstyrt ? intl.formatMessage({ id: 'AvklarAktivitetPanel.OverstyrText' }) : undefined}
                  formName={formProps.form}
                  isSubmittable={submittable && submitEnabled && !formProps.error}
                  isReadOnly={readOnly}
                  hasOpenAksjonspunkter={!isAvklaringsbehovClosed}
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                />
              </>
            )
          }
        </div >
      )}
    </div >
  ));
};

export default injectIntl(AvklareAktiviteterPanelContent);
