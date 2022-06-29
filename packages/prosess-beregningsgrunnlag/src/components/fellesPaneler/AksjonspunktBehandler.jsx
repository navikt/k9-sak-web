import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';

import { dateFormat, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import TextAreaField2 from '../redesign/TextAreaField';
import styles from './aksjonspunktBehandler.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';
import AksjonspunktBehandlerAT from '../arbeidstaker/AksjonspunktBehandlerAT';
import AksjonspunktBehandlerFL from '../frilanser/AksjonspunktBehandlerFL';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import AksjonspunktBehandlerSN from '../selvstendigNaeringsdrivende/AksjonspunktsbehandlerSN';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const finnAlleAndelerIFørstePeriode = allePerioder => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};
const harFlereAvklaringsbehov = avklaringsbehov =>
  !!avklaringsbehov && avklaringsbehov.length > 1;
const finnATFLVurderingLabel = avklaringsbehov => {
  if (harFlereAvklaringsbehov(avklaringsbehov)) {
    return <FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />;
  }
  return <FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />;
};
const finnGjeldendeAvklaringsbehov = (avklaringsbehov, erNyiArbeidslivet, erSNellerFL) => {
  if (erSNellerFL) {
    return avklaringsbehov.find(
      ap => ap.definisjon === avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    );
  }
  if (erNyiArbeidslivet) {
    return avklaringsbehov.find(
      ap => ap.definisjon === avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    );
  }
  return avklaringsbehov.find(
    ap =>
      ap.definisjon ===
      avklaringsbehovCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );
};

const lagEndretTekst = (avklaringsbehov, erNyiArbeidslivet, readOnly, erSNellerFL) => {
  if (!avklaringsbehov || !readOnly) return null;
  const gjeldendeAvklaringsbehov = finnGjeldendeAvklaringsbehov(avklaringsbehov, erNyiArbeidslivet, erSNellerFL);
  if (!gjeldendeAvklaringsbehov) return null;
  const { endretAv, endretTidspunkt } = gjeldendeAvklaringsbehov;
  if (!endretTidspunkt) return null;
  const godkjentEndretAv = /[a-zA-Z]{1}[0-9]{6}/.test(endretAv) ? endretAv : '';
  return (
    <FormattedMessage
      id="Beregningsgrunnlag.Forms.EndretTekst"
      values={{ endretAv: godkjentEndretAv, endretDato: dateFormat(endretTidspunkt) }}
    />
  );
};

