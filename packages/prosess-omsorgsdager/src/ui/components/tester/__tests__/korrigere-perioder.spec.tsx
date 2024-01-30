import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { KorrigerePerioderProps } from '../../../../types/KorrigerePerioderProps';
import KorrigerePerioder from '../../korrigere-perioder/KorrigerePerioder';
import FormStateTilTest from '../dataTilTest/FormStateTilTest';

describe('<KorrigerePerioder>', () => {
  test('KorrigerePerioder viser åpen aksjonspunkt som forventet', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: '',
        vilkarOppfylt: false,
        antallDagerDelvisInnvilget: null,
      },
      losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) =>
        console.log(fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse),
      konfliktMedArbeidsgiver: false,
      formState: FormStateTilTest,
    } as KorrigerePerioderProps;

    render(<KorrigerePerioder {...props} />);

    const aksjonspunkt = 'Vurder om søker har rett til å få utbetalt dager.';
    const begrunnelseTekst = 'Har søker rett på å få utbetalt dager?';
    const vilkarOppfyltTekst = 'Har søker rett på å få utbetalt dager?';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetBegrunnelseText = screen.getByText(begrunnelseTekst);
    expect(hentetBegrunnelseText).toBeInTheDocument();

    const hentetVilkarOppfyltText = screen.getByText(vilkarOppfyltTekst);
    expect(hentetVilkarOppfyltText).toBeInTheDocument();

    const delvisInnvilget = screen.getByDisplayValue('delvis');
    fireEvent.click(delvisInnvilget);

    const hentetHvorMangeDagerTekst = screen.getByText('Hvor mange dager har søker rett på?');
    expect(hentetHvorMangeDagerTekst).toBeInTheDocument();
  });

  test('KorrigerePerioder viser åpen aksjonspunkt med informasjon fra tidigare lost vilkar (kommer tillbake etter totrinnskontroll)', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        antallDagerDelvisInnvilget: null,
      },
      losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) =>
        console.log(fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse),
      konfliktMedArbeidsgiver: false,
      formState: FormStateTilTest,
    } as KorrigerePerioderProps;

    render(<KorrigerePerioder {...props} />);

    const hentetBegrunnelseInputText = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelseInputText).toBeInTheDocument();
  });

  test('KorrigerePerioder viser lesemodus med delvis innvilget', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: true,
        antallDagerDelvisInnvilget: 10,
      },
      losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) =>
        console.log(fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse),
      konfliktMedArbeidsgiver: false,
      formState: FormStateTilTest,
    } as KorrigerePerioderProps;
    render(<KorrigerePerioder {...props} />);

    const aksjonspunkt = 'Har søker rett på å få utbetalt dager?';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetBehandletAksjonspunktTekst = screen.getByText('Behandlet aksjonspunkt:');
    expect(hentetBehandletAksjonspunktTekst).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText('Delvis');
    expect(hentetVilkarOppfylt).toBeInTheDocument();

    const hentetAntallDager = screen.getByText(props.informasjonTilLesemodus.antallDagerDelvisInnvilget.toString());
    expect(hentetAntallDager).toBeInTheDocument();

    const hentetAntallDagerTekst = screen.getByText('Antall dager innvilget');
    expect(hentetAntallDagerTekst).toBeInTheDocument();
  });

  test('KorrigerePerioder viser lesemodus', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        antallDagerDelvisInnvilget: null,
      },
      losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) =>
        console.log(fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse),
      konfliktMedArbeidsgiver: false,
      formState: FormStateTilTest,
    } as KorrigerePerioderProps;
    render(<KorrigerePerioder {...props} />);

    const aksjonspunkt = 'Har søker rett på å få utbetalt dager?';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetBehandletAksjonspunktTekst = screen.getByText('Behandlet aksjonspunkt:');
    expect(hentetBehandletAksjonspunktTekst).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText(props.informasjonTilLesemodus.vilkarOppfylt ? 'Ja' : 'Nei');
    expect(hentetVilkarOppfylt).toBeInTheDocument();
  });

  test('KorrigerePerioder viser lesemodus med redigering', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: true,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        antallDagerDelvisInnvilget: null,
      },
      losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) =>
        console.log(fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse),
      konfliktMedArbeidsgiver: false,
      formState: FormStateTilTest,
    } as KorrigerePerioderProps;
    render(<KorrigerePerioder {...props} />);

    const hentetRedigerVurderingTekst = screen.getByText('Rediger vurdering');
    expect(hentetRedigerVurderingTekst).toBeInTheDocument();
  });

  test('Den har ingen a11y violations', async () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
        antallDagerDelvisInnvilget: null,
      },
      losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) =>
        console.log(fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse),
      konfliktMedArbeidsgiver: false,
      formState: FormStateTilTest,
    } as KorrigerePerioderProps;

    const { container } = render(<KorrigerePerioder {...props} />);

    const a11yResults = await axe(container);
    // @ts-expect-error vitest-axe doesn't work with vitest v1
    expect(a11yResults).toHaveNoViolations();
  });
});
