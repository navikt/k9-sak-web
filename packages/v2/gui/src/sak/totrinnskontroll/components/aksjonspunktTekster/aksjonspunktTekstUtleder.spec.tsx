import { klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as KlageAksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { Klagevurdering } from '@k9-sak-web/backend/k9klage/kodeverk/Klagevurdering.js';
import { KlagevurderingOmgjør } from '@k9-sak-web/backend/k9klage/kodeverk/KlagevurderingOmgjør.js';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_BehandlingStatus as BehandlingStatus,
  folketrygdloven_kalkulus_kodeverk_FaktaOmBeregningTilfelle as FaktaOmBeregningTilfeller,
  k9_kodeverk_arbeidsforhold_ArbeidsforholdHandlingType as ArbeidsforholdHandlingType,
} from '@navikt/k9-sak-typescript-client';
import { render, screen } from '@testing-library/react';
import { type TotrinnskontrollAksjonspunkt } from '../../types/TotrinnskontrollAksjonspunkt';
import getAksjonspunkttekst, { getFaktaOmArbeidsforholdMessages } from './aksjonspunktTekstUtleder';

const medholdIKlage = {
  klageVurdering: Klagevurdering.MEDHOLD_I_KLAGE,
  klageVurderingOmgjoer: KlagevurderingOmgjør.GUNST_MEDHOLD_I_KLAGE,
};
const oppheveYtelsesVedtak = { klageVurdering: Klagevurdering.OPPHEVE_YTELSESVEDTAK };
const avvistKlage = { klageVurdering: Klagevurdering.AVVIS_KLAGE };
const behandlingStatusFVED = BehandlingStatus.FATTER_VEDTAK;
const stadfesteKlage = { klageVurdering: Klagevurdering.STADFESTE_YTELSESVEDTAK };

const arbeidsforholdHandlingTyper = [
  { kode: 'BRUK', navn: 'aaa', kodeverk: '' },
  { kode: 'NYTT_ARBEIDSFORHOLD', navn: 'bbb', kodeverk: '' },
  { kode: 'BRUK_UTEN_INNTEKTSMELDING', navn: 'ccc', kodeverk: '' },
  { kode: 'IKKE_BRUK', navn: 'ddd', kodeverk: '' },
  { kode: 'SLÅTT_SAMMEN_MED_ANNET', navn: 'eee', kodeverk: '' },
  { kode: 'BASERT_PÅ_INNTEKTSMELDING', navn: 'fff', kodeverk: '' },
];

const fakeAksjonspunkt: (a: Partial<TotrinnskontrollAksjonspunkt>) => TotrinnskontrollAksjonspunkt = a => {
  return {
    aksjonspunktKode: '',
    arbeidsforholdDtos: undefined,
    beregningDtoer: undefined,
    besluttersBegrunnelse: 'begrunnelse',
    totrinnskontrollGodkjent: false,
    vurderPaNyttArsaker: undefined,
    ...a,
  };
};

