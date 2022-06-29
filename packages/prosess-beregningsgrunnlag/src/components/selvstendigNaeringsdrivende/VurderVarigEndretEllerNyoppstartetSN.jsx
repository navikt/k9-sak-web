import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  hasValidText,
  maxLength,
  minLength,
  required,
  parseCurrencyInput,
  formatCurrencyNoKr,
  removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import { InputField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import { Normaltekst } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import TextAreaField from '../redesign/TextAreaField';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);
export const begrunnelseFieldname = 'varigEndringNyoppstartetBegrunnelse';
export const varigEndringRadioname = 'erVarigEndretNaering';
export const fastsettInntektFieldname = 'bruttoBeregningsgrunnlag';
const { VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE } = avklaringsbehovCodes;

/**
 * VurderVarigEndretEllerNyoppstartetSN
 *
 * Aksjonspunkt: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
 *
 * Presentasjonskomponent. Setter opp radioknapper som lar saksbehandler vurdere
 * aksjonspunkt om søker har hatt varig endret eller nyoppstaret næring.
 */
export const VurderVarigEndretEllerNyoppstartetSN = ({
  intl,
  readOnly,
  erVarigEndring,
  erNyoppstartet,
  erVarigEndretNaering,
  endretTekst,
  fieldArrayID,
}) => {
  let radioLabel1 = <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IngenEndring" />;
  let radioLabel2 = <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.EndretNaering" />;
  if (erNyoppstartet && !erVarigEndring) {
    radioLabel1 = <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IkkeNyoppstartet" />;
    radioLabel2 = <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.Nyoppstartet" />;
  }
  if (erVarigEndring && !erNyoppstartet) {
    radioLabel1 = <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IkkeVarigEndring" />;
    radioLabel2 = <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.VarigEndring" />;
  }
  return (
    <>
      {!readOnly && (
        <Row>
          <Column xs="12">
            <RadioGroupField
              name={`${fieldArrayID}.${varigEndringRadioname}`}
              validate={[required]}
              direction="vertical"
              readOnly={readOnly}
            >
              <RadioOption label={radioLabel1} value={false} />
              <RadioOption label={radioLabel2} value />
            </RadioGroupField>
          </Column>
        </Row>
      )}
      {readOnly && (
        <>
          <Row>
            <Column xs="12">
              <Normaltekst>
                {erNyoppstartet && (
                  <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.Nyoppstartet" />
                )}
                {erVarigEndring && (
                  <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.VarigEndring" />
                )}
              </Normaltekst>
            </Column>
          </Row>
          <VerticalSpacer sixteenPx />
        </>
      )}
      {erVarigEndretNaering && (
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
          <VerticalSpacer sixteenPx />
        </>
      )}
      <Row>
        <Column xs="12">
          <TextAreaField
            name={`${fieldArrayID}.${begrunnelseFieldname}`}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            placeholder={intl.formatMessage({
              id: 'Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag.Placeholder',
            })}
            endrettekst={endretTekst}
          />
        </Column>
      </Row>
    </>
  );
};

VurderVarigEndretEllerNyoppstartetSN.propTypes = {
  intl: PropTypes.shape().isRequired,
  endretTekst: PropTypes.node,
  readOnly: PropTypes.bool.isRequired,
  erVarigEndring: PropTypes.bool.isRequired,
  erNyoppstartet: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,
  fieldArrayID: PropTypes.string,
};

VurderVarigEndretEllerNyoppstartetSN.defaultProps = {
  erVarigEndretNaering: false,
};

const verdiErSatt = verdi => typeof verdi === 'number';

VurderVarigEndretEllerNyoppstartetSN.buildInitialValues = (relevanteAndeler, avklaringsbehov) => {
  if (relevanteAndeler.length === 0 || !avklaringsbehov || avklaringsbehov.length === 0) {
    return undefined;
  }
  const snAndel = relevanteAndeler.find(
    andel => andel.aktivitetStatus === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const varigEndretNaeringAP = avklaringsbehov.find(
    ap => ap.definisjon === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const varigEndringValg = isAvklaringsbehovOpen(varigEndretNaeringAP.status)
    ? undefined
    : verdiErSatt(snAndel.overstyrtPrAar);
  if (varigEndretNaeringAP) {
    return {
      [varigEndringRadioname]: varigEndringValg,
      [begrunnelseFieldname]: varigEndretNaeringAP.begrunnelse ? varigEndretNaeringAP.begrunnelse : '',
      [fastsettInntektFieldname]: snAndel ? formatCurrencyNoKr(snAndel.overstyrtPrAar) : undefined,
    };
  }
  return undefined;
};

VurderVarigEndretEllerNyoppstartetSN.transformValues = values => {
  const erVarigEndring = values[varigEndringRadioname];
  return {
    kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    begrunnelse: values[begrunnelseFieldname],
    erVarigEndretNaering: erVarigEndring,
    bruttoBeregningsgrunnlag: erVarigEndring ? removeSpacesFromNumber(values[fastsettInntektFieldname]) : undefined,
  };
};

export default injectIntl(VurderVarigEndretEllerNyoppstartetSN);
