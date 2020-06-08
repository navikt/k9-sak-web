import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextHTML, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';

import { Undertittel } from 'nav-frontend-typografi';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import AvviksopplysningerPanel from '../fellesPaneler/AvvikopplysningerPanel';
import SkjeringspunktOgStatusPanel, {
  RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN,
} from '../fellesPaneler/SkjeringspunktOgStatusPanel';
import VurderOgFastsettSN from '../selvstendigNaeringsdrivende/VurderOgFastsettSN';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import Beregningsgrunnlag, {
  TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING,
} from '../beregningsgrunnlagPanel/Beregningsgrunnlag';
import AksjonspunktBehandler from '../fellesPaneler/AksjonspunktBehandler';
import BeregningsresultatTable from '../beregningsresultatPanel/BeregningsresultatTable';

import AksjonspunktBehandlerAT from '../arbeidstaker/AksjonspunktBehandlerAT';
import AksjonspunktBehandlerFL from '../frilanser/AksjonspunktBehandlerFL';
import AvsnittSkiller from '../redesign/AvsnittSkiller';
import YtelsegrunnlagPanel from '../ytelsesspesifikkseOpplysninger/YtelsegrunnlagPanel';

import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';

// ------------------------------------------------------------------------------------------ //
// Variables
// ------------------------------------------------------------------------------------------ //

const formName = 'BeregningForm';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_DEKNINGSGRAD,
} = aksjonspunktCodes;
// ------------------------------------------------------------------------------------------ //
// Methods
// ------------------------------------------------------------------------------------------ //

const gjelderBehandlingenBesteberegning = faktaOmBeregning =>
  faktaOmBeregning && faktaOmBeregning.faktaOmBeregningTilfeller
    ? faktaOmBeregning.faktaOmBeregningTilfeller.some(
        tilfelle => tilfelle.kode === faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE,
      )
    : false;

const harPerioderMedAvsluttedeArbeidsforhold = allePerioder =>
  allePerioder.some(
    ({ periodeAarsaker }) =>
      periodeAarsaker && periodeAarsaker.some(({ kode }) => kode === periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET),
  );

const findAksjonspunktHelpTekst = (gjeldendeAksjonspunkt, erVarigEndring, erNyArbLivet, erNyoppstartet) => {
  switch (gjeldendeAksjonspunkt.definisjon.kode) {
    case FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS:
      return 'Beregningsgrunnlag.Helptext.Arbeidstaker2';
    case VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE:
      if (erVarigEndring) {
        return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende.VarigEndring';
      }
      if (erNyoppstartet) {
        return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende.Nyoppstartet';
      }
      return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende2';
    case FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD:
      return 'Beregningsgrunnlag.Helptext.TidsbegrensetArbeidsforhold2';
    case FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE:
      return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende2';
    case FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET:
      return 'Beregningsgrunnlag.Helptext.NyIArbeidslivetSN2';
    case VURDER_DEKNINGSGRAD:
      return 'Beregningsgrunnlag.Helptext.BarnetHarDødDeFørsteSeksUkene';
    default:
      return 'Beregningsgrunnlag.Helptext.Ukjent';
  }
};

const lagAksjonspunktViser = (gjeldendeAksjonspunkter, avvikProsent, alleAndelerIForstePeriode) => {
  if (gjeldendeAksjonspunkter === undefined || gjeldendeAksjonspunkter === null) {
    return undefined;
  }
  const vurderDekninsgradAksjonspunkt = gjeldendeAksjonspunkter.filter(
    ap => ap.definisjon.kode === VURDER_DEKNINGSGRAD,
  );
  const sorterteAksjonspunkter = vurderDekninsgradAksjonspunkt.concat(gjeldendeAksjonspunkter);
  const apneAksjonspunkt = sorterteAksjonspunkter.filter(ap => isAksjonspunktOpen(ap.status.kode));
  const erDetMinstEttApentAksjonspunkt = apneAksjonspunkt.length > 0;
  const snAndel = alleAndelerIForstePeriode.find(
    andel => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const erVarigEndring = snAndel && snAndel.næringer && snAndel.næringer.some(naring => naring.erVarigEndret === true);
  const erNyoppstartet = snAndel && snAndel.næringer && snAndel.næringer.some(naring => naring.erNyoppstartet === true);
  const erNyArbLivet = snAndel && snAndel.erNyIArbeidslivet;
  return (
    <div>
      {erDetMinstEttApentAksjonspunkt && (
        <>
          <AksjonspunktHelpTextHTML>
            {apneAksjonspunkt.map(ap => (
              <FormattedHTMLMessage
                key={ap.definisjon.kode}
                id={findAksjonspunktHelpTekst(ap, erVarigEndring, erNyArbLivet, erNyoppstartet)}
                values={{ verdi: avvikProsent }}
              />
            ))}
          </AksjonspunktHelpTextHTML>
          <VerticalSpacer thirtyTwoPx />
        </>
      )}
    </div>
  );
};

const harAksjonspunkt = (aksjonspunktKode, gjeldendeAksjonspunkter) =>
  gjeldendeAksjonspunkter !== undefined &&
  gjeldendeAksjonspunkter !== null &&
  gjeldendeAksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktKode);

