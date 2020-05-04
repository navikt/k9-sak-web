import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';

const finnSamletBruttoForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  const inntekt = andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ bruttoPrAar }) => bruttoPrAar)
    .reduce((sum, brutto) => sum + brutto, 0);
  if (!inntekt || inntekt === 0) {
    return 0;
  }
  return inntekt;
};

const Grenseverdi = ({ beregningsgrunnlag }) => {
  const førstePeriode = beregningsgrunnlag.beregningsgrunnlagPeriode[0];
  const bruttoAT = finnSamletBruttoForStatus(
    førstePeriode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.ARBEIDSTAKER,
  );
  const originaltInntektstak = beregningsgrunnlag.grunnbeløp * 6;
  const utregnetInntektstak = originaltInntektstak > bruttoAT ? originaltInntektstak - bruttoAT : 0;
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
                  annenInntekt: formatCurrencyNoKr(bruttoAT),
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
