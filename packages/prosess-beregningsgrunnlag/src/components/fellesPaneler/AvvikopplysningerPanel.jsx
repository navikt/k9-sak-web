import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { FlexContainer, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AvviksopplysningerSN from '../selvstendigNaeringsdrivende/AvvikopplysningerSN';
import AvviksopplysningerAT from '../arbeidstaker/AvvikopplysningerAT';
import AvviksopplysningerFL from '../frilanser/AvvikopplysningerFL';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import AvsnittSkiller from '../redesign/AvsnittSkiller';

const finnAlleAndelerIFørstePeriode = allePerioder => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};
const andelErIkkeTilkommetEllerLagtTilAvSBH = andel => {
  // Andelen er fastsatt før og må kunne fastsettes igjen
  if (andel.overstyrtPrAar !== null && andel.overstyrtPrAar !== undefined) {
    return true;
  }
  // Andeler som er lagt til av sbh eller tilkom før stp skal ikke kunne endres på
  return andel.erTilkommetAndel === false && andel.lagtTilAvSaksbehandler === false;
};
const finnAndelerSomSkalVises = (andeler, statuser) => {
  if (!andeler) {
    return [];
  }

  return andeler
    .filter(andel => statuser.includes(andel.aktivitetStatus))
    .filter(andel => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};
const beregnAarsintektForAktivitetStatus = (alleAndelerIForstePeriode, statuser) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndelerIForstePeriode, statuser);
  if (relevanteAndeler) {
    return relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  }
  return null;
};

const lagRelevantePaneler = (
  alleAndelerIForstePeriode,
  relevanteStatuser,
  sammenligningsgrunnlagPrStatus,
  skalViseAvviksprosent,
) => {
  if (relevanteStatuser.isMilitaer) {
    return (
      <Normaltekst>
        <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.Miletar" />
      </Normaltekst>
    );
  }
  return (
    <FlexContainer>
      {relevanteStatuser.isAAP && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AAP" />
            </Normaltekst>
          </Column>
        </Row>
      )}
      {relevanteStatuser.isDagpenger && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.Dagpenger" />
            </Normaltekst>
          </Column>
        </Row>
      )}
      {relevanteStatuser.isArbeidstaker && (
        <AvviksopplysningerAT
          beregnetAarsinntekt={beregnAarsintektForAktivitetStatus(alleAndelerIForstePeriode, [
            aktivitetStatus.FRILANSER,
            aktivitetStatus.ARBEIDSTAKER,
          ])}
          sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
          relevanteStatuser={relevanteStatuser}
          skalViseAvviksprosent={skalViseAvviksprosent}
        />
      )}
      {relevanteStatuser.isFrilanser && (
        <AvviksopplysningerFL
          beregnetAarsinntekt={beregnAarsintektForAktivitetStatus(alleAndelerIForstePeriode, [
            aktivitetStatus.FRILANSER,
            aktivitetStatus.ARBEIDSTAKER,
          ])}
          sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
          relevanteStatuser={relevanteStatuser}
        />
      )}
      {relevanteStatuser.isSelvstendigNaeringsdrivende && (
        <AvviksopplysningerSN
          alleAndelerIForstePeriode={alleAndelerIForstePeriode}
          sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
          relevanteStatuser={relevanteStatuser}
        />
      )}
    </FlexContainer>
  );
};

const harRelevanteStatuserSatt = relevanteStatuser => {
  const statuser = relevanteStatuser;
  delete statuser.skalViseBeregningsgrunnlag;
  delete statuser.harAndreTilstotendeYtelser;
  const statusVerdier = Object.values(statuser);
  return statusVerdier.some(verdi => verdi === true);
};

const AvviksopplysningerPanel = ({
  relevanteStatuser,
  allePerioder,
  sammenligningsgrunnlagPrStatus,
  skalViseAvviksprosent,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);

  const skalViseAvviksPanel = harRelevanteStatuserSatt({ ...relevanteStatuser });
  if (!skalViseAvviksPanel) {
    return null;
  }

  return (
    <Panel className={beregningStyles.panelRight}>
      <AvsnittSkiller luftUnder />
      <Element className={beregningStyles.avsnittOverskrift}>
        <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation" />
      </Element>
      <VerticalSpacer eightPx />
      {lagRelevantePaneler(
        alleAndelerIForstePeriode,
        relevanteStatuser,
        sammenligningsgrunnlagPrStatus,
        skalViseAvviksprosent,
      )}
    </Panel>
  );
};

AvviksopplysningerPanel.propTypes = {
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()),
  skalViseAvviksprosent: PropTypes.bool,
};

AvviksopplysningerPanel.defaultProps = {
  sammenligningsgrunnlagPrStatus: undefined,
};
export default AvviksopplysningerPanel;