const transformValuesATFLHverForSeg = (values, skalFastsetteAT, skalFastsetteFL, alleAndelerIForstePeriode) => [
  {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: AksjonspunktBehandler.transformValues(values),
    inntektFrilanser: skalFastsetteFL ? AksjonspunktBehandlerFL.transformValuesForFL(values) : undefined,
    inntektPrAndelList: skalFastsetteAT
      ? AksjonspunktBehandlerAT.transformValuesForAT(values, alleAndelerIForstePeriode)
      : undefined,
  },
];

const transformValuesATFLHverForSegTidsbegrenset = (values, skalFastsetteAT, skalFastsetteFL, allePerioder) => [
  {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: AksjonspunktBehandler.transformValues(values),
    inntektFrilanser: skalFastsetteFL ? AksjonspunktBehandlerFL.transformValuesForFL(values) : undefined,
    fastsatteTidsbegrensedePerioder: skalFastsetteAT
      ? AksjonspunktBehandlerTB.transformValues(values, allePerioder)
      : undefined,
  },
];

function leggPåSkjæringstidspunktPåAksjonspunktListe(aksjonspunktListe, skjæringstidspunkt) {
  return aksjonspunktListe.map(aksjonspunkt => ({
    ...aksjonspunkt,
    skjæringstidspunkt,
  }));
}

export const transformValues = (
  values,
  relevanteStatuser,
  alleAndelerIForstePeriode,
  gjeldendeAksjonspunkter,
  allePerioder,
  harNyttIkkeSamletSammenligningsgrunnlag,
) => {
  const skalFastsetteAT = alleAndelerIForstePeriode.some(
    andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER && andel.skalFastsetteGrunnlag,
  );
  const skalFastsetteFL = alleAndelerIForstePeriode.some(
    andel => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER && andel.skalFastsetteGrunnlag,
  );
  const skalATOgFLFastsettesHverForSeg =
    (skalFastsetteAT || skalFastsetteFL) && harNyttIkkeSamletSammenligningsgrunnlag;
  const harTidsbegrensedeArbeidsforhold = harPerioderMedAvsluttedeArbeidsforhold(allePerioder);
  const aksjonspunkter = [];
  const { skjæringstidspunkt } = values;
  const vurderDekningsgradAksjonspunkt = {
    kode: VURDER_DEKNINGSGRAD,
    begrunnelse: values[TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING],
    dekningsgrad: values[RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN],
  };
  if (harAksjonspunkt(VURDER_DEKNINGSGRAD, gjeldendeAksjonspunkter)) {
    aksjonspunkter.push(vurderDekningsgradAksjonspunkt);
  }
  if (
    harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, gjeldendeAksjonspunkter) &&
    !harTidsbegrensedeArbeidsforhold
  ) {
    if (skalATOgFLFastsettesHverForSeg) {
      return leggPåSkjæringstidspunktPåAksjonspunktListe(
        aksjonspunkter.concat(
          transformValuesATFLHverForSeg(values, skalFastsetteAT, skalFastsetteFL, alleAndelerIForstePeriode),
        ),
        skjæringstidspunkt,
      );
    }
    return leggPåSkjæringstidspunktPåAksjonspunktListe(
      aksjonspunkter.concat(
        AksjonspunktBehandlerAT.transformValues(values, relevanteStatuser, alleAndelerIForstePeriode),
      ),
      skjæringstidspunkt,
    );
  }
  if (
    harAksjonspunkt(
      VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      gjeldendeAksjonspunkter,
    ) ||
    harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)
  ) {
    return leggPåSkjæringstidspunktPåAksjonspunktListe(
      aksjonspunkter.concat(VurderOgFastsettSN.transformValues(values, gjeldendeAksjonspunkter)),
      skjæringstidspunkt,
    );
  }
  if (
    (harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, gjeldendeAksjonspunkter) ||
      harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD, gjeldendeAksjonspunkter)) &&
    harTidsbegrensedeArbeidsforhold
  ) {
    if (skalATOgFLFastsettesHverForSeg) {
      const t = transformValuesATFLHverForSegTidsbegrenset(values, skalFastsetteAT, skalFastsetteFL, allePerioder);
      return leggPåSkjæringstidspunktPåAksjonspunktListe(aksjonspunkter.concat(t), skjæringstidspunkt);
    }
    return leggPåSkjæringstidspunktPåAksjonspunktListe(
      aksjonspunkter.concat(Beregningsgrunnlag.transformValues(values, allePerioder)),
      skjæringstidspunkt,
    );
  }
  return leggPåSkjæringstidspunktPåAksjonspunktListe(aksjonspunkter, skjæringstidspunkt);
};

