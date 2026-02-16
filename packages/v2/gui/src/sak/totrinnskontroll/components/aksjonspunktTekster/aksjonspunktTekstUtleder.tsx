import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import { Klagevurdering } from '@k9-sak-web/backend/k9klage/kodeverk/Klagevurdering.js';
import {
  isKlagevurderingOmgjørType,
  KlagevurderingOmgjør,
  type KlagevurderingOmgjørType,
} from '@k9-sak-web/backend/k9klage/kodeverk/KlagevurderingOmgjør.js';
import {
  k9_kodeverk_behandling_BehandlingStatus as BehandlingStatus,
  folketrygdloven_kalkulus_kodeverk_ArbeidsforholdHandlingType as HandlingType,
  type k9_sak_kontrakt_vedtak_TotrinnsArbeidsforholdDto as TotrinnsArbeidsforholdDto,
  type k9_sak_kontrakt_vedtak_TotrinnsBeregningDto as TotrinnsBeregningDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Label } from '@navikt/ds-react';
import hash from 'object-hash';
import React, { type JSX, type ReactNode } from 'react';
import type { K9Kodeverkoppslag } from '../../../../kodeverk/oppslag/useK9Kodeverkoppslag.tsx';
import totrinnskontrollaksjonspunktTextCodes from '../../totrinnskontrollaksjonspunktTextCodes.js';
import type { TotrinnskontrollBehandling } from '../../types/TotrinnskontrollBehandling.js';
import vurderFaktaOmBeregningTotrinnText from '../../VurderFaktaBeregningTotrinnText.js';

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
  kodeverkoppslag: K9Kodeverkoppslag,
) => {
  const formattedMessages: JSX.Element[] = [];
  if (arbeidforholdDto.brukPermisjon === true) {
    formattedMessages.push(<b>Søker er i permisjon.</b>);
    return formattedMessages;
  }
  if (arbeidforholdDto.brukPermisjon === false) {
    formattedMessages.push(<b> Søker er ikke i permisjon.</b>);
    if (arbeidforholdDto.arbeidsforholdHandlingType === HandlingType.BRUK) {
      return formattedMessages;
    }
  }
  const melding =
    arbeidforholdDto.arbeidsforholdHandlingType != null
      ? kodeverkoppslag.k9sak.arbeidsforholdHandlingTyper(arbeidforholdDto.arbeidsforholdHandlingType, 'or undefined')
          ?.navn
      : undefined;
  formattedMessages.push(<b> {melding}.</b>);
  return formattedMessages;
};

const buildArbeidsforholdText = (
  aksjonspunkt: TotrinnskontrollAksjonspunkterDto,
  kodeverkoppslag: K9Kodeverkoppslag,
) => {
  const arbeidsforholdDtos =
    'arbeidsforholdDtos' in aksjonspunkt && aksjonspunkt.arbeidsforholdDtos != null
      ? aksjonspunkt.arbeidsforholdDtos
      : [];
  return arbeidsforholdDtos.map(arbeidforholdDto => {
    const formattedMessages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, kodeverkoppslag);
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
  });
};

