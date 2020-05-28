import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import finnVisningForStatus from './FrisinnUtils';

const erSøktStatus = (bg, status) => {
  const { perioderSøktFor } = bg.ytelsesspesifiktGrunnlag;
  return perioderSøktFor ? perioderSøktFor.some(p => p.statusSøktFor.kode === status) : false;
};

const Grenseverdi = ({ beregningsgrunnlag }) => {
  const bruttoAT = finnVisningForStatus(beregningsgrunnlag, aktivitetStatus.ARBEIDSTAKER);
  const originaltInntektstak = beregningsgrunnlag.grunnbeløp * 6;
  let annenInntektIkkeSøktFor = bruttoAT;
  if (!erSøktStatus(beregningsgrunnlag, aktivitetStatus.FRILANSER)) {
    const bruttoFL = finnVisningForStatus(beregningsgrunnlag, aktivitetStatus.FRILANSER);
    annenInntektIkkeSøktFor += bruttoFL;
  }
  if (!erSøktStatus(beregningsgrunnlag, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)) {
    const bruttoSN = finnVisningForStatus(beregningsgrunnlag, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
    annenInntektIkkeSøktFor += bruttoSN;
  }
  const utregnetInntektstak =
    originaltInntektstak > annenInntektIkkeSøktFor ? originaltInntektstak - annenInntektIkkeSøktFor : 0;
  return (
    <>
      {(utregnetInntektstak || utregnetInntektstak === 0) && (
        <>
          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="12">
              <Element className={beregningStyles.avsnittOverskrift}>
                <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektstakOpplysninger" />
              </Element>
            </Column>
          </Row>
          <Row>
            <Column xs="10">
              <FormattedMessage
                id="Beregningsgrunnlag.Frisinn.Inntektstak"
                values={{
                  grenseverdi: formatCurrencyNoKr(originaltInntektstak),
                  annenInntekt: formatCurrencyNoKr(annenInntektIkkeSøktFor),
                }}
              />
            </Column>
            <Column xs="2">
              <Normaltekst>{formatCurrencyNoKr(utregnetInntektstak)}</Normaltekst>
            </Column>
          </Row>
        </>
      )}
    </>
  );
};
Grenseverdi.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Grenseverdi.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Grenseverdi;