const getSammenligningsgrunnlagsPrStatus = bg =>
  bg.sammenligningsgrunnlagPrStatus ? bg.sammenligningsgrunnlagPrStatus : undefined;
const finnAlleAndelerIFørstePeriode = allePerioder => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};

const getAvviksprosent = sammenligningsgrunnlagPrStatus => {
  if (!sammenligningsgrunnlagPrStatus) {
    return undefined;
  }
  const avvikElem = sammenligningsgrunnlagPrStatus.find(status => status.avvikProsent > 25);
  const avvikProsent = avvikElem && avvikElem.avvikProsent ? avvikElem.avvikProsent : 0;
  if (avvikProsent || avvikProsent === 0) {
    return Number(avvikProsent.toFixed(1));
  }
  return undefined;
};

const getStatusList = beregningsgrunnlagPeriode => {
  const statusList = beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
    .filter(statusAndel => statusAndel.erTilkommetAndel !== true)
    .map(statusAndel => statusAndel.aktivitetStatus);
  return statusList;
};

const harFrisinngrunnlag = beregningsgrunnlag => {
  return (
    beregningsgrunnlag.ytelsesspesifiktGrunnlag && beregningsgrunnlag.ytelsesspesifiktGrunnlag.ytelsetype === 'FRISINN'
  );
};

const sjekkOmOmsorgspengegrunnlagOgSettAvviksvurdering = beregningsgrunnlag => {
  if (
    beregningsgrunnlag.ytelsesspesifiktGrunnlag &&
    beregningsgrunnlag.ytelsesspesifiktGrunnlag.ytelsetype === fagsakYtelseType.OMSORGSPENGER
  ) {
    return beregningsgrunnlag.ytelsesspesifiktGrunnlag.skalAvviksvurdere;
  }
  return true;
};

// ------------------------------------------------------------------------------------------ //
// Component : BeregningFormImpl
// ------------------------------------------------------------------------------------------ //
/**
 *
 * BeregningForm
 *
 * Fungerer som den overordnene formen for beregningkomponentene og håndterer alt av submits
 * relatert til beregning.
 *
 */
