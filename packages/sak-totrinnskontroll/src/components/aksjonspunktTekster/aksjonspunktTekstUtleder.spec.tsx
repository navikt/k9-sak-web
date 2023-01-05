import { startOfYear, format } from 'date-fns';
import { screen } from '@testing-library/react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurderingOmgjoerCodes from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import behandlingStatusCodes from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { KlageVurdering, TotrinnskontrollAksjonspunkt, TotrinnskontrollArbeidsforhold } from '@k9-sak-web/types';
import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';

import getAksjonspunkttekst, { getFaktaOmArbeidsforholdMessages } from './aksjonspunktTekstUtleder';

import intlMessages from '../../../i18n/nb_NO.json';

const dato = format(startOfYear(new Date()), 'yyyy-MM-dd');

const medholdIKlage = {
  klageVurdering: klageVurderingCodes.MEDHOLD_I_KLAGE,
  klageVurderingOmgjoer: klageVurderingOmgjoerCodes.GUNST_MEDHOLD_I_KLAGE,
};
const oppheveYtelsesVedtak = { klageVurdering: klageVurderingCodes.OPPHEVE_YTELSESVEDTAK };
const avvistKlage = { klageVurdering: klageVurderingCodes.AVVIS_KLAGE };
const behandlingStatusFVED = behandlingStatusCodes.FATTER_VEDTAK;
const stadfesteKlage = { klageVurdering: klageVurderingCodes.STADFESTE_YTELSESVEDTAK };

const arbeidsforholdHandlingTyper = [
  { kode: 'BRUK', navn: 'aaa', kodeverk: '' },
  { kode: 'NYTT_ARBEIDSFORHOLD', navn: 'bbb', kodeverk: '' },
  { kode: 'BRUK_UTEN_INNTEKTSMELDING', navn: 'ccc', kodeverk: '' },
  { kode: 'IKKE_BRUK', navn: 'ddd', kodeverk: '' },
  { kode: 'SLÅTT_SAMMEN_MED_ANNET', navn: 'eee', kodeverk: '' },
  { kode: 'BASERT_PÅ_INNTEKTSMELDING', navn: 'fff', kodeverk: '' },
];

