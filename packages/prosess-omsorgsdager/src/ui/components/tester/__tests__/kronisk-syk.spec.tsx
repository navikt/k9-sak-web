import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { qFeatureToggles } from '@k9-sak-web/gui/featuretoggles/k9/featureToggles.js';
import { VilkarKroniskSyktBarnProps } from '../../../../types/VilkarKroniskSyktBarnProps';
import VilkarKroniskSyktBarn, { AvslagskoderKroniskSyk } from '../../vilkar-kronisk-sykt-barn/VilkarKroniskSyktBarn';
import { KroniskSyktBarnDatoContext } from '../../vilkar-kronisk-sykt-barn/KroniskSyktBarnDatoContext';
import FormStateTilTest from '../dataTilTest/FormStateTilTest';
import './axe-setup';

const personopplysninger = {
  navBrukerKjonn: { kode: 'K', kodeverk: 'KJONN' },
  statsborgerskap: { kode: 'NOR', kodeverk: 'LAND', navn: 'Norge' },
  avklartPersonstatus: {
    orginalPersonstatus: { kode: 'BOSA', kodeverk: 'PERSONSTATUS' },
    overstyrtPersonstatus: { kode: 'BOSA', kodeverk: 'PERSONSTATUS' },
  },
  personstatus: { kode: 'BOSA', kodeverk: 'PERSONSTATUS' },
  diskresjonskode: { kode: 'U', kodeverk: 'DISKRESJONSKODE' },
  sivilstand: { kode: 'UG', kodeverk: 'SIVILSTAND' },
  navn: 'Ola Nordmann',
  adresser: [],
  region: { kode: '03', kodeverk: 'REGION' },
};

