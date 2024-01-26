import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { VilkarMidlertidigAleneProps } from '../../../../types/VilkarMidlertidigAleneProps';
import VilkarMidlertidigAlene from '../../vilkar-midlertidig-alene/VilkarMidlertidigAlene';
import FormStateTilTest from '../dataTilTest/FormStateTilTest';

describe('<VilkarMidlertidigAlene>', () => {
  test('VilkarMidlertidigAlene viser åpen aksjonspunkt som forventet', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-10-20',
      },
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: '',
        vilkarOppfylt: true,
        dato: {
          fra: '',
          til: '',
        },
        avslagsArsakErPeriodeErIkkeOverSeksMån: false,
      },
      losAksjonspunkt: () => {
        console.log('losAksjonspunkt midlertidig alene');
      },
      formState: FormStateTilTest,
    } as VilkarMidlertidigAleneProps;

    render(<VilkarMidlertidigAlene {...props} />);

    const aksjonspunkt = 'Vurder om vilkår for midlertidig alene er oppfylt.';
    const oppgittÅrsakText = 'Oppgitt årsak';
    const oppgittPeriodeText = 'Oppgitt periode';

    const begrunnelseText = 'Vurder om vilkåret for midlertidig alene er oppfylt';
    const vilkarOppfyltText = 'Er vilkåret om midlertidig alene oppfylt?';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetOppgittÅrsakText = screen.getByText(oppgittÅrsakText);
    expect(hentetOppgittÅrsakText).toBeInTheDocument();

    const hentetOppgittPeriodeText = screen.getByText(oppgittPeriodeText);
    expect(hentetOppgittPeriodeText).toBeInTheDocument();

    const hentetBegrunnelseText = screen.getByText(begrunnelseText);
    expect(hentetBegrunnelseText).toBeInTheDocument();

    const hentetVilkarOppfyltText = screen.getByText(vilkarOppfyltText);
    expect(hentetVilkarOppfyltText).toBeInTheDocument();
  });

  test('VilkarMidlertidigAlene viser åpen aksjonspunkt med informasjon fra tidigare lost vilkar (kommer tillbake etter totrinnskontroll)', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-10-20',
      },
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        dato: {
          fra: '22.03.1993',
          til: '22.12.1994',
        },
        avslagsArsakErPeriodeErIkkeOverSeksMån: false,
      },
      losAksjonspunkt: () => {
        console.log('losAksjonspunkt midlertidig alene');
      },
      formState: FormStateTilTest,
    } as VilkarMidlertidigAleneProps;

    render(<VilkarMidlertidigAlene {...props} />);

    const hentetBegrunnelseInputText = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelseInputText).toBeInTheDocument();

    const hentetFraDato = screen.getByDisplayValue(props.informasjonTilLesemodus.dato.fra);
    expect(hentetFraDato).toBeDefined();

    const hentetTilDato = screen.getByDisplayValue(props.informasjonTilLesemodus.dato.til);
    expect(hentetTilDato).toBeDefined();
  });

  test('VilkarMidlertidigAlene viser lesemodus', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: true,
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-10-20',
      },
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        dato: {
          fra: '1993.03.22',
          til: '1994.12.22',
        },
        avslagsArsakErPeriodeErIkkeOverSeksMån: false,
      },
      losAksjonspunkt: () => {
        console.log('losAksjonspunkt midlertidig alene');
      },
      formState: FormStateTilTest,
    } as VilkarMidlertidigAleneProps;

    render(<VilkarMidlertidigAlene {...props} />);

    const aksjonspunkt = 'Vurder om vilkår for midlertidig alene er oppfylt.';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetÅrsak = screen.getByText(props.soknadsopplysninger.årsak);
    expect(hentetÅrsak).toBeInTheDocument();

    const hentetPeriode = screen.getByText(props.soknadsopplysninger.periode);
    expect(hentetPeriode).toBeInTheDocument();

    const hentetBegrunnelseTekst = screen.getByText('Vurdering');
    expect(hentetBegrunnelseTekst).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText(props.informasjonTilLesemodus.vilkarOppfylt ? 'Ja' : 'Nei');
    expect(hentetVilkarOppfylt).toBeInTheDocument();

    const hentetDato = screen.getByText('22.03.1993 - 22.12.1994');
    expect(hentetDato).toBeInTheDocument();
  });

  test('VilkarMidlertidigAlene viser redigerbart lesemodus', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: true,
      lesemodus: true,
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-10-20',
      },
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        dato: {
          fra: '1993.03.22',
          til: '1994.12.22',
        },
        avslagsArsakErPeriodeErIkkeOverSeksMån: false,
      },
      losAksjonspunkt: () => {
        console.log('losAksjonspunkt midlertidig alene');
      },
      formState: FormStateTilTest,
    } as VilkarMidlertidigAleneProps;

    render(<VilkarMidlertidigAlene {...props} />);

    const hentetRedigerVurderingTekst = screen.getByText('Rediger vurdering');
    expect(hentetRedigerVurderingTekst).toBeInTheDocument();
  });

  test('VilkarMidlertidigAlene viser informasjon om vilkar etter fattet vedtak', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-10-20',
      },
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        dato: {
          fra: '22.03.1993',
          til: '22.12.1994',
        },
        avslagsArsakErPeriodeErIkkeOverSeksMån: false,
      },
      losAksjonspunkt: () => {
        console.log('losAksjonspunkt midlertidig alene');
      },
      formState: FormStateTilTest,
    } as VilkarMidlertidigAleneProps;

    render(<VilkarMidlertidigAlene {...props} />);

    const hentetNavnPåAksjonspunkt = screen.getByText(props.informasjonOmVilkar.navnPåAksjonspunkt);
    expect(hentetNavnPåAksjonspunkt).toBeInTheDocument();

    const hentetVilkar = screen.getByText(props.informasjonOmVilkar.vilkar);
    expect(hentetVilkar).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonOmVilkar.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText('Vilkåret er oppfylt');
    expect(hentetVilkarOppfylt).toBeInTheDocument();
  });

  test('VilkarMidlertidigAlene viser informasjon om vilkar ikke oppfylt etter fattet vedtak', () => {
    const props = {
      behandlingsID: '123',
      aksjonspunktLost: false,
      lesemodus: false,
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-10-20',
      },
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        dato: {
          fra: '22.03.1993',
          til: '22.12.1994',
        },
        avslagsArsakErPeriodeErIkkeOverSeksMån: false,
      },
      losAksjonspunkt: () => {
        console.log('losAksjonspunkt midlertidig alene');
      },
      formState: FormStateTilTest,
    } as VilkarMidlertidigAleneProps;

    render(<VilkarMidlertidigAlene {...props} />);

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
      soknadsopplysninger: {
        årsak: 'Årsak',
        beskrivelse: 'Beskrivelse',
        periode: 'DD.MM.ÅÅÅÅ - DD.MM.ÅÅÅÅ',
        soknadsdato: '2021-10-20',
      },
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse',
        vilkarOppfylt: true,
        dato: {
          fra: '22.03.1993',
          til: '22.12.1994',
        },
        avslagsArsakErPeriodeErIkkeOverSeksMån: false,
      },
      losAksjonspunkt: () => {
        console.log('losAksjonspunkt midlertidig alene');
      },
      formState: FormStateTilTest,
    } as VilkarMidlertidigAleneProps;

    const { container } = render(<VilkarMidlertidigAlene {...props} />);

    const a11yResults = await axe(container);
    // @ts-expect-error vitest-axe doesn't work with vitest v1
    expect(a11yResults).toHaveNoViolations();
  });
});