const getTextFromAksjonspunktkode = (aksjonspunkt: TotrinnskontrollAksjonspunkterDto): ReactNode => {
  const aksjonspunktText = totrinnskontrollaksjonspunktTextCodes[aksjonspunkt.aksjonspunktKode];
  return aksjonspunktText ?? null;
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

const omgjoerTekstMap: Record<KlagevurderingOmgjørType, string> = {
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
    case Klagevurdering.STADFESTE_YTELSESVEDTAK:
      aksjonspunktText = 'Stadfest ytelsesvedtak';
      break;
    case Klagevurdering.OPPHEVE_YTELSESVEDTAK:
      aksjonspunktText = 'Opphev ytelsesvedtak';
      break;
    case Klagevurdering.AVVIS_KLAGE:
      aksjonspunktText = 'Klagen avvist fordi den ikke oppfyller formkravene';
      break;
    case Klagevurdering.HJEMSENDE_UTEN_Å_OPPHEVE:
      aksjonspunktText = 'Hjemsend uten å oppheve';
      break;
    case Klagevurdering.MEDHOLD_I_KLAGE:
      if (
        isKlagevurderingOmgjørType(klageVurderingResultat.klageVurderingOmgjoer) &&
        klageVurderingResultat.klageVurderingOmgjoer !== KlagevurderingOmgjør.UDEFINERT
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

const getTextForKlage = (
  klagebehandlingVurdering: KlagebehandlingDto,
  behandlingStaus: TotrinnskontrollBehandling['status'],
) => {
  if (behandlingStaus === BehandlingStatus.FATTER_VEDTAK) {
    if (klagebehandlingVurdering.klageVurderingResultatNK) {
      return getTextForKlageHelper(klagebehandlingVurdering.klageVurderingResultatNK);
    }
    if (klagebehandlingVurdering.klageVurderingResultatNFP) {
      return getTextForKlageHelper(klagebehandlingVurdering.klageVurderingResultatNFP);
    }
  }
  return null;
};

const erKlageAksjonspunkt = (aksjonspunkt: TotrinnskontrollAksjonspunkterDto) =>
  aksjonspunkt.aksjonspunktKode === AksjonspunktDefinisjon.MANUELL_VURDERING_AV_KLAGE_NFP ||
  aksjonspunkt.aksjonspunktKode === AksjonspunktDefinisjon.MANUELL_VURDERING_AV_KLAGE_NK ||
  aksjonspunkt.aksjonspunktKode === AksjonspunktDefinisjon.VURDERING_AV_FORMKRAV_KLAGE_NFP ||
  aksjonspunkt.aksjonspunktKode === AksjonspunktDefinisjon.VURDERING_AV_FORMKRAV_KLAGE_KA;

const getAksjonspunkttekst = (
  behandlingStatus: TotrinnskontrollBehandling['status'],
  aksjonspunkt: TotrinnskontrollAksjonspunkterDto,
  klagebehandlingVurdering: KlagebehandlingDto | undefined,
  kodeverkoppslag: K9Kodeverkoppslag,
): ReactNode[] | null => {
  if ('beregningDtoer' in aksjonspunkt && aksjonspunkt.beregningDtoer) {
    // beregningDtoer finnast kun i k9_sak sin TotrinnskontrollAksjonspunkterDto, så funksjonane inni her blir berre kalla
    // for aksjonspunkt derifrå, med den typen.
    if (
      aksjonspunkt.aksjonspunktKode ===
      AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NÆRING_SELVSTENDIG_NÆRINGSDRIVENDE
    ) {
      return aksjonspunkt.beregningDtoer?.map(dto => buildVarigEndringBeregningText(dto));
    }
    if (aksjonspunkt.aksjonspunktKode === AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON) {
      return aksjonspunkt.beregningDtoer?.map(dto => buildVarigEndretArbeidssituasjonBeregningText(dto));
    }
    if (aksjonspunkt.aksjonspunktKode === AksjonspunktDefinisjon.VURDER_FAKTA_FOR_ATFL_SN) {
      return getFaktaOmBeregningTextFlereGrunnlag(aksjonspunkt.beregningDtoer);
    }
  }

  if (erKlageAksjonspunkt(aksjonspunkt) && klagebehandlingVurdering) {
    return [getTextForKlage(klagebehandlingVurdering, behandlingStatus)];
  }
  if (aksjonspunkt.aksjonspunktKode === AksjonspunktDefinisjon.VURDER_ARBEIDSFORHOLD) {
    return buildArbeidsforholdText(aksjonspunkt, kodeverkoppslag);
  }

  return [getTextFromAksjonspunktkode(aksjonspunkt)];
};

export default getAksjonspunkttekst;