describe('aksjonspunktTekstUtleder', () => {
  it('skal vise korrekt tekst for aksjonspunkt 6004', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.OVERSTYRING_AV_MEDISINSKESVILKÅRET_UNDER_18,
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Vilkåret sykdom er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 6003', () => {
    const aksjonspunkt = fakeAksjonspunkt({ aksjonspunktKode: AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Vilkåret omsorgen for er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5038', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Inntekt er skjønnsmessig fastsatt.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5042', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_SELVSTENDIG_NÆRINGSDRIVENDE,
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Inntekt er skjønnsmessig fastsatt.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 6007', () => {
    const aksjonspunkt = fakeAksjonspunkt({ aksjonspunktKode: AksjonspunktDefinisjon.OVERSTYRING_AV_BEREGNING });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Beregningsvilkåret er overstyrt.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5047', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Inntekt er skjønnsmessig fastsatt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 6006', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Søknadsfristvilkåret er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5021', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker har gyldig medlemskap i perioden.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5019', () => {
    const aksjonspunkt = fakeAksjonspunkt({ aksjonspunktKode: AksjonspunktDefinisjon.AVKLAR_LOVLIG_OPPHOLD });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker har lovlig opphold.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5020', () => {
    const aksjonspunkt = fakeAksjonspunkt({ aksjonspunktKode: AksjonspunktDefinisjon.AVKLAR_OM_ER_BOSATT });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker er bosatt i Norge.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5023', () => {
    const aksjonspunkt = fakeAksjonspunkt({ aksjonspunktKode: AksjonspunktDefinisjon.AVKLAR_OPPHOLDSRETT });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker har oppholdsrett.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 6005', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET,
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Medlemskapsvilkåret er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5039 varig endring', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode:
        AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NÆRING_SELVSTENDIG_NÆRINGSDRIVENDE,
      beregningDtoer: [{ fastsattVarigEndring: true, skjæringstidspunkt: '2022-01-01' }],
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er fastsatt varig endret/nyoppstartet næring fom 2022-01-01.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5039 ikkje varig endring', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode:
        AksjonspunktDefinisjon.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NÆRING_SELVSTENDIG_NÆRINGSDRIVENDE,
      beregningDtoer: [{ fastsattVarigEndring: false, skjæringstidspunkt: '2022-01-01' }],
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(
      screen.getByText('Det er fastsatt at det ikke er varig endring i næring fom 2022-01-01.'),
    ).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5080 når søker er i permisjon, skal kun vise tekst om permisjon', () => {
    const arbeidforholdDto = {
      arbeidsforholdHandlingType: ArbeidsforholdHandlingType.BRUK,
      brukPermisjon: true,
      navn: '',
    };
    const messages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);
    expect(messages).toHaveLength(1);
    render(<div>{messages}</div>);
    expect(screen.getByText('Søker er i permisjon.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5080 når søker ikke er i permisjon, skal ikke vise tekst for bruk', () => {
    const arbeidforholdDto = {
      arbeidsforholdHandlingType: ArbeidsforholdHandlingType.BRUK,
      brukPermisjon: false,
      navn: '',
    };
    const messages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);
    expect(messages).toHaveLength(1);
    render(<div>{messages}</div>);
    expect(screen.getByText('Søker er ikke i permisjon.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5080 når søker ikke er i permisjon sammen med en annen handling som ikke er bruk', () => {
    const arbeidforholdDto = {
      arbeidsforholdHandlingType: ArbeidsforholdHandlingType.BRUK_UTEN_INNTEKTSMELDING,
      brukPermisjon: false,
      arbeidsforholdId: '',
      navn: '',
      organisasjonsnummer: '',
    };
    const messages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);
    expect(messages).toHaveLength(2);
    render(<div>{messages}</div>);
    expect(screen.getByText('Søker er ikke i permisjon.')).toBeInTheDocument();
    expect(screen.getByText('ccc.')).toBeInTheDocument();
  });

  // Klage
  // Klage medhold
  it('skal vise korrekt tekst for aksjonspunkt 5035 medhold', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NFP,
    });
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: medholdIKlage,
    };
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Omgjort til gunst')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 medhold', () => {
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NK,
    });
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: medholdIKlage,
    };
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Omgjort til gunst')).toBeInTheDocument();
  });
  // Klage avslag
  // Ytelsesvedtak opphevet
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: oppheveYtelsesVedtak,
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NFP,
    });
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Opphev ytelsesvedtak')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: oppheveYtelsesVedtak,
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NK,
    });
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Opphev ytelsesvedtak')).toBeInTheDocument();
  });
  // Klage avvist
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: avvistKlage,
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NFP,
    });
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Klagen avvist fordi den ikke oppfyller formkravene')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: avvistKlage,
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NK,
    });
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Klagen avvist fordi den ikke oppfyller formkravene')).toBeInTheDocument();
  });
  // Ikke fastsatt Engangsstønad
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ikke fastsatt', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: stadfesteKlage,
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NK,
    });
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Stadfest ytelsesvedtak')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak stadfestet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: stadfesteKlage,
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon.MANUELL_VURDERING_AV_KLAGE_NK,
    });
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Stadfest ytelsesvedtak')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5058 vurder tidsbegrenset', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [FaktaOmBeregningTilfeller.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD],
      skjæringstidspunkt: '2022-01-01',
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_FOR_ATFL_SN,
      beregningDtoer: [beregningDto],
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(
      screen.getByText('Vurderinger av beregningsgrunnlag med skjæringstidspunkt 2022-01-01.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Det er vurdert om arbeidsforhold er tidsbegrenset.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5058 ATFL i samme org', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [FaktaOmBeregningTilfeller.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
      skjæringstidspunkt: '2022-01-01',
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_FOR_ATFL_SN,
      beregningDtoer: [beregningDto],
    });
    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(
      screen.getByText('Vurderinger av beregningsgrunnlag med skjæringstidspunkt 2022-01-01.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Inntekt er fastsatt for arbeidstaker/frilanser i samme organisajon.')).toBeInTheDocument();
  });
  it('skal vise korrekte tekster for kombinasjon av aksjonspunkt 5058', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [FaktaOmBeregningTilfeller.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD],
      skjæringstidspunkt: '2022-01-01',
    };
    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_FOR_ATFL_SN,
      beregningDtoer: [beregningDto],
    });

    const message = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(
      screen.getByText('Vurderinger av beregningsgrunnlag med skjæringstidspunkt 2022-01-01.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Det er vurdert om arbeidsforhold er tidsbegrenset.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5080', () => {
    const arbeidsforholdDtos = [
      {
        navn: 'COLOR LINE CREW AS',
        organisasjonsnummer: '973135678',
        arbeidsforholdId: 'e3602f7b-bf36-40d4-8e3a-22333daf664b',
        arbeidsforholdHandlingType: ArbeidsforholdHandlingType.BRUK_UTEN_INNTEKTSMELDING,
      },
      {
        navn: 'SESAM AS',
        organisasjonsnummer: '976037286',
        arbeidsforholdId: undefined,
        arbeidsforholdHandlingType: ArbeidsforholdHandlingType.IKKE_BRUK,
      },
    ];

    const aksjonspunkt = fakeAksjonspunkt({
      aksjonspunktKode: AksjonspunktDefinisjon.VURDER_ARBEIDSFORHOLD,
      arbeidsforholdDtos,
      beregningDtoer: [],
      vurderPaNyttArsaker: [],
    });

    const messages = getAksjonspunkttekst(BehandlingStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{messages}</div>);
    expect(screen.getByText('Arbeidsforhold hos COLOR LINE CREW AS(973135678)', { exact: false })).toBeInTheDocument();
  });
});