describe('aksjonspunktTekstUtleder', () => {
  it('skal vise korrekt tekst for aksjonspunkt 6004', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Adopsjon.VilkarOverstyrt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 6003', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Fødsel.VilkarOverstyrt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5038', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Beregning.InntektFastsatt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5042', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Beregning.InntektFastsatt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 6007', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.OVERSTYR_BEREGNING,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Beregning.VilkarOverstyrt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5047', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Beregning.InntektFastsatt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 6006', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Soknadsfrist.VilkarOverstyrt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5021', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Medlemskap.VurderGyldigMedlemskap']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5019', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Medlemskap.AvklarLovligOpphold']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5020', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Medlemskap.VurderSokerBosatt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5023', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Medlemskap.AvklarOppholdsrett']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 6005', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Medlemskap.VilkarOverstyrt']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5039 varig endring', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [{ fastsattVarigEndring: true, skjæringstidspunkt: dato }],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(`Det er fastsatt varig endret/nyoppstartet næring fom ${dato}.`));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5039 ikkje varig endring', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [{ fastsattVarigEndring: false, skjæringstidspunkt: dato }],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(`Det er fastsatt at det ikke er varig endring i næring fom ${dato}.`));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5080 når søker er i permisjon, skal kun vise tekst om permisjon', () => {
    const arbeidforholdDto = {
      arbeidsforholdHandlingType: arbeidsforholdHandlingType.BRUK,
      brukPermisjon: true,
    } as TotrinnskontrollArbeidsforhold;
    const messages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);

    renderWithIntl(messages, { messages: intlMessages });
    expect(screen.getByText('Søker er i permisjon.'));
    expect(messages).toHaveLength(1);
  });

  it('skal vise korrekt tekst for aksjonspunkt 5080 når søker ikke er i permisjon, skal ikke vise tekst for bruk', () => {
    const arbeidforholdDto = {
      arbeidsforholdHandlingType: arbeidsforholdHandlingType.BRUK,
      brukPermisjon: false,
    } as TotrinnskontrollArbeidsforhold;
    const messages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);

    renderWithIntl(messages, { messages: intlMessages });
    expect(screen.getByText('Søker er ikke i permisjon.'));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5080 når søker ikke er i permisjon sammen med en annen handling som ikke er bruk', () => {
    const arbeidforholdDto = {
      arbeidsforholdHandlingType: arbeidsforholdHandlingType.BRUK_UTEN_INNTEKTSMELDING,
      brukPermisjon: false,
    } as TotrinnskontrollArbeidsforhold;
    const messages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);

    renderWithIntl(messages, { messages: intlMessages });
    expect(messages).toHaveLength(2);
    expect(screen.getByText('Søker er ikke i permisjon.'));
    expect(screen.getByText('ccc.'));
  });

  // Klage
  // Klage medhold
  it('skal vise korrekt tekst for aksjonspunkt 5035 medhold', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: medholdIKlage,
    } as KlageVurdering;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.OmgjortTilGunst']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5036 medhold', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: medholdIKlage,
    } as KlageVurdering;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.OmgjortTilGunst']));
  });

  // Klage avslag
  // Ytelsesvedtak opphevet
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: oppheveYtelsesVedtak,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.OppheveYtelsesVedtak']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: oppheveYtelsesVedtak,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.OppheveYtelsesVedtak']));
  });

  // Klage avvist
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: avvistKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message, { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.Avvist']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: avvistKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.Avvist']));
  });

  // Ikke fastsatt Engangsstønad
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ikke fastsatt', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: stadfesteKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.StadfesteYtelsesVedtak']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak stadfestet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: stadfesteKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(klagebehandlingVurdering, behandlingStatusFVED, [], false, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(intlMessages['ToTrinnsForm.Klage.StadfesteYtelsesVedtak']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5058 vurder tidsbegrenset', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD],
      skjæringstidspunkt: dato,
    };
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [beregningDto],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });
    expect(screen.getByText(`Vurderinger av beregningsgrunnlag med skjæringstidspunkt ${dato}.`));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5058 ATFL i samme org', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
      skjæringstidspunkt: dato,
    };
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [beregningDto],
    } as TotrinnskontrollAksjonspunkt;

    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);
    renderWithIntl(message[0], { messages: intlMessages });

    expect(screen.getByText(`Vurderinger av beregningsgrunnlag med skjæringstidspunkt ${dato}.`));
    expect(screen.getByText(`Inntekt er fastsatt for arbeidstaker/frilanser i samme organisajon.`));
  });

  it('skal vise korrekte tekster for kombinasjon av aksjonspunkt 5058', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD],
      skjæringstidspunkt: dato,
    };
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [beregningDto],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(null, null, null, null, aksjonspunkt);

    renderWithIntl(message[0], { messages: intlMessages });

    expect(screen.getByText(intlMessages['ToTrinnsForm.Beregning.VurderTidsbegrensetArbeidsforhold']));
  });

  it('skal vise korrekt tekst for aksjonspunkt 5080', () => {
    const arbeidsforholdDtos = [
      {
        navn: 'COLOR LINE CREW AS',
        organisasjonsnummer: '973135678',
        arbeidsforholdId: 'e3602f7b-bf36-40d4-8e3a-22333daf664b',
        arbeidsforholdHandlingType: 'BRUK_UTEN_INNTEKTSMELDING',
      },
      {
        navn: 'SESAM AS',
        organisasjonsnummer: '976037286',
        arbeidsforholdId: null,
        arbeidsforholdHandlingType: 'IKKE_BRUK',
      },
    ];

    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      totrinnskontrollGodkjent: false,
      arbeidsforholdDtos,
    } as TotrinnskontrollAksjonspunkt;

    const messages = getAksjonspunkttekst(null, null, [], false, aksjonspunkt);

    renderWithIntl(messages, { messages: intlMessages });
    expect(screen.getByText(`Arbeidsforhold hos COLOR LINE CREW AS(973135678)...664b`));
    expect(screen.getByText(`Arbeidsforhold hos SESAM AS(976037286)`));
  });
});
