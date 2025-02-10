import { Label } from '@navikt/ds-react';
import React, { JSX, ReactNode } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import klageVurderingOmgjoerCodes from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';

import { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { KlagebehandlingDto } from '@navikt/k9-klage-typescript-client';
import { TotrinnsArbeidsforholdDto, TotrinnsBeregningDto } from '@navikt/k9-sak-typescript-client';
import hash from 'object-hash';
import vurderFaktaOmBeregningTotrinnText from '../../VurderFaktaBeregningTotrinnText';
import totrinnskontrollaksjonspunktTextCodes from '../../totrinnskontrollaksjonspunktTextCodes';
import { Behandling } from '../../types/Behandling';
import { TotrinnskontrollAksjonspunkt } from '../../types/TotrinnskontrollAksjonspunkt';
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
    if (arbeidforholdDto.arbeidsforholdHandlingType === arbeidsforholdHandlingType.BRUK) {
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
  const aksjonspunktText = totrinnskontrollaksjonspunktTextCodes[aksjonspunkt.aksjonspunktKode];
  return aksjonspunktText ? aksjonspunktText : null;
};

const lagBgTilfelleTekst = (bg: TotrinnsBeregningDto): ReactNode => {
  const aksjonspunktTexts = bg.faktaOmBeregningTilfeller?.map(kode => vurderFaktaOmBeregningTotrinnText[kode]) ?? [];
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

const omgjoerTekstMap = {
  DELVIS_MEDHOLD_I_KLAGE: 'Delvis omgjøring, til gunst',
  GUNST_MEDHOLD_I_KLAGE: 'Omgjort til gunst',
  UGUNST_MEDHOLD_I_KLAGE: 'Omgjort til ugunst',
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
    case klageVurderingCodes.STADFESTE_YTELSESVEDTAK:
      aksjonspunktText = 'Stadfest ytelsesvedtak';
      break;
    case klageVurderingCodes.OPPHEVE_YTELSESVEDTAK:
      aksjonspunktText = 'Opphev ytelsesvedtak';
      break;
    case klageVurderingCodes.AVVIS_KLAGE:
      aksjonspunktText = 'Klagen avvist fordi den ikke oppfyller formkravene';
      break;
    case klageVurderingCodes.HJEMSENDE_UTEN_Å_OPPHEVE:
      aksjonspunktText = 'Hjemsend uten å oppheve';
      break;
    case klageVurderingCodes.MEDHOLD_I_KLAGE:
      if (
        klageVurderingResultat.klageVurderingOmgjoer &&
        klageVurderingResultat.klageVurderingOmgjoer !== klageVurderingOmgjoerCodes.UDEFINERT
      ) {
        aksjonspunktText = omgjoerTekstMap[klageVurderingResultat.klageVurderingOmgjoer];
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
  if (behandlingStaus === behandlingStatusCode.FATTER_VEDTAK) {
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
  aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP ||
  aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ||
  aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP ||
  aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA;

const getAksjonspunkttekst = (
  behandlingStatus: Behandling['status'],
  arbeidsforholdHandlingTyper: KodeverkObject[],
  aksjonspunkt: TotrinnskontrollAksjonspunkt,
  klagebehandlingVurdering?: KlagebehandlingDto,
): ReactNode[] | null => {
  if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) {
    return buildOpptjeningText(aksjonspunkt);
  }
  if (aksjonspunkt.beregningDtoer) {
    if (
      aksjonspunkt.aksjonspunktKode ===
      aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
    ) {
      return aksjonspunkt.beregningDtoer?.map(dto => buildVarigEndringBeregningText(dto));
    }
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON) {
      return aksjonspunkt.beregningDtoer?.map(dto => buildVarigEndretArbeidssituasjonBeregningText(dto));
    }
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN) {
      return getFaktaOmBeregningTextFlereGrunnlag(aksjonspunkt.beregningDtoer);
    }
  }

  if (erKlageAksjonspunkt(aksjonspunkt) && klagebehandlingVurdering) {
    return [getTextForKlage(klagebehandlingVurdering, behandlingStatus)];
  }
  if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD) {
    return buildArbeidsforholdText(aksjonspunkt, arbeidsforholdHandlingTyper);
  }

  return [getTextFromAksjonspunktkode(aksjonspunkt)];
};

export default getAksjonspunkttekst;
