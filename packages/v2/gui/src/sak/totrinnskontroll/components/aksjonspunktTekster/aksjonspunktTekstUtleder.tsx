import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Label } from '@navikt/ds-react';
import { type KlagebehandlingDto, klageVurdering, klageVurderingOmgjoer } from '@navikt/k9-klage-typescript-client';
import {
  ArbeidsforholdOverstyringDtoHandling,
  BehandlingDtoStatus,
  type TotrinnsArbeidsforholdDto,
  type TotrinnsBeregningDto,
} from '@navikt/k9-sak-typescript-client';
import hash from 'object-hash';
import React, { type JSX, type ReactNode } from 'react';
import vurderFaktaOmBeregningTotrinnText from '../../VurderFaktaBeregningTotrinnText';
import totrinnskontrollaksjonspunktTextCodes from '../../totrinnskontrollaksjonspunktTextCodes';
import { type Behandling } from '../../types/Behandling';
import { type TotrinnskontrollAksjonspunkt } from '../../types/TotrinnskontrollAksjonspunkt';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';

const buildVarigEndringBeregningText = (beregningDto: TotrinnsBeregningDto) =>
  beregningDto?.fastsattVarigEndringNaering || beregningDto?.fastsattVarigEndring
    ? `Det er fastsatt varig endret/nyoppstartet næring fom ${beregningDto.skjæringstidspunkt}.`
    : `Det er fastsatt at det ikke er varig endring i næring fom ${beregningDto.skjæringstidspunkt}.`;

const buildVarigEndretArbeidssituasjonBeregningText = (beregningDto: TotrinnsBeregningDto) =>
  beregningDto?.fastsattVarigEndring
    ? `Det er fastsatt varig endret arbeidssituasjon fom ${beregningDto.skjæringstidspunkt}.`
    : `Det er fastsatt at det ikke er varig endret arbeidssituasjon fom ${beregningDto.skjæringstidspunkt}.`;

// Eksportert kun for test
export const getFaktaOmArbeidsforholdMessages = (
  arbeidforholdDto: TotrinnsArbeidsforholdDto,
  arbeidsforholdHandlingTyper: KodeverkObject[],
) => {
  const formattedMessages: JSX.Element[] = [];
  if (arbeidforholdDto.brukPermisjon === true) {
    formattedMessages.push(<b>Søker er i permisjon.</b>);
    return formattedMessages;
  }
  if (arbeidforholdDto.brukPermisjon === false) {
    formattedMessages.push(<b> Søker er ikke i permisjon.</b>);
    if (arbeidforholdDto.arbeidsforholdHandlingType === ArbeidsforholdOverstyringDtoHandling.BRUK) {
      return formattedMessages;
    }
  }
  const type = arbeidsforholdHandlingTyper.find(t => t.kode === arbeidforholdDto.arbeidsforholdHandlingType);
  const melding = type !== undefined && type !== null ? type.navn : '';
  formattedMessages.push(<b> {melding}.</b>);
  return formattedMessages;
};

const buildArbeidsforholdText = (
  aksjonspunkt: TotrinnskontrollAksjonspunkt,
  arbeidsforholdHandlingTyper: KodeverkObject[],
) =>
  aksjonspunkt.arbeidsforholdDtos?.map(arbeidforholdDto => {
    const formattedMessages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);
    return (
      <React.Fragment key={arbeidforholdDto.arbeidsforholdId}>
        <b>{`Arbeidsforhold hos ${arbeidforholdDto.navn}(${arbeidforholdDto.organisasjonsnummer})${
          arbeidforholdDto.arbeidsforholdId ? `...${arbeidforholdDto.arbeidsforholdId.slice(-4)}` : ''
        }`}</b>
        {` er satt til`}
        {formattedMessages.map(formattedMessage => (
          <React.Fragment key={formattedMessage.props.id}>{formattedMessage}</React.Fragment>
        ))}
      </React.Fragment>
    );
  }) ?? [];

const buildOpptjeningText = (aksjonspunkt: TotrinnskontrollAksjonspunkt): ReactNode[] =>
  aksjonspunkt.opptjeningAktiviteter?.map(aktivitet => (
    <OpptjeningTotrinnText key={hash(aktivitet)} aktivitet={aktivitet} />
  )) ?? [];

const getTextFromAksjonspunktkode = (aksjonspunkt: TotrinnskontrollAksjonspunkt): ReactNode => {
  const aksjonspunktText =
    totrinnskontrollaksjonspunktTextCodes[
      aksjonspunkt.aksjonspunktKode as keyof typeof totrinnskontrollaksjonspunktTextCodes
    ];
  return aksjonspunktText ? aksjonspunktText : null;
};

const lagBgTilfelleTekst = (bg: TotrinnsBeregningDto): ReactNode => {
  const aksjonspunktTexts =
    bg.faktaOmBeregningTilfeller?.map(
      kode => vurderFaktaOmBeregningTotrinnText[kode as keyof typeof vurderFaktaOmBeregningTotrinnText],
    ) ?? [];
  return (
    <React.Fragment key={hash(aksjonspunktTexts)}>
      <Label size="small" as="p">
        {`Vurderinger av beregningsgrunnlag med skjæringstidspunkt ${bg.skjæringstidspunkt}.`}
      </Label>
      <div className="mt-2">{aksjonspunktTexts.map(aksjonspunktTextId => aksjonspunktTextId ?? '')}</div>
    </React.Fragment>
  );
};

