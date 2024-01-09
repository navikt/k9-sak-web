import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import Omsorg from '../../omsorg/Omsorg';
import FormStateTilTest from '../dataTilTest/FormStateTilTest';

describe('<Omsorg>', () => {
  test('Omsorg viser åpen aksjonspunkt for midlertidig alene som forventet', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMS_MA',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: '',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

    const aksjonspunkt = 'Vurder om søkeren og den andre forelderen har minst ett felles barn.';
    const opplysningerFraSoknad = 'Opplysninger fra søknaden:';
    const sokersBarn = props.barn[0];
    const begrunnelse = 'Vurder om søkeren og den andre forelderen har minst ett felles barn';
    const harOmsorg = 'Har søkeren og den andre forelderen minst ett felles barn?';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetOpplysningerFraSoknad = screen.getByText(opplysningerFraSoknad);
    expect(hentetOpplysningerFraSoknad).toBeInTheDocument();

    const hentetSokersBarn = screen.getByText(sokersBarn);
    expect(hentetSokersBarn).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetHarOmsorg = screen.getByText(harOmsorg);
    expect(hentetHarOmsorg).toBeInTheDocument();
  });

  test('Omsorg viser åpen aksjonspunkt med informasjon fra tidigare lost vilkar (kommer tillbake etter totrinnskontroll)', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMS_MA',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

    const hentetBegrunnelseInputText = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelseInputText).toBeInTheDocument();
  });

  test('Omsorg viser åpen aksjonspunkt for kronisk syk som forventet', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMP_KS',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

    const aksjonspunkt = 'Vurder om søkeren har omsorgen for barnet.';
    const opplysningerFraSoknad = 'Opplysninger fra søknaden:';
    const sokersBarn = props.barn[0];
    const begrunnelse = 'Vurder om søker har omsorgen for barnet';
    const harOmsorg = 'Har søker omsorgen for barnet?';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetOpplysningerFraSoknad = screen.getByText(opplysningerFraSoknad);
    expect(hentetOpplysningerFraSoknad).toBeInTheDocument();

    const hentetSokersBarn = screen.getByText(sokersBarn);
    expect(hentetSokersBarn).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetHarOmsorg = screen.getByText(harOmsorg);
    expect(hentetHarOmsorg).toBeInTheDocument();
  });

  test('Omsorg viser lesemodus for midlertidig alene', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMP_MA',
      aksjonspunktLost: false,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

    const aksjonspunkt = 'Vurder om søkeren og den andre forelderen har minst ett felles barn.';
    const behandletAksjonspunkt = 'Behandlet aksjonspunkt:';
    const sokersBarn = props.barn[0];
    const begrunnelse = 'Vurdering';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetSokersBarn = screen.getByText(sokersBarn);
    expect(hentetSokersBarn).toBeInTheDocument();

    const hentetBegrunnelseText = screen.getByText(begrunnelse);
    expect(hentetBegrunnelseText).toBeInTheDocument();

    const hentetBehandletAksjonspunkt = screen.getByText(behandletAksjonspunkt);
    expect(hentetBehandletAksjonspunkt).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText(props.informasjonTilLesemodus.vilkarOppfylt ? 'Ja' : 'Nei');
    expect(hentetVilkarOppfylt).toBeInTheDocument();
  });

  test('Omsorg viser lesemodus for kronisk syk', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMP_KS',
      aksjonspunktLost: false,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

    const aksjonspunkt = 'Vurder om søkeren har omsorgen for barnet.';
    const behandletAksjonspunkt = 'Behandlet aksjonspunkt:';
    const sokersBarn = props.barn[0];
    const begrunnelse = 'Vurdering';

    const hentetAksjonspunkt = screen.getByText(aksjonspunkt);
    expect(hentetAksjonspunkt).toBeInTheDocument();

    const hentetSokersBarn = screen.getByText(sokersBarn);
    expect(hentetSokersBarn).toBeInTheDocument();

    const hentetBegrunnelseText = screen.getByText(begrunnelse);
    expect(hentetBegrunnelseText).toBeInTheDocument();

    const hentetBehandletAksjonspunkt = screen.getByText(behandletAksjonspunkt);
    expect(hentetBehandletAksjonspunkt).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonTilLesemodus.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText(props.informasjonTilLesemodus.vilkarOppfylt ? 'Ja' : 'Nei');
    expect(hentetVilkarOppfylt).toBeInTheDocument();
  });

  test('Omsorg viser lesemodus med redigera vurdering mulighet', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMP_KS',
      aksjonspunktLost: true,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

    const hentetRedigerVurderingTekst = screen.getByText('Rediger vurdering');
    expect(hentetRedigerVurderingTekst).toBeInTheDocument();
  });

  test('Omsorg viser informasjon om vilkar etter fattet vedtak', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMP_KS',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

    const hentetNavnPåAksjonspunkt = screen.getByText(props.informasjonOmVilkar.navnPåAksjonspunkt);
    expect(hentetNavnPåAksjonspunkt).toBeInTheDocument();

    const hentetVilkar = screen.getByText(props.informasjonOmVilkar.vilkar);
    expect(hentetVilkar).toBeInTheDocument();

    const hentetBegrunnelse = screen.getByText(props.informasjonOmVilkar.begrunnelse);
    expect(hentetBegrunnelse).toBeInTheDocument();

    const hentetVilkarOppfylt = screen.getByText('Vilkåret er oppfylt');
    expect(hentetVilkarOppfylt).toBeInTheDocument();

    const hentetSokerHarOmsorgTekst = screen.getByText('Søker har omsorgen for barnet');
    expect(hentetSokerHarOmsorgTekst).toBeInTheDocument();
  });

  test('Omsorg viser informasjon om vilkar ikke oppfylt etter fattet vedtak', () => {
    const props = {
      behandlingsID: '123',
      fagytelseType: 'OMP_KS',
      aksjonspunktLost: false,
      lesemodus: false,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: true,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: false,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    render(<Omsorg {...props} />);

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
      fagytelseType: 'OMP_KS',
      aksjonspunktLost: false,
      lesemodus: true,
      informasjonTilLesemodus: {
        begrunnelse: 'Begrunnelse til lesemodus',
        vilkarOppfylt: false,
      },
      barn: ['01010050053'],
      harBarnSoktForRammevedtakOmKroniskSyk: false,
      vedtakFattetVilkarOppfylt: false,
      informasjonOmVilkar: {
        begrunnelse: 'begrunnelse',
        navnPåAksjonspunkt: 'Utvidet rett',
        vilkarOppfylt: true,
        vilkar: '§ 9-3 vilkar',
      },
      losAksjonspunkt: (harOmsorgen, begrunnelse) => console.log(harOmsorgen, begrunnelse),
      formState: FormStateTilTest,
    };

    const { container } = render(<Omsorg {...props} />);

    const a11yResults = await axe(container);

    expect(a11yResults).toHaveNoViolations();
  });
});