export const BeregningFormImpl = ({
  readOnly,
  beregningsgrunnlag,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  submitCallback,
  readOnlySubmitButton,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  vilkaarBG,
  fieldArrayID,
}) => {
  const {
    dekningsgrad,
    skjaeringstidspunktBeregning,
    beregningsgrunnlagPeriode,
    faktaOmBeregning,
  } = beregningsgrunnlag;
  const gjelderBesteberegning = gjelderBehandlingenBesteberegning(faktaOmBeregning);
  const sammenligningsgrunnlagPrStatus = getSammenligningsgrunnlagsPrStatus(beregningsgrunnlag);
  const avvikProsent = getAvviksprosent(sammenligningsgrunnlagPrStatus);
  const aktivitetStatusList = getStatusList(beregningsgrunnlagPeriode);
  const tidsBegrensetInntekt = harPerioderMedAvsluttedeArbeidsforhold(beregningsgrunnlagPeriode);
  const harAksjonspunkter = gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 0;
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(beregningsgrunnlagPeriode);
  const skalViseBeregningsresultat = !harFrisinngrunnlag(beregningsgrunnlag);
  const skalViseAvviksprosent = sjekkOmOmsorgspengegrunnlagOgSettAvviksvurdering(beregningsgrunnlag);
  return (
    <>
      {gjeldendeAksjonspunkter && (
        <>
          <VerticalSpacer eightPx />
          {lagAksjonspunktViser(gjeldendeAksjonspunkter, avvikProsent, alleAndelerIForstePeriode)}
        </>
      )}
      <Row>
        <Column xs="12" md="6">
          <Undertittel className={beregningStyles.panelLeft}>
            <FormattedMessage id="Beregningsgrunnlag.Title.Beregning" />
          </Undertittel>
          <VerticalSpacer twentyPx />
          <SkjeringspunktOgStatusPanel
            readOnly={readOnly}
            gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
            alleKodeverk={alleKodeverk}
            aktivitetStatusList={aktivitetStatusList}
            skjeringstidspunktDato={skjaeringstidspunktBeregning}
            gjeldendeDekningsgrad={dekningsgrad}
          />
          {relevanteStatuser.skalViseBeregningsgrunnlag && (
            <>
              <Beregningsgrunnlag
                relevanteStatuser={relevanteStatuser}
                readOnly={readOnly}
                submitCallback={submitCallback}
                gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
                readOnlySubmitButton={readOnlySubmitButton}
                formName={formName}
                allePerioder={beregningsgrunnlagPeriode}
                gjelderBesteberegning={gjelderBesteberegning}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                alleKodeverk={alleKodeverk}
                sammenligningsGrunnlagInntekter={beregningsgrunnlag.sammenligningsgrunnlagInntekter}
                skjeringstidspunktDato={skjaeringstidspunktBeregning}
              />
            </>
          )}
        </Column>
        <Column xs="12" md="6">
          <div className={beregningStyles.paragrafSkiller}>
            <AvsnittSkiller luftOver luftUnder dividerParagraf />
          </div>
          <Undertittel className={beregningStyles.panelRight}>
            <FormattedMessage id="Beregningsgrunnlag.Title.Fastsettelse" />
          </Undertittel>
          <VerticalSpacer twentyPx />

          <AvviksopplysningerPanel
            sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
            relevanteStatuser={relevanteStatuser}
            allePerioder={beregningsgrunnlagPeriode}
            harAksjonspunkter={harAksjonspunkter}
            gjelderBesteberegning={gjelderBesteberegning}
            skalViseAvviksprosent={skalViseAvviksprosent}
          />
          {harAksjonspunkter && (
            <>
              <AvsnittSkiller luftOver luftUnder rightPanel />
              <AksjonspunktBehandler
                readOnly={readOnly}
                readOnlySubmitButton={readOnlySubmitButton}
                formName={formName}
                allePerioder={beregningsgrunnlagPeriode}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                alleKodeverk={alleKodeverk}
                aksjonspunkter={gjeldendeAksjonspunkter}
                relevanteStatuser={relevanteStatuser}
                tidsBegrensetInntekt={tidsBegrensetInntekt}
                fieldArrayID={fieldArrayID}
              />
            </>
          )}
          <>
            <AvsnittSkiller luftOver luftUnder rightPanel />
            <YtelsegrunnlagPanel beregningsgrunnlag={beregningsgrunnlag} readOnly={readOnly} />
          </>
          {skalViseBeregningsresultat && (
            <>
              <AvsnittSkiller luftOver luftUnder rightPanel />
              <BeregningsresultatTable
                beregningsgrunnlagPerioder={beregningsgrunnlag.beregningsgrunnlagPeriode}
                ytelseGrunnlag={beregningsgrunnlag.ytelsesspesifiktGrunnlag}
                dekningsgrad={dekningsgrad}
                vilkaarBG={vilkaarBG}
                aksjonspunkter={gjeldendeAksjonspunkter}
                aktivitetStatusList={aktivitetStatusList}
                grunnbelop={beregningsgrunnlag.grunnbeløp}
                halvGVerdi={beregningsgrunnlag.halvG}
                harAksjonspunkter={harAksjonspunkter}
              />
            </>
          )}
        </Column>
      </Row>
    </>
  );
};

BeregningFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  vilkaarBG: PropTypes.shape().isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

export default BeregningFormImpl;
