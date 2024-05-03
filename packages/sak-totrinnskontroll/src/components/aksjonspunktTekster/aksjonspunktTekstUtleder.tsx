import { Label } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import arbeidsforholdHandlingType from '@k9-sak-web/kodeverk/src/arbeidsforholdHandlingType';
import behandlingStatusCode from '@k9-sak-web/kodeverk/src/behandlingStatus';
import klageVurderingCodes from '@k9-sak-web/kodeverk/src/klageVurdering';
import klageVurderingOmgjoerCodes from '@k9-sak-web/kodeverk/src/klageVurderingOmgjoer';
import { VerticalSpacer } from '@k9-sak-web/shared-components';
import {
  KlageVurdering,
  Kodeverk,
  KodeverkMedNavn,
  TotrinnsBeregningDto,
  TotrinnskontrollAksjonspunkt,
  TotrinnskontrollArbeidsforhold,
} from '@k9-sak-web/types';

import vurderFaktaOmBeregningTotrinnText from '../../VurderFaktaBeregningTotrinnText';
import totrinnskontrollaksjonspunktTextCodes, {
  totrinnsTilbakekrevingkontrollaksjonspunktTextCodes,
} from '../../totrinnskontrollaksjonspunktTextCodes';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';

const buildVarigEndringBeregningText = (beregningDto: TotrinnskontrollAksjonspunkt['beregningDtoer'][number]) =>
  beregningDto?.fastsattVarigEndringNaering || beregningDto?.fastsattVarigEndring ? (
    <FormattedMessage
      id="ToTrinnsForm.Beregning.VarigEndring"
      values={{
        dato: beregningDto.skjæringstidspunkt,
      }}
    />
  ) : (
    <FormattedMessage
      id="ToTrinnsForm.Beregning.IkkeVarigEndring"
      values={{
        dato: beregningDto.skjæringstidspunkt,
      }}
    />
  );

const buildVarigEndretArbeidssituasjonBeregningText = (
  beregningDto: TotrinnskontrollAksjonspunkt['beregningDtoer'][number],
) =>
  beregningDto?.fastsattVarigEndring ? (
    <FormattedMessage
      id="ToTrinnsForm.Beregning.VarigEndretArbeidssituasjon"
      values={{
        dato: beregningDto.skjæringstidspunkt,
      }}
    />
  ) : (
    <FormattedMessage
      id="ToTrinnsForm.Beregning.IkkeVarigEndretArbeidssituasjon"
      values={{
        dato: beregningDto.skjæringstidspunkt,
      }}
    />
  );

// Eksportert kun for test
export const getFaktaOmArbeidsforholdMessages = (
  arbeidforholdDto: TotrinnskontrollArbeidsforhold,
  arbeidsforholdHandlingTyper: KodeverkMedNavn[],
) => {
  const formattedMessages = [];
  const { kode } = arbeidforholdDto.arbeidsforholdHandlingType;
  if (arbeidforholdDto.brukPermisjon === true) {
    formattedMessages.push(
      <FormattedMessage
        id="ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIPermisjon"
        values={{
          b: (chunks: any) => <b>{chunks}</b>,
        }}
      />,
    );
    return formattedMessages;
  }
  if (arbeidforholdDto.brukPermisjon === false) {
    formattedMessages.push(
      <FormattedMessage
        id="ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIkkeIPermisjon"
        values={{
          b: (chunks: any) => <b>{chunks}</b>,
        }}
      />,
    );
    if (kode === arbeidsforholdHandlingType.BRUK) {
      return formattedMessages;
    }
  }
  const type = arbeidsforholdHandlingTyper.find(t => t.kode === kode);
  const melding = type !== undefined && type !== null ? type.navn : '';
  formattedMessages.push(
    <FormattedMessage
      id="ToTrinnsForm.FaktaOmArbeidsforhold.Melding"
      values={{ melding, b: (chunks: any) => <b>{chunks}</b> }}
    />,
  );
  return formattedMessages;
};

const buildArbeidsforholdText = (
  aksjonspunkt: TotrinnskontrollAksjonspunkt,
  arbeidsforholdHandlingTyper: KodeverkMedNavn[],
) =>
  aksjonspunkt.arbeidsforholdDtos.map(arbeidforholdDto => {
    const formattedMessages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);
    return (
      <>
        <FormattedMessage
          id="ToTrinnsForm.OpplysningerOmSøker.Arbeidsforhold"
          values={{
            orgnavn: arbeidforholdDto.navn,
            orgnummer: arbeidforholdDto.organisasjonsnummer,
            arbeidsforholdId: arbeidforholdDto.arbeidsforholdId
              ? `...${arbeidforholdDto.arbeidsforholdId.slice(-4)}`
              : '',
            b: (chunks: any) => <b>{chunks}</b>,
          }}
        />
        {formattedMessages.map(formattedMessage => (
          <React.Fragment key={formattedMessage.props.id}>{formattedMessage}</React.Fragment>
        ))}
      </>
    );
  });

