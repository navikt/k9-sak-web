import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { FlexRow } from '@fpsak-frontend/shared-components';

import { Column } from 'nav-frontend-grid';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';

import AvvikopplysningerATFL from '../fellesPaneler/AvvikopplysningerATFLSN';

const AvviksopplysningerAT = ({
  relevanteStatuser,
  sammenligningsgrunnlagPrStatus,
  beregnetAarsinntekt,
  skalViseAvviksprosent,
}) => {
  const sammenligningsGrunnlagAT = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find(
        status =>
          (status.sammenligningsgrunnlagType && status.sammenligningsgrunnlagType.kode === sammenligningType.AT) ||
          (status.sammenligningsgrunnlagType && status.sammenligningsgrunnlagType.kode === sammenligningType.ATFLSN),
      )
    : undefined;
  if (!sammenligningsGrunnlagAT) {
    return null;
  }
  const avvikAT = sammenligningsGrunnlagAT.avvikProsent;
  const avvikATRounded = avvikAT ? parseFloat(avvikAT.toFixed(1)) : 0;
  const { differanseBeregnet } = sammenligningsGrunnlagAT;
  const kombinasjonsstatusATSN =
    relevanteStatuser.isKombinasjonsstatus &&
    relevanteStatuser.isArbeidstaker &&
    relevanteStatuser.isSelvstendigNaeringsdrivende &&
    !relevanteStatuser.isFrilanser;
  const kombinasjonsstatusATFLSN =
    relevanteStatuser.isKombinasjonsstatus &&
    relevanteStatuser.isArbeidstaker &&
    relevanteStatuser.isSelvstendigNaeringsdrivende &&
    relevanteStatuser.isFrilanser;
  const visPaneler = {
    visAT: true,
    visFL: false,
    visSN: false,
  };
  if (kombinasjonsstatusATSN || kombinasjonsstatusATFLSN) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            {kombinasjonsstatusATSN && (
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATSN" />
            )}
            {kombinasjonsstatusATFLSN && (
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATFLSN" />
            )}
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }

  if (sammenligningsGrunnlagAT.rapportertPrAar || sammenligningsGrunnlagAT.rapportertPrAar === 0) {
    return (
      <AvvikopplysningerATFL
        beregnetAarsinntekt={beregnetAarsinntekt}
        avvikProsentAvrundet={avvikATRounded}
        differanseBeregnet={differanseBeregnet}
        relevanteStatuser={relevanteStatuser}
        visPanel={visPaneler}
        sammenligningsgrunnlagSum={sammenligningsGrunnlagAT.rapportertPrAar}
        skalViseAvviksprosent={skalViseAvviksprosent}
      />
    );
  }
  return null;
};

AvviksopplysningerAT.propTypes = {
  relevanteStatuser: PropTypes.shape().isRequired,
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  beregnetAarsinntekt: PropTypes.number,
  skalViseAvviksprosent: PropTypes.bool,
};
AvviksopplysningerAT.defaultProps = {
  beregnetAarsinntekt: undefined,
};

export default AvviksopplysningerAT;
