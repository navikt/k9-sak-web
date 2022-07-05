import React, { ReactNode } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageVurderingOmgjoerCodes from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import aksjonspunktCodes, { isUttakAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import {
  KodeverkMedNavn,
  KlageVurdering,
  TotrinnskontrollAksjonspunkt,
  TotrinnskontrollArbeidsforhold,
  TotrinnsBeregningDto,
} from '@k9-sak-web/types';

import totrinnskontrollaksjonspunktTextCodes, {
  totrinnsTilbakekrevingkontrollaksjonspunktTextCodes,
} from '../../totrinnskontrollaksjonspunktTextCodes';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';
import vurderFaktaOmBeregningTotrinnText from '../../VurderFaktaBeregningTotrinnText';

const formatDate = (date?: string) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const buildVarigEndringBeregningText = (beregningDto: TotrinnskontrollAksjonspunkt['beregningDto']) =>
  beregningDto?.fastsattVarigEndringNaering ? (
    <FormattedMessage id="ToTrinnsForm.Beregning.VarigEndring" />
  ) : (
    <FormattedMessage id="ToTrinnsForm.Beregning.IkkeVarigEndring" />
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

const buildUttakText = (aksjonspunkt: TotrinnskontrollAksjonspunkt): ReactNode[] =>
  aksjonspunkt.uttakPerioder.map(
    (uttakperiode): ReactNode => {
      const fom = formatDate(uttakperiode.fom);
      const tom = formatDate(uttakperiode.tom);
      let id;

      if (uttakperiode.erSlettet) {
        id = 'ToTrinnsForm.AvklarUttak.PeriodeSlettet';
      } else if (uttakperiode.erLagtTil) {
        id = 'ToTrinnsForm.AvklarUttak.PeriodeLagtTil';
      } else if (uttakperiode.erEndret && aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.TILKNYTTET_STORTINGET) {
        id = 'ToTrinnsForm.ManueltFastsattUttak.PeriodeEndret';
      } else if (
        uttakperiode.erEndret &&
        aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      ) {
        id = 'ToTrinnsForm.OverstyrUttak.PeriodeEndret';
      } else if (uttakperiode.erEndret) {
        id = 'ToTrinnsForm.AvklarUttak.PeriodeEndret';
      } else {
        id = 'ToTrinnsForm.AvklarUttak.PeriodeAvklart';
      }

      return <FormattedMessage id={id} values={{ a: fom, b: tom }} />;
    },
  );

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
  const aksjonspunktTextIds = bg.faktaOmBeregningTilfeller.map((kode) => vurderFaktaOmBeregningTotrinnText[kode]);
  return (
    <>
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
        aksjonspunktTextId ? <FormattedMessage id={aksjonspunktTextId} /> : null,
      )}
    </>
  );
};

const getFaktaOmBeregningText = (beregningDto: TotrinnsBeregningDto): ReactNode[] | null => {
  if (!beregningDto.faktaOmBeregningTilfeller) {
    return null;
  }
  const aksjonspunktTextIds = beregningDto.faktaOmBeregningTilfeller.map(
    (kode) => vurderFaktaOmBeregningTotrinnText[kode],
  );

  const filtrerteApTextIds = aksjonspunktTextIds.filter(aksjonspunktTextId => !!aksjonspunktTextId);
  if (filtrerteApTextIds.length === 0) {
    return null;
  }

  return filtrerteApTextIds.map(aksjonspunktTextId => <FormattedMessage id={aksjonspunktTextId} />);
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
  isForeldrepenger: boolean,
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
    return [buildVarigEndringBeregningText(aksjonspunkt.beregningDto)];
  }
  if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN) {
    // TODO Workaround for saker behandlet før TSF-818 ble rettet. Løst så de kan sende tilbake sakene i prod, skal fjernes etter at sakene er rettet
    if (!aksjonspunkt.beregningDtoer && !aksjonspunkt.beregningDto) {
      return [<FormattedMessage id="ToTrinnsForm.Beregning.Generell" />];
    }
    return aksjonspunkt.beregningDtoer
      ? getFaktaOmBeregningTextFlereGrunnlag(aksjonspunkt.beregningDtoer)
      : getFaktaOmBeregningText(aksjonspunkt.beregningDto);
  }
  if (
    isUttakAksjonspunkt(aksjonspunkt.aksjonspunktKode) &&
    aksjonspunkt.uttakPerioder &&
    aksjonspunkt.uttakPerioder.length > 0
  ) {
    return buildUttakText(aksjonspunkt);
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