const AksjonspunktBehandler = ({
  intl,
  readOnly,
  avklaringsbehov,
  formName,
  behandlingId,
  behandlingVersjon,
  readOnlySubmitButton,
  allePerioder,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  relevanteStatuser,
  fieldArrayID,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  let erVarigEndring = false;
  let erNyoppstartet = false;
  let erNyArbLivet = false;
  let visFL = false;
  let visAT = false;
  const snAndel = alleAndelerIForstePeriode.find(
    andel => andel.aktivitetStatus && andel.aktivitetStatus === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const flAndel = alleAndelerIForstePeriode.find(
    andel => andel.aktivitetStatus && andel.aktivitetStatus === aktivitetStatus.FRILANSER,
  );
  const atAndel = alleAndelerIForstePeriode.find(
    andel => andel.aktivitetStatus && andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER,
  );
  if (flAndel) {
    visFL = flAndel.skalFastsetteGrunnlag;
  }
  if (atAndel) {
    visAT = atAndel.skalFastsetteGrunnlag;
  }
  if (snAndel && snAndel.erNyIArbeidslivet) {
    erNyArbLivet = snAndel.erNyIArbeidslivet;
  }
  erVarigEndring = snAndel && snAndel.næringer && snAndel.næringer.some(naring => naring.erVarigEndret === true);
  erNyoppstartet = snAndel && snAndel.næringer && snAndel.næringer.some(naring => naring.erNyoppstartet === true);
  if (!avklaringsbehov || avklaringsbehov.length === 0) {
    return null;
  }
  const harTidsbegrensetArbeidsforholdMedAvvik = avklaringsbehov.find(
    ab => ab.definisjon === avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD
  );
  if (!relevanteStatuser.isSelvstendigNaeringsdrivende) {
    return (
      <div className={readOnly ? '' : styles.aksjonspunktBehandlerContainer}>
        <Panel className={readOnly ? beregningStyles.panelRight : styles.aksjonspunktBehandlerBorder}>
          <Row>
            <Column xs="12">
              <Element className={beregningStyles.avsnittOverskrift}>
                <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler" />
              </Element>
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          {harTidsbegrensetArbeidsforholdMedAvvik && (
            <AksjonspunktBehandlerTB
              readOnly={readOnly}
              readOnlySubmitButton={readOnlySubmitButton}
              formName={formName}
              allePerioder={allePerioder}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              alleKodeverk={alleKodeverk}
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              avklaringsbehov={avklaringsbehov}
              fieldArrayID={fieldArrayID}
            />
          )}
          {!harTidsbegrensetArbeidsforholdMedAvvik && visAT && (
            <AksjonspunktBehandlerAT
              readOnly={readOnly}
              allePerioder={allePerioder}
              alleAndelerIForstePeriode={alleAndelerIForstePeriode}
              alleKodeverk={alleKodeverk}
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              fieldArrayID={fieldArrayID}
            />
          )}
          {visFL && (
            <AksjonspunktBehandlerFL
              readOnly={readOnly}
              allePerioder={allePerioder}
              alleAndelerIForstePeriode={alleAndelerIForstePeriode}
              fieldArrayID={fieldArrayID}
            />
          )}

          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="12">
              <TextAreaField2
                name={`${fieldArrayID}.ATFLVurdering`}
                label={finnATFLVurderingLabel(avklaringsbehov)}
                validate={[required, maxLength1500, minLength3, hasValidText]}
                maxLength={1500}
                readOnly={readOnly}
                placeholder={intl.formatMessage({
                  id: 'Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag.Placeholder',
                })}
                endrettekst={lagEndretTekst(avklaringsbehov, erNyArbLivet, readOnly, true)}
              />
            </Column>
          </Row>
          <VerticalSpacer sixteenPx />
        </Panel>
      </div>
    );
  }
  if (relevanteStatuser.isSelvstendigNaeringsdrivende) {
    return (
      <div className={readOnly ? '' : styles.aksjonspunktBehandlerContainer}>
        <Panel className={readOnly ? beregningStyles.panelRight : styles.aksjonspunktBehandlerBorder}>
          <Row>
            <Column xs="12">
              <Element className={beregningStyles.avsnittOverskrift}>
                {erNyArbLivet && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.NyIArbeidslivet" />
                )}
                {erNyoppstartet && !erVarigEndring && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.Nyoppstartet" />
                )}
                {!erNyArbLivet && !erNyoppstartet && erVarigEndring && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.VarigEndring" />
                )}
                {!erNyArbLivet && erNyoppstartet && erVarigEndring && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler" />
                )}
              </Element>
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          <AksjonspunktBehandlerSN
            readOnly={readOnly}
            avklaringsbehov={avklaringsbehov}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            erNyArbLivet={erNyArbLivet}
            erVarigEndring={erVarigEndring}
            erNyoppstartet={erNyoppstartet}
            endretTekst={lagEndretTekst(avklaringsbehov, erNyArbLivet, readOnly, false)}
            fieldArrayID={fieldArrayID}
          />
          <VerticalSpacer sixteenPx />
        </Panel>
      </div>
    );
  }
  return null;
};
AksjonspunktBehandler.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  formName: PropTypes.string.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  relevanteStatuser: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

AksjonspunktBehandler.defaultProps = {
  allePerioder: undefined,
};

AksjonspunktBehandler.transformValues = values => values.ATFLVurdering;

export default injectIntl(AksjonspunktBehandler);