const buildOpptjeningText = (aksjonspunkt: TotrinnskontrollAksjonspunkt): ReactNode[] =>
  aksjonspunkt.opptjeningAktiviteter.map(aktivitet => <OpptjeningTotrinnText aktivitet={aktivitet} />);

const getTextFromAksjonspunktkode = (aksjonspunkt: TotrinnskontrollAksjonspunkt): ReactNode => {
  const aksjonspunktTextId = totrinnskontrollaksjonspunktTextCodes[aksjonspunkt.aksjonspunktKode];
  return aksjonspunktTextId ? <FormattedMessage id={aksjonspunktTextId} /> : null;
};

const getTextFromTilbakekrevingAksjonspunktkode = (aksjonspunkt: TotrinnskontrollAksjonspunkt) => {
  const aksjonspunktTextId = totrinnsTilbakekrevingkontrollaksjonspunktTextCodes[aksjonspunkt.aksjonspunktKode];
  return aksjonspunktTextId ? <FormattedMessage id={aksjonspunktTextId} /> : null;
};

const lagBgTilfelleTekst = (bg: TotrinnsBeregningDto): ReactNode => {
  const aksjonspunktTextIds = bg.faktaOmBeregningTilfeller.map(({ kode }) => vurderFaktaOmBeregningTotrinnText[kode]);
  return (
    <>
      <Label size="small" as="p">
        <FormattedMessage
          id="ToTrinnsForm.Beregning.Tittel"
          values={{
            dato: bg.skjæringstidspunkt,
          }}
        />
      </Label>
      <VerticalSpacer eightPx />
      {aksjonspunktTextIds.map(aksjonspunktTextId =>
        aksjonspunktTextId ? <FormattedMessage id={aksjonspunktTextId} /> : null,
      )}
    </>
  );
};

const getFaktaOmBeregningTextFlereGrunnlag = (beregningDtoer: TotrinnsBeregningDto[]): ReactNode[] | null => {
  if (!beregningDtoer || beregningDtoer.length < 1) {
    return null;
  }
  return beregningDtoer.map(bg => (bg.faktaOmBeregningTilfeller ? lagBgTilfelleTekst(bg) : null));
};

const omgjoerTekstMap = {
  DELVIS_MEDHOLD_I_KLAGE: 'ToTrinnsForm.Klage.DelvisOmgjortTilGunst',
  GUNST_MEDHOLD_I_KLAGE: 'ToTrinnsForm.Klage.OmgjortTilGunst',
  UGUNST_MEDHOLD_I_KLAGE: 'ToTrinnsForm.Klage.OmgjortTilUgunst',
};

const getTextForKlageHelper = (
  klageVurderingResultat: KlageVurdering['klageVurderingResultatNK'] | KlageVurdering['klageVurderingResultatNFP'],
) => {
  let aksjonspunktTextId = '';
  switch (klageVurderingResultat.klageVurdering) {
    case klageVurderingCodes.STADFESTE_YTELSESVEDTAK:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.StadfesteYtelsesVedtak';
      break;
    case klageVurderingCodes.OPPHEVE_YTELSESVEDTAK:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.OppheveYtelsesVedtak';
      break;
    case klageVurderingCodes.AVVIS_KLAGE:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.Avvist';
      break;
    case klageVurderingCodes.HJEMSENDE_UTEN_Å_OPPHEVE:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.HjemsendUtenOpphev';
      break;
    case klageVurderingCodes.MEDHOLD_I_KLAGE:
      if (
        klageVurderingResultat.klageVurderingOmgjoer &&
        klageVurderingResultat.klageVurderingOmgjoer !== klageVurderingOmgjoerCodes.UDEFINERT
      ) {
        aksjonspunktTextId = omgjoerTekstMap[klageVurderingResultat.klageVurderingOmgjoer];
        break;
      }
      aksjonspunktTextId = 'VedtakForm.ResultatKlageMedhold';
      break;
    default:
      break;
  }
  return <FormattedMessage id={aksjonspunktTextId} />;
};

const getTextForKlage = (klagebehandlingVurdering: KlageVurdering, behandlingStaus: Kodeverk) => {
  if (behandlingStaus.kode === behandlingStatusCode.FATTER_VEDTAK) {
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
  klagebehandlingVurdering: KlageVurdering,
  behandlingStatus: Kodeverk,
  arbeidsforholdHandlingTyper: KodeverkMedNavn[],
  erTilbakekreving: boolean,
  aksjonspunkt: TotrinnskontrollAksjonspunkt,
): ReactNode[] | null => {
  if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) {
    return buildOpptjeningText(aksjonspunkt);
  }
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

  if (erKlageAksjonspunkt(aksjonspunkt)) {
    return [getTextForKlage(klagebehandlingVurdering, behandlingStatus)];
  }
  if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD) {
    return buildArbeidsforholdText(aksjonspunkt, arbeidsforholdHandlingTyper);
  }
  if (erTilbakekreving) {
    return [getTextFromTilbakekrevingAksjonspunktkode(aksjonspunkt)];
  }
  return [getTextFromAksjonspunktkode(aksjonspunkt)];
};

export default getAksjonspunkttekst;
