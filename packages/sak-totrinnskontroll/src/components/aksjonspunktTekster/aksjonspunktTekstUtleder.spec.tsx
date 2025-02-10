import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import klageVurderingOmgjoerCodes from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import { KlageVurdering } from '@k9-sak-web/types';
import { definisjon as KlageAksjonspunktDtoDefinisjon } from '@navikt/k9-klage-typescript-client';
import {
  AksjonspunktDtoDefinisjon,
  BehandlingAksjonspunktDtoBehandlingStatus,
  BehandlingDtoStatus,
  TotrinnsArbeidsforholdDtoArbeidsforholdHandlingType,
} from '@navikt/k9-sak-typescript-client';
import { render, screen } from '@testing-library/react';
import { TotrinnskontrollAksjonspunkt } from '../../types/TotrinnskontrollAksjonspunkt';
import getAksjonspunkttekst, { getFaktaOmArbeidsforholdMessages } from './aksjonspunktTekstUtleder';

const medholdIKlage = {
  klageVurdering: klageVurderingCodes.MEDHOLD_I_KLAGE,
  klageVurderingOmgjoer: klageVurderingOmgjoerCodes.GUNST_MEDHOLD_I_KLAGE,
};
const oppheveYtelsesVedtak = { klageVurdering: klageVurderingCodes.OPPHEVE_YTELSESVEDTAK };
const avvistKlage = { klageVurdering: klageVurderingCodes.AVVIS_KLAGE };
const behandlingStatusFVED = BehandlingAksjonspunktDtoBehandlingStatus.FATTER_VEDTAK;
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
      aksjonspunktKode: AksjonspunktDtoDefinisjon.OVERSTYRING_AV_MEDISINSKESVILKÅRET_UNDER_18,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Adopsjonsvilkåret er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 6003', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Vilkåret omsorgen for er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5038', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Inntekt er skjønnsmessig fastsatt.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5042', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_SELVSTENDIG_NÆRINGSDRIVENDE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Inntekt er skjønnsmessig fastsatt.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 6007', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.OVERSTYRING_AV_BEREGNING,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Beregningsvilkåret er overstyrt.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5047', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Inntekt er skjønnsmessig fastsatt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 6006', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Søknadsfristvilkåret er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5021', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker har gyldig medlemskap i perioden.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5019', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.AVKLAR_LOVLIG_OPPHOLD,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker har lovlig opphold.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5020', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker er bosatt i Norge.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5023', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.AVKLAR_OPPHOLDSRETT,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er vurdert om søker har oppholdsrett.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 6005', () => {
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Medlemskapsvilkåret er overstyrt.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5039 varig endring', () => {
    const aksjonspunkt = {
      aksjonspunktKode:
        AksjonspunktDtoDefinisjon.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NÆRING_SELVSTENDIG_NÆRINGSDRIVENDE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [{ fastsattVarigEndring: true, skjæringstidspunkt: '2022-01-01' }],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(screen.getByText('Det er fastsatt varig endret/nyoppstartet næring fom 2022-01-01.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5039 ikkje varig endring', () => {
    const aksjonspunkt = {
      aksjonspunktKode:
        AksjonspunktDtoDefinisjon.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NÆRING_SELVSTENDIG_NÆRINGSDRIVENDE,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [{ fastsattVarigEndring: false, skjæringstidspunkt: '2022-01-01' }],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(
      screen.getByText('Det er fastsatt at det ikke er varig endring i næring fom 2022-01-01.'),
    ).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5080 når søker er i permisjon, skal kun vise tekst om permisjon', () => {
    const arbeidforholdDto = {
      arbeidsforholdHandlingType: TotrinnsArbeidsforholdDtoArbeidsforholdHandlingType.BRUK,
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
      arbeidsforholdHandlingType: TotrinnsArbeidsforholdDtoArbeidsforholdHandlingType.BRUK,
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
      arbeidsforholdHandlingType: TotrinnsArbeidsforholdDtoArbeidsforholdHandlingType.BRUK_UTEN_INNTEKTSMELDING,
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
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5035,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: medholdIKlage,
    } as KlageVurdering;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Omgjort til gunst')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 medhold', () => {
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5036,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: medholdIKlage,
    } as KlageVurdering;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Omgjort til gunst')).toBeInTheDocument();
  });
  // Klage avslag
  // Ytelsesvedtak opphevet
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: oppheveYtelsesVedtak,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5035,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Opphev ytelsesvedtak')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: oppheveYtelsesVedtak,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5036,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Opphev ytelsesvedtak')).toBeInTheDocument();
  });
  // Klage avvist
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: avvistKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5035,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Klagen avvist fordi den ikke oppfyller formkravene')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: avvistKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5036,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Klagen avvist fordi den ikke oppfyller formkravene')).toBeInTheDocument();
  });
  // Ikke fastsatt Engangsstønad
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ikke fastsatt', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: stadfesteKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5036,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Stadfest ytelsesvedtak')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak stadfestet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: stadfesteKlage,
    } as KlageVurdering;
    const aksjonspunkt = {
      aksjonspunktKode: KlageAksjonspunktDtoDefinisjon._5036,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(behandlingStatusFVED, [], aksjonspunkt, klagebehandlingVurdering);
    render(<div>{message}</div>);
    expect(screen.getByText('Stadfest ytelsesvedtak')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for aksjonspunkt 5058 vurder tidsbegrenset', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD],
      skjæringstidspunkt: '2022-01-01',
    };
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.VURDER_FAKTA_FOR_ATFL_SN,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [beregningDto],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(
      screen.getByText('Vurderinger av beregningsgrunnlag med skjæringstidspunkt 2022-01-01.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Det er vurdert om arbeidsforhold er tidsbegrenset.')).toBeInTheDocument();
  });
  it('skal vise korrekt tekst for aksjonspunkt 5058 ATFL i samme org', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
      skjæringstidspunkt: '2022-01-01',
    };
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.VURDER_FAKTA_FOR_ATFL_SN,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [beregningDto],
    } as TotrinnskontrollAksjonspunkt;
    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{message}</div>);
    expect(
      screen.getByText('Vurderinger av beregningsgrunnlag med skjæringstidspunkt 2022-01-01.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Inntekt er fastsatt for arbeidstaker/frilanser i samme organisajon.')).toBeInTheDocument();
  });
  it('skal vise korrekte tekster for kombinasjon av aksjonspunkt 5058', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD],
      skjæringstidspunkt: '2022-01-01',
    };
    const aksjonspunkt = {
      aksjonspunktKode: AksjonspunktDtoDefinisjon.VURDER_FAKTA_FOR_ATFL_SN,
      besluttersBegrunnelse: 'begrunnelse',
      totrinnskontrollGodkjent: false,
      beregningDtoer: [beregningDto],
    } as TotrinnskontrollAksjonspunkt;

    const message = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
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
      aksjonspunktKode: AksjonspunktDtoDefinisjon.VURDER_ARBEIDSFORHOLD,
      totrinnskontrollGodkjent: false,
      arbeidsforholdDtos,
      beregningDtoer: [],
      vurderPaNyttArsaker: [],
    } as TotrinnskontrollAksjonspunkt;

    const messages = getAksjonspunkttekst(BehandlingDtoStatus.OPPRETTET, [], aksjonspunkt);
    render(<div>{messages}</div>);
    expect(screen.getByText('Arbeidsforhold hos COLOR LINE CREW AS(973135678)', { exact: false })).toBeInTheDocument();
  });
});
