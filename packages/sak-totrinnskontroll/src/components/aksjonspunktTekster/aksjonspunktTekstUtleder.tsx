import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageVurderingOmgjoerCodes from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import {
  KlageVurdering,
  KodeverkMedNavn,
  TotrinnsBeregningDto,
  TotrinnskontrollAksjonspunkt,
  TotrinnskontrollArbeidsforhold,
} from '@k9-sak-web/types';

import totrinnskontrollaksjonspunktTextCodes, {
  totrinnsTilbakekrevingkontrollaksjonspunktTextCodes,
} from '../../totrinnskontrollaksjonspunktTextCodes';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';
import vurderFaktaOmBeregningTotrinnText from '../../VurderFaktaBeregningTotrinnText';

const buildVarigEndringBeregningText = (beregningDto: TotrinnskontrollAksjonspunkt['beregningDtoer'][number]) =>
  beregningDto?.fastsattVarigEndringNaering || beregningDto?.fastsattVarigEndring ? (
    <React.Fragment key="ToTrinnsForm.Beregning.VarigEndring">
      <FormattedMessage
        id="ToTrinnsForm.Beregning.VarigEndring"
        values={{
          dato: beregningDto.skjæringstidspunkt,
        }}
      />
    </React.Fragment>
  ) : (
    <React.Fragment key="ToTrinnsForm.Beregning.IkkeVarigEndring">
      <FormattedMessage
        id="ToTrinnsForm.Beregning.IkkeVarigEndring"
        values={{
          dato: beregningDto.skjæringstidspunkt,
        }}
      />
    </React.Fragment>
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
  const kode = arbeidforholdDto.arbeidsforholdHandlingType;
  if (arbeidforholdDto.brukPermisjon === true) {
    formattedMessages.push(
      <React.Fragment
        key={`ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIPermisjon-${arbeidforholdDto.arbeidsforholdId}`}
      >
        <FormattedMessage
          id="ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIPermisjon"
          values={{
            b: (chunks: any) => <b>{chunks}</b>,
          }}
        />
      </React.Fragment>,
    );
    return formattedMessages;
  }
  if (arbeidforholdDto.brukPermisjon === false) {
    formattedMessages.push(
      <React.Fragment
        key={`ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIkkeIPermisjon-${arbeidforholdDto.arbeidsforholdId}`}
      >
        <FormattedMessage
          id="ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIkkeIPermisjon"
          values={{
            b: (chunks: any) => <b>{chunks}</b>,
          }}
        />
      </React.Fragment>,
    );
    if (kode === arbeidsforholdHandlingType.BRUK) {
      return formattedMessages;
    }
  }
  const type = arbeidsforholdHandlingTyper.find(t => t.kode === kode);
  const melding = type !== undefined && type !== null ? type.navn : '';
  formattedMessages.push(
    <React.Fragment key={`ToTrinnsForm.FaktaOmArbeidsforhold.Melding-${arbeidforholdDto.arbeidsforholdId}`}>
      <FormattedMessage
        id="ToTrinnsForm.FaktaOmArbeidsforhold.Melding"
        values={{ melding, b: (chunks: any) => <b>{chunks}</b> }}
      />
    </React.Fragment>,
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
      <React.Fragment key={`${arbeidforholdDto.arbeidsforholdId}-wrapper`}>
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
          <React.Fragment key={formattedMessage.key}>{formattedMessage}</React.Fragment>
        ))}
      </React.Fragment>
    );
  });

const buildOpptjeningText = (aksjonspunkt: TotrinnskontrollAksjonspunkt): ReactNode[] =>
  aksjonspunkt.opptjeningAktiviteter.map(aktivitet => <OpptjeningTotrinnText aktivitet={aktivitet} />);

const getTextFromAksjonspunktkode = (aksjonspunkt: TotrinnskontrollAksjonspunkt): ReactNode => {
  const aksjonspunktTextId = totrinnskontrollaksjonspunktTextCodes[aksjonspunkt.aksjonspunktKode];
  return aksjonspunktTextId ? (
    <React.Fragment key="standard-aksjonspunktkode-tekst">
      <FormattedMessage id={aksjonspunktTextId} />
    </React.Fragment>
  ) : null;
};

const getTextFromTilbakekrevingAksjonspunktkode = (aksjonspunkt: TotrinnskontrollAksjonspunkt) => {
  const aksjonspunktTextId = totrinnsTilbakekrevingkontrollaksjonspunktTextCodes[aksjonspunkt.aksjonspunktKode];
  return aksjonspunktTextId ? <FormattedMessage id={aksjonspunktTextId} /> : null;
};

const lagBgTilfelleTekst = (bg: TotrinnsBeregningDto): ReactNode => {
  const aksjonspunktTextIds = bg.faktaOmBeregningTilfeller.map(kode => vurderFaktaOmBeregningTotrinnText[kode]);
  return (
    <React.Fragment key={bg.faktaOmBeregningTilfeller.join()}>
      <Element>
        <FormattedMessage
          id="ToTrinnsForm.Beregning.Tittel"
          values={{
            dato: bg.skjæringstidspunkt,
          }}
        />
      </Element>
      <VerticalSpacer eightPx />
      {aksjonspunktTextIds.map(aksjonspunktTextId =>
        aksjonspunktTextId ? (
          <React.Fragment key={aksjonspunktTextId}>
            <FormattedMessage id={aksjonspunktTextId} />
          </React.Fragment>
        ) : null,
      )}
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
  return <FormattedMessage key="klage-aksjonspunkt-text-id" id={aksjonspunktTextId} />;
};

const getTextForKlage = (klagebehandlingVurdering: KlageVurdering, behandlingStaus: string) => {
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
  klagebehandlingVurdering: KlageVurdering,
  behandlingStatus: string,
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
