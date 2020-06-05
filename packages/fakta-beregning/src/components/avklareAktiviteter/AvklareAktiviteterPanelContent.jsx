import React from 'react';
import { CheckboxField } from '@fpsak-frontend/form';
import { createSelector } from 'reselect';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import { AksjonspunktHelpTextTemp, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';
import styles from './avklareAktiviteterPanel.less';

export const BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME = 'begrunnelseAvklareAktiviteter';
export const MANUELL_OVERSTYRING_FIELD = 'manuellOverstyringBeregningAktiviteter';

const { AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER } = aksjonspunktCodes;

const findAksjonspunktMedBegrunnelse = (aksjonspunkter, kode) =>
  aksjonspunkter.filter(ap => ap.definisjon.kode === kode && ap.begrunnelse !== null)[0];

const buildInitialValues = (aksjonspunkter, avklarAktiviteter, alleKodeverk, aktivtBeregningsgrunnlagIndex) => {
  const harAvklarAksjonspunkt = hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);
  const erOverstyrt = hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter);
  let initialValues = {};
  if (avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
    initialValues = VurderAktiviteterPanel.buildInitialValues(
      avklarAktiviteter.aktiviteterTomDatoMapping,
      alleKodeverk,
      erOverstyrt,
      harAvklarAksjonspunkt,
    );
  }
  const overstyrAksjonspunktMedBegrunnelse = findAksjonspunktMedBegrunnelse(
    aksjonspunkter,
    OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  );
  const aksjonspunktMedBegrunnelse = findAksjonspunktMedBegrunnelse(aksjonspunkter, AVKLAR_AKTIVITETER);
  const begrunnelse = erOverstyrt ? overstyrAksjonspunktMedBegrunnelse : aksjonspunktMedBegrunnelse;
  return {
    [MANUELL_OVERSTYRING_FIELD]: erOverstyrt,
    aksjonspunkter,
    avklarAktiviteter,
    ...initialValues,
    ...FaktaBegrunnelseTextField.buildInitialValues(begrunnelse, BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME),
    aktivtBeregningsgrunnlagIndex,
  };
};

export const getAvklarAktiviteter = createSelector(
  [beregningsgrunnlag => beregningsgrunnlag.faktaOmBeregning],
  (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.avklarAktiviteter : undefined),
);

export const buildInitialValuesAvklarAktiviteter = createSelector(
  [
    (beregningsgrunnlag, ownProps) => ownProps.aksjonspunkter,
    beregningsgrunnlag => getAvklarAktiviteter(beregningsgrunnlag),
    (beregningsgrunnlag, ownProps) => ownProps.alleKodeverk,
    (beregningsgrunnlag, ownProps) => ownProps.aktivtBeregningsgrunnlagIndex,
  ],
  buildInitialValues,
);

const skalViseSubmitKnappEllerBegrunnelse = (aksjonspunkter, erOverstyrt) =>
  hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || erOverstyrt;

const hasOpenAksjonspunkt = (kode, aksjonspunkter) =>
  aksjonspunkter.some(ap => ap.definisjon.kode === kode && isAksjonspunktOpen(ap.status.kode));

const hasOpenAvklarAksjonspunkter = aksjonspunkter =>
  hasOpenAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) ||
  hasOpenAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter);

const AvklareAktiviteterPanelContent = props => {
  const {
    readOnly,
    isAksjonspunktClosed,
    submittable,
    hasBegrunnelse,
    helpText,
    harAndreAksjonspunkterIPanel,
    erOverstyrt,
    aksjonspunkter,
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
    submitEnabled,
    ...formProps
  } = props;
  const avklarAktiviteter = getAvklarAktiviteter(beregningsgrunnlag);
  const skalViseSubmitknappInneforBorderBox =
    (harAndreAksjonspunkterIPanel || erOverstyrt || erBgOverstyrt) && !hasOpenAvklarAksjonspunkter(aksjonspunkter);

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

  return fields.map(
    (field, index) =>
      index === aktivtBeregningsgrunnlagIndex && (
        <div key={field}>
          {(kanOverstyre || erOverstyrt) && (
            <div className={styles.rightAligned}>
              <CheckboxField
                key="manuellOverstyring"
                name={`${field}.${MANUELL_OVERSTYRING_FIELD}`}
                label={{ id: 'AvklareAktiviteter.ManuellOverstyring' }}
                readOnly={hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter) || readOnly}
                onChange={() => this.initializeAktiviteter()}
              />
            </div>
          )}
          {(hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || kanOverstyre || erOverstyrt) && (
            <div>
              {hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) && (
                <AksjonspunktHelpTextTemp isAksjonspunktOpen={!isAksjonspunktClosed}>
                  {helpText}
                </AksjonspunktHelpTextTemp>
              )}
              {erOverstyrt && (
                <Element>
                  <FormattedMessage id="AvklareAktiviteter.OverstyrerAktivitetAdvarsel" />
                </Element>
              )}

              {formProps.error && (
                <>
                  <VerticalSpacer sixteenPx />
                  <AlertStripe type="feil">
                    <FormattedMessage id={formProps.error} />
                  </AlertStripe>
                </>
              )}

              <VerticalSpacer twentyPx />
              <BorderBox>
                {avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping && (
                  <VurderAktiviteterPanel
                    aktiviteterTomDatoMapping={avklarAktiviteter.aktiviteterTomDatoMapping}
                    readOnly={readOnly}
                    isAksjonspunktClosed={isAksjonspunktClosed}
                    erOverstyrt={erOverstyrt}
                    alleKodeverk={alleKodeverk}
                    values={formValues}
                    harAksjonspunkt={hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)}
                    fieldArrayID={field}
                  />
                )}
                <VerticalSpacer twentyPx />
                {skalViseSubmitKnappEllerBegrunnelse(aksjonspunkter, erOverstyrt) && (
                  <>
                    <FaktaBegrunnelseTextField
                      name={`${field}.${BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME}`}
                      isDirty={formProps.dirty}
                      isSubmittable={submittable}
                      isReadOnly={readOnly}
                      hasBegrunnelse={hasBegrunnelse}
                    />
                    {skalViseSubmitknappInneforBorderBox && (
                      <FaktaSubmitButton
                        buttonTextId={
                          erOverstyrt ? 'AvklarAktivitetPanel.OverstyrText' : 'AvklarAktivitetPanel.ButtonText'
                        }
                        formName={formProps.form}
                        isSubmittable={submittable && submitEnabled && !formProps.error}
                        isReadOnly={readOnly}
                        hasOpenAksjonspunkter={!isAksjonspunktClosed}
                        behandlingId={behandlingId}
                        behandlingVersjon={behandlingVersjon}
                      />
                    )}
                  </>
                )}
              </BorderBox>
              {!skalViseSubmitknappInneforBorderBox &&
                skalViseSubmitKnappEllerBegrunnelse(aksjonspunkter, erOverstyrt) && (
                  <>
                    <VerticalSpacer twentyPx />
                    <FaktaSubmitButton
                      buttonTextId={erOverstyrt ? 'AvklarAktivitetPanel.OverstyrText' : undefined}
                      formName={formProps.form}
                      isSubmittable={submittable && submitEnabled && !formProps.error}
                      isReadOnly={readOnly}
                      hasOpenAksjonspunkter={!isAksjonspunktClosed}
                      behandlingId={behandlingId}
                      behandlingVersjon={behandlingVersjon}
                    />
                  </>
                )}
            </div>
          )}
        </div>
      ),
  );
};

export default AvklareAktiviteterPanelContent;
