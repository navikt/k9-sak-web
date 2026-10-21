import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { axe } from 'vitest-axe';
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
      <KroniskSyktBarnDatoContext.Provider value={datoer}>
        <VilkarKroniskSyktBarn {...props} />
      </KroniskSyktBarnDatoContext.Provider>,
    );

  test.each(['2027-01-01', '2028-01-01'])(
    'tillater periode med fra-dato %s etter innvilgede perioder',
    async fraDato => {
      const props = lagPropsMedDato(fraDato);
      renderMedDato(props);

      await bekreft();

      expect(props.losAksjonspunkt).toHaveBeenCalledWith(true, 'Barnet oppfyller vilkåret', '', fraDato, '', false);
    },
  );

  test.each(['2025-11-30', '2025-12-15', '2026-01-01', '2026-12-31'])(
    'avviser overlapp for vedtak uten tidsbegrensning med fra-dato %s',
    async fraDato => {
      const props = lagPropsMedDato(fraDato);
      renderMedDato(props);

      await bekreft();
      expect(await screen.findByText(overlappFeil)).toBeInTheDocument();
      expect(props.losAksjonspunkt).not.toHaveBeenCalled();
    },
  );

  test('tillater manuelt skrevet dato uten overlapp', async () => {
    const props = lagPropsMedDato('2025-12-31');
    renderMedDato(props);

    const datofelt = screen.getByRole('textbox', { name: '' });
    await userEvent.clear(datofelt);
    await userEvent.type(datofelt, '01.01.2027');
    await bekreft();

    expect(props.losAksjonspunkt).toHaveBeenCalledWith(true, 'Barnet oppfyller vilkåret', '', '2027-01-01', '', false);
  });

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

  test('sperrer bare kalenderdatoer i innvilgede perioder', async () => {
    const props = lagPropsMedDato('2026-01-21');
    renderMedDato(props);

    await userEvent.click(screen.getByRole('button', { name: /åpne datovelger/i }));

    expect(screen.getByRole('button', { name: 'torsdag 1' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'fredag 9' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'lørdag 10' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'torsdag 15' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'tirsdag 20' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'onsdag 21' })).toBeDisabled();
  });

  test.each([
    ['01-01', '06-01', '12-31'],
    ['06-15', '06-01', '12-31'],
    ['12-31', '06-01', '12-31'],
    ['12-31', '12-31', '12-31'],
    ['01-01', '12-31', '12-31'],
  ])('avviser tidsbegrenset periode med fra-dato %s som overlapper %s–%s', async (fom, tidligereFom, tidligereTom) => {
    const år = dayjs().year();
    const props = lagPropsMedDato(`${år}-${fom}`, `${år}-12-31`);
    renderMedDato(props, {
      innvilgedePerioder: [{ fom: `${år}-${tidligereFom}`, tom: `${år}-${tidligereTom}` }],
    });

    await bekreft();
    expect(await screen.findByText(overlappFeil)).toBeInTheDocument();
    expect(props.losAksjonspunkt).not.toHaveBeenCalled();
  });

  test('tillater en tidsbegrenset periode mellom innvilgede perioder', async () => {
    const år = dayjs().year();
    const props = lagPropsMedDato(`${år}-01-01`, `${år}-12-31`);
    renderMedDato(props, {
      innvilgedePerioder: [
        { fom: `${år - 1}-01-01`, tom: `${år - 1}-12-31` },
        { fom: `${år + 1}-01-01`, tom: `${år + 1}-12-31` },
      ],
    });

    await bekreft();

    expect(props.losAksjonspunkt).toHaveBeenCalledWith(true, 'Barnet oppfyller vilkåret', '', `${år}-01-01`, `${år}-12-31`, true);
  });

  test('kontrollerer overlapp på nytt når til-dato endres', async () => {
    const år = dayjs().year();
    const props = lagPropsMedDato(`${år}-01-01`, `${år + 1}-12-31`);
    renderMedDato(props, {
      innvilgedePerioder: [{ fom: `${år + 1}-01-01`, tom: `${år + 1}-12-31` }],
    });

    await bekreft();
    expect(await screen.findByText(overlappFeil)).toBeInTheDocument();
    expect(props.losAksjonspunkt).not.toHaveBeenCalled();

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Til' }), `${år}-12-31`);
    expect(screen.queryByText(overlappFeil)).not.toBeInTheDocument();
    await bekreft();

    expect(props.losAksjonspunkt).toHaveBeenCalledWith(true, 'Barnet oppfyller vilkåret', '', `${år}-01-01`, `${år}-12-31`, true);
  });

  test('regner vedtak uten tidsbegrensning som en periode uten sluttdato', async () => {
    const props = lagPropsMedDato('2033-01-01');
    renderMedDato(props, { innvilgedePerioder: [{ fom: '2034-01-01', tom: '2034-12-31' }] });

    await bekreft();
    expect(await screen.findByText(overlappFeil)).toBeInTheDocument();
    expect(props.losAksjonspunkt).not.toHaveBeenCalled();
  });

  test('kontrollerer overlapp når tidsbegrensningen fjernes og gjenopprettes', async () => {
    const år = dayjs().year();
    const props = lagPropsMedDato(`${år}-01-01`, `${år}-12-31`);
    renderMedDato(props, {
      innvilgedePerioder: [{ fom: `${år + 1}-01-01`, tom: `${år + 1}-12-31` }],
    });

    await userEvent.click(screen.getByRole('checkbox', { name: 'Vedtaket er tidsbegrenset' }));
    await bekreft();
    expect(await screen.findByText(overlappFeil)).toBeInTheDocument();
    expect(props.losAksjonspunkt).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Vedtaket er tidsbegrenset' }));
    expect(screen.queryByText(overlappFeil)).not.toBeInTheDocument();
  });

  test('trenger ikke barnets fødselsdato for å kontrollere overlapp', async () => {
    const props = lagPropsMedDato('2027-01-01');
    renderMedDato(props);

    await bekreft();

    expect(props.losAksjonspunkt).toHaveBeenCalled();
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

  test('beholder lagret dato fremfor foreslått dato', () => {
    renderMedDato(lagPropsMedDato('2026-01-05'));

    expect(screen.getByRole('textbox', { name: '' })).toHaveValue('05.01.2026');
  });

  test('begrenser ikke datoer uten tidligere innvilgede perioder', async () => {
    const props = lagPropsMedDato('2025-12-15');
    renderMedDato(props, { innvilgedePerioder: [], foreslåttFraDato: undefined });

    await bekreft();

    expect(props.losAksjonspunkt).toHaveBeenCalledWith(true, 'Barnet oppfyller vilkåret', '', '2025-12-15', '', false);
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
