import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  hasValidText,
  maxLength,
  minLength,
  parseCurrencyInput,
  removeSpacesFromNumber,
  required,
  formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import { InputField } from '@fpsak-frontend/form';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { Normaltekst } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import TextAreaField from '../redesign/TextAreaField';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);
export const begrunnelseFieldname = 'fastsettBeregningsgrnunnlagSNBegrunnelse';
export const fastsettInntektFieldname = 'bruttoBeregningsgrunnlag';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
} = avklaringsbehovCodes;

/**
 * FastsettSN
 *
 * Aksjonspunkt: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE
 *
 * Presentasjonskomponent. Setter opp inputfelt som lar saksbehandler fastsette
 * næringsinntekt for selvstendig næringsdrivende. Opprettes enten hvis det er varig endret / nyoppstartet næring eller søker er ny i arbeidslivet.
 */
export const FastsettSN = ({
  readOnly,
  isAvklaringsbehovClosed,
  intl,
  avklaringsbehov,
  erNyArbLivet,
  endretTekst,
  fieldArrayID,
}) => {
  const harGammeltAPFastsettBrutto = avklaringsbehov
    ? avklaringsbehov.find(
      ap => ap.definisjon === FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
    )
    : false;
  const harAPSNNyiArbLiv = avklaringsbehov
    ? avklaringsbehov.find(ap => ap.definisjon === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET)
    : false;

  return (
    <>
      {erNyArbLivet && (
        <>
          <Row className={styles.verticalAlignMiddle}>
            <Column className={styles.dynamiskKolonne}>
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.BruttoBerGr2" />
              </Normaltekst>
            </Column>
            <Column xs="5">
              <div id="readOnlyWrapper" className={readOnly ? styles.inputPadding : undefined}>
                <InputField
                  name={`${fieldArrayID}.${fastsettInntektFieldname}`}
                  bredde="S"
                  validate={[required]}
                  parse={parseCurrencyInput}
                  readOnly={readOnly}
                />
              </div>
            </Column>
          </Row>
          <VerticalSpacer eightPx />
        </>
      )}

      {(harGammeltAPFastsettBrutto || harAPSNNyiArbLiv) && (
        <>
          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="12" className={styles.marginTop}>
              <div id="readOnlyWrapper" className={readOnly ? styles.verticalLine : styles.textAreaWrapperHeigh}>
                <TextAreaField
                  name={`${fieldArrayID}.${begrunnelseFieldname}`}
                  label={<FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />}
                  validate={[required, maxLength1500, minLength3, hasValidText]}
                  maxLength={1500}
                  readOnly={readOnly}
                  isEdited={isAvklaringsbehovClosed}
                  placeholder={intl.formatMessage({
                    id: 'Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag.Placeholder',
                  })}
                  endrettekst={endretTekst}
                />
              </div>
            </Column>
          </Row>
        </>
      )}
    </>
  );
};

FastsettSN.propTypes = {
  intl: PropTypes.shape().isRequired,
  endretTekst: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  erNyArbLivet: PropTypes.bool.isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

FastsettSN.buildInitialValuesNyIArbeidslivet = (relevanteAndeler, avklaringsbehov) => {
  if (relevanteAndeler.length === 0 || !avklaringsbehov || avklaringsbehov.length === 0) {
    return undefined;
  }
  const snAndel = relevanteAndeler.find(
    andel => andel.aktivitetStatus === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const nyIArbeidslivetAP = avklaringsbehov.find(
    ap => ap.definisjon === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  );
  return {
    [fastsettInntektFieldname]: snAndel ? formatCurrencyNoKr(snAndel.overstyrtPrAar) : undefined,
    [begrunnelseFieldname]: nyIArbeidslivetAP && nyIArbeidslivetAP.begrunnelse ? nyIArbeidslivetAP.begrunnelse : '',
  };
};

FastsettSN.transformValuesNyIArbeidslivet = values => ({
  kode: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  begrunnelse: values[begrunnelseFieldname],
  bruttoBeregningsgrunnlag: removeSpacesFromNumber(values[fastsettInntektFieldname]),
});

export default injectIntl(FastsettSN);