describe('<VilkarKroniskSyktBarn>', () => {
  const innvilgedePerioder = [
    { fom: '2025-12-01', tom: '2025-12-31' },
    { fom: '2026-01-10', tom: '2026-12-31' },
  ];
  const overlappFeil = 'Perioden overlapper et tidligere innvilget vedtak.';
  const bekreft = () => userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));

  const lagPropsMedDato = (fraDato: string, tilDato = ''): VilkarKroniskSyktBarnProps => ({
    behandlingsID: '123',
    lesemodus: false,
    aksjonspunktLost: true,
    soknadsdato: '2025-04-06',
    begrunnelseFraBruker: '',
    informasjonTilLesemodus: {
      begrunnelse: 'Barnet oppfyller vilkåret',
      vilkarOppfylt: true,
      avslagsårsakKode: '',
      fraDato,
      tilDato,
      erTidsbegrenset: tilDato !== '',
    },
    losAksjonspunkt: vi.fn(),
    vedtakFattetVilkarOppfylt: false,
    formState: { getState: vi.fn(), setState: vi.fn(), deleteState: vi.fn() },
    personopplysninger,
  });

  const renderMedDato = (
    props: VilkarKroniskSyktBarnProps,
    datoer: { innvilgedePerioder: typeof innvilgedePerioder; foreslåttFraDato?: string } = {
      innvilgedePerioder,
      foreslåttFraDato: '2027-01-01',
    },
  ) =>
    render(
      <FeatureTogglesContext.Provider value={qFeatureToggles}>
        <KroniskSyktBarnDatoContext.Provider value={datoer}>
          <VilkarKroniskSyktBarn {...props} />
        </KroniskSyktBarnDatoContext.Provider>
      </FeatureTogglesContext.Provider>,
    );

  test('avviser manuelt skrevet dato som gir overlapp', async () => {
    const props = lagPropsMedDato('2027-01-01');
    renderMedDato(props);

    const datofelt = screen.getByRole('textbox', { name: '' });
    await userEvent.clear(datofelt);
    await userEvent.type(datofelt, '01.01.2026');

    expect(datofelt).toHaveValue('01.01.2026');
    await bekreft();
    expect(await screen.findByText(overlappFeil)).toBeInTheDocument();
    expect(props.losAksjonspunkt).not.toHaveBeenCalled();
  });

  test('sperrer kalenderdatoer i innvilgede perioder', async () => {
    const props = lagPropsMedDato('2026-01-21');
    renderMedDato(props);

    await userEvent.click(screen.getByRole('button', { name: /åpne datovelger/i }));

    expect(screen.getByRole('button', { name: 'lørdag 10' })).toBeDisabled();
  });

  test('foreslår dagen etter siste innvilgede periode for et nytt skjema', async () => {
    const props = lagPropsMedDato('');
    props.informasjonTilLesemodus = {
      begrunnelse: '',
      vilkarOppfylt: false,
      avslagsårsakKode: '',
      fraDato: '',
      tilDato: '',
      erTidsbegrenset: false,
    };
    renderMedDato(props);
    await userEvent.click(screen.getByRole('radio', { name: 'Ja' }));

    expect(screen.getByRole('textbox', { name: '' })).toHaveValue('01.01.2027');
  });

  test('VilkarKroniskSyktBarn viser åpen aksjonspunkt som forventet', () => {
    const props = {
      behandlingsID: '123',
      lesemodus: false,
      aksjonspunktLost: false,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: '',
        vilkarOppfylt: false,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    render(<VilkarKroniskSyktBarn {...props} />);

    const aksjonspunkt =
      'Se på vedlagt legeerklæring og vurder om barnet har en kronisk eller langvarig sykdom, eller en funksjonshemming. Vurder også om det er en markert økt risiko for fravær. Langvarig syk gjelder fra 1.1.2023.';
    const begrunnelseText = 'Vurdering';
    const vilkarOppfyltText =
      'Er det dokumentert at barnet har en kronisk eller langvarig sykdom, eller en funksjonshemming, som gir markert økt risiko for fravær?';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetBegrunnelseText = screen.getByText(begrunnelseText);
    expect(hentetBegrunnelseText).toBeInTheDocument();

    const hentetVilkarOppfyltText = screen.getByText(vilkarOppfyltText);
    expect(hentetVilkarOppfyltText).toBeInTheDocument();
  });

  test('VilkarKroniskSyktBarn viser åpen aksjonspunkt med informasjon fra tidigare lost vilkar (kommer tillbake etter totrinnskontroll)', () => {
    const props = {
      behandlingsID: '123',
      lesemodus: false,
      aksjonspunktLost: false,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    render(<VilkarKroniskSyktBarn {...props} />);

    const hentetBegrunnelseInputText = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelseInputText).toBeInTheDocument();
  });

  test('VilkarKroniskSyktBarn viser lesemodus med vilkar oppfylt', () => {
    const props = {
      behandlingsID: '123',
      lesemodus: true,
      aksjonspunktLost: false,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: true,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    render(<VilkarKroniskSyktBarn {...props} />);

    const aksjonspunkt =
      'Se på vedlagt legeerklæring og vurder om barnet har en kronisk eller langvarig sykdom, eller en funksjonshemming. Vurder også om det er en markert økt risiko for fravær. Langvarig syk gjelder fra 1.1.2023.';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetSoknadsdatoTekst = screen.getByText('Søknadsdato');
    expect(hentetSoknadsdatoTekst).toBeInTheDocument();

    const hentetSoknadsdato = screen.getAllByText('06.04.2021');
    expect(hentetSoknadsdato).toHaveLength(2);

    const hentetInformasjonOmVilkarTekst = screen.getByText('Fra hvilken dato er vedtaket gyldig?');
    expect(hentetInformasjonOmVilkarTekst).toBeInTheDocument();

    const hentetBehandletAksjonspunktTekst = screen.getByText('Behandlet aksjonspunkt:');
    expect(hentetBehandletAksjonspunktTekst).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText(props.informasjonTilLesemodus.vilkarOppfylt ? 'Ja' : 'Nei');
    expect(hentetVilkarOppfylt).toBeInTheDocument();
  });

  test('VilkarKroniskSyktBarn viser lesemodus med avslagsårsak', () => {
    const props = {
      behandlingsID: '123',
      lesemodus: true,
      aksjonspunktLost: false,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_OKT_RISIKO_FRA_FRAVAER,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    render(<VilkarKroniskSyktBarn {...props} />);

    const hentetInformasjonOmVilkarTekst = screen.getByText('Årsak');
    expect(hentetInformasjonOmVilkarTekst).toBeInTheDocument();

    const hentetInformasjonOmVilkår = screen.getByText('Det er ikke økt risiko for fravær fra arbeid');
    expect(hentetInformasjonOmVilkår).toBeInTheDocument();
  });

  test('VilkarKroniskSyktBarn viser lesemodus med redigering', () => {
    const props = {
      behandlingsID: '123',
      lesemodus: true,
      aksjonspunktLost: true,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    render(<VilkarKroniskSyktBarn {...props} />);

    const hentetRedigerVurderingTekst = screen.getByText('Rediger vurdering');
    expect(hentetRedigerVurderingTekst).toBeInTheDocument();
  });

  test('VilkarKroniskSyktBarn viser informasjon om vilkar etter fattet vedtak', () => {
    const props = {
      behandlingsID: '123',
      lesemodus: false,
      aksjonspunktLost: false,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    render(<VilkarKroniskSyktBarn {...props} />);

    const hentetNavnPåAksjonspunkt = screen.getByText(props.informasjonOmVilkar.navnPåAksjonspunkt);
    expect(hentetNavnPåAksjonspunkt).toBeInTheDocument();

    const hentetVilkar = screen.getByText(props.informasjonOmVilkar.vilkar);
    expect(hentetVilkar).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonOmVilkar.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText('Vilkåret er oppfylt');
    expect(hentetVilkarOppfylt).toBeInTheDocument();
  });

  test('VilkarKroniskSyktBarn viser informasjon om vilkar ikke oppfylt etter fattet vedtak', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    render(<VilkarKroniskSyktBarn {...props} />);

    const hentetVilkar = screen.getByText(props.informasjonOmVilkar.vilkar);
    expect(hentetVilkar).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonOmVilkar.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText('Vilkåret er ikke oppfylt');
    expect(hentetVilkarOppfylt).toBeInTheDocument();
  });

  test('Den har ingen a11y violations', async () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      soknadsdato: '2021-04-06',
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        avslagsårsakKode: AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET,
        fraDato: '2021-04-06',
      },
      losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) =>
        console.log(endreHarDokumentasjonOgFravaerRisiko, begrunnelse),
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      formState: FormStateTilTest,
      personopplysninger,
    } as VilkarKroniskSyktBarnProps;

    const { container } = render(<VilkarKroniskSyktBarn {...props} />);

    const a11yResults = await axe(container);
    // @ts-expect-error vitest-axe doesn't work with vitest v1
    expect(a11yResults).toHaveNoViolations();
  });
});