const getFaktaOmBeregningTextFlereGrunnlag = (beregningDtoer: TotrinnsBeregningDto[]): ReactNode[] | null => {
  if (!beregningDtoer || beregningDtoer.length < 1) {
    return null;
  }
  return beregningDtoer.map(bg => (bg.faktaOmBeregningTilfeller ? lagBgTilfelleTekst(bg) : null));
};

const omgjoerTekstMap: Record<klageVurderingOmgjoer, string> = {
  DELVIS_MEDHOLD_I_KLAGE: 'Delvis omgjøring, til gunst',
  GUNST_MEDHOLD_I_KLAGE: 'Omgjort til gunst',
  UGUNST_MEDHOLD_I_KLAGE: 'Omgjort til ugunst',
  UDEFINERT: 'Udefinert',
};

const getTextForKlageHelper = (
  klageVurderingResultat:
    | KlagebehandlingDto['klageVurderingResultatNK']
    | KlagebehandlingDto['klageVurderingResultatNFP'],
) => {
  let aksjonspunktText = '';
  if (!klageVurderingResultat) {
    return aksjonspunktText;
  }
  switch (klageVurderingResultat.klageVurdering) {
    case klageVurdering.STADFESTE_YTELSESVEDTAK:
      aksjonspunktText = 'Stadfest ytelsesvedtak';
      break;
    case klageVurdering.OPPHEVE_YTELSESVEDTAK:
      aksjonspunktText = 'Opphev ytelsesvedtak';
      break;
    case klageVurdering.AVVIS_KLAGE:
      aksjonspunktText = 'Klagen avvist fordi den ikke oppfyller formkravene';
      break;
    case klageVurdering.HJEMSENDE_UTEN_Å_OPPHEVE:
      aksjonspunktText = 'Hjemsend uten å oppheve';
      break;
    case klageVurdering.MEDHOLD_I_KLAGE:
      if (
        klageVurderingResultat.klageVurderingOmgjoer &&
        klageVurderingResultat.klageVurderingOmgjoer !== klageVurderingOmgjoer.UDEFINERT
      ) {
        aksjonspunktText =
          omgjoerTekstMap[klageVurderingResultat.klageVurderingOmgjoer as keyof typeof klageVurderingOmgjoer];
        break;
      }
      aksjonspunktText = 'Vedtaket er omgjort';
      break;
    default:
      break;
  }
  return aksjonspunktText;
};

const getTextForKlage = (klagebehandlingVurdering: KlagebehandlingDto, behandlingStaus: Behandling['status']) => {
  if (behandlingStaus === BehandlingDtoStatus.FATTER_VEDTAK) {
    if (klagebehandlingVurdering.klageVurderingResultatNK) {
      return getTextForKlageHelper(klagebehandlingVurdering.klageVurderingResultatNK);
    }
    if (klagebehandlingVurdering.klageVurderingResultatNFP) {
      return getTextForKlageHelper(klagebehandlingVurdering.klageVurderingResultatNFP);
    }
  }
  return null;
};

const erKlageAksjonspunkt = (aksjonspunkt: TotrinnskontrollAksjonspunkt) =>
  aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.BEHANDLE_KLAGE_NFP ||
  aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.BEHANDLE_KLAGE_NK ||
  aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP ||
  aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA;

const getAksjonspunkttekst = (
  behandlingStatus: Behandling['status'],
  arbeidsforholdHandlingTyper: KodeverkObject[],
  aksjonspunkt: TotrinnskontrollAksjonspunkt,
  klagebehandlingVurdering?: KlagebehandlingDto,
): ReactNode[] | null => {
  if (aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) {
    return buildOpptjeningText(aksjonspunkt);
  }
  if (aksjonspunkt.beregningDtoer) {
    if (
      aksjonspunkt.aksjonspunktKode ===
      AksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
    ) {
      return aksjonspunkt.beregningDtoer?.map(dto => buildVarigEndringBeregningText(dto));
    }
    if (aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON) {
      return aksjonspunkt.beregningDtoer?.map(dto => buildVarigEndretArbeidssituasjonBeregningText(dto));
    }
    if (aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN) {
      return getFaktaOmBeregningTextFlereGrunnlag(aksjonspunkt.beregningDtoer);
    }
  }

  if (erKlageAksjonspunkt(aksjonspunkt) && klagebehandlingVurdering) {
    return [getTextForKlage(klagebehandlingVurdering, behandlingStatus)];
  }
  if (aksjonspunkt.aksjonspunktKode === AksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD) {
    return buildArbeidsforholdText(aksjonspunkt, arbeidsforholdHandlingTyper);
  }

  return [getTextFromAksjonspunktkode(aksjonspunkt)];
};

export default getAksjonspunkttekst;
