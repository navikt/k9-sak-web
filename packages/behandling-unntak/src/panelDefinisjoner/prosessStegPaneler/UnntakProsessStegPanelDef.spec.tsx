import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer } from 'redux-form';
import UnntakProsessStegPanelDef from './UnntakProsessStegPanelDef';

const periode = { fom: '2025-01-01', tom: '2025-12-31' };
const annenPeriode = { fom: '2026-01-01', tom: '2026-12-31' };

interface PropsOpsjoner {
  featureToggles?: { BRUK_V2_PROSESS_UNNTAK: boolean };
  resultatKode?: string;
  begrunnelse?: string;
  perioder?: { fom: string; tom: string }[];
  isReadOnly?: boolean;
  readOnlySubmitButton?: boolean;
  submitCallback?: () => Promise<void>;
}

const lagProps = ({
  featureToggles = { BRUK_V2_PROSESS_UNNTAK: true },
  resultatKode = 'IKKE_FASTSATT',
  begrunnelse = 'Lagret begrunnelse',
  perioder = [periode],
  isReadOnly = false,
  readOnlySubmitButton = false,
  submitCallback = vi.fn().mockResolvedValue(undefined),
}: PropsOpsjoner = {}) => ({
  featureToggles,
  behandling: {
    id: 1,
    versjon: 1,
    språkkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    behandlingsresultat: {
      type: { kode: resultatKode },
      vilkårResultat: { K9_VILKÅRET: perioder.map(p => ({ periode: p, utfall: 'OPPFYLT' })) },
    },
  },
  alleKodeverk: {},
  aksjonspunkter: [],
  vilkar: [{ vilkarType: { kode: 'FP_VK_0' }, perioder: [{ periode: perioder[0], begrunnelse }] }],
  isReadOnly,
  readOnlySubmitButton,
  previewCallback: vi.fn(),
  submitCallback,
});

type Props = Omit<ReturnType<typeof lagProps>, 'featureToggles'> & {
  featureToggles?: { BRUK_V2_PROSESS_UNNTAK: boolean };
};

const hentKomponent = (props: Props) => {
  const [panelDef] = new UnntakProsessStegPanelDef().getPanelDefinisjoner();
  if (panelDef === undefined) {
    throw new Error('Forventet et panel');
  }
  return panelDef.getKomponent(props);
};

const renderPanel = (props: Props) => {
  const store = createStore(combineReducers({ form: reducer }));
  const wrap = (p: Props) => <Provider store={store}>{hentKomponent(p)}</Provider>;
  const result = render(wrap(props));
  return { ...result, rerenderPanel: (p: Props) => result.rerender(wrap(p)) };
};

const lagreKnapp = () => screen.getByRole('button', { name: 'Bekreft og fortsett' });
const innvilget = () => screen.getByRole('radio', { name: 'Innvilget eller endring' });
const avslått = () => screen.getByRole('radio', { name: 'Avslå eller ingen endring' });
const notat = () => screen.getByRole('textbox', { name: 'Notat' });

describe('UnntakProsessStegPanelDef med BRUK_V2_PROSESS_UNNTAK av', () => {
  it.each([{ BRUK_V2_PROSESS_UNNTAK: false }, undefined])('viser V1 når featureToggles er %o', featureToggles => {
    const props = { ...lagProps(), featureToggles };
    renderPanel(props);
    expect(screen.getByRole('heading', { name: 'Vurder Vilkår' })).toBeInTheDocument();
    expect(notat()).toHaveValue('Lagret begrunnelse');
  });

  it('sender V1-payload med avslagsårsak og utfall for innvilget resultat', async () => {
    const submitCallback = vi.fn().mockResolvedValue(undefined);
    renderPanel(lagProps({ featureToggles: { BRUK_V2_PROSESS_UNNTAK: false }, submitCallback }));

    await userEvent.click(innvilget());
    await userEvent.click(lagreKnapp());

    await waitFor(() =>
      expect(submitCallback).toHaveBeenCalledWith([
        {
          periode,
          avslagsårsak: undefined,
          utfall: 'OPPFYLT',
          behandlingResultatType: 'INNVILGET',
          begrunnelse: 'Lagret begrunnelse',
          kode: '6016',
        },
      ]),
    );
  });

  it('sender V1-payload for avslått resultat og forhåndsvelger lagret resultat', async () => {
    const submitCallback = vi.fn().mockResolvedValue(undefined);
    renderPanel(
      lagProps({ featureToggles: { BRUK_V2_PROSESS_UNNTAK: false }, resultatKode: 'AVSLÅTT', submitCallback }),
    );

    expect(avslått()).toBeChecked();
    await userEvent.click(lagreKnapp());

    await waitFor(() =>
      expect(submitCallback).toHaveBeenCalledWith([
        expect.objectContaining({ behandlingResultatType: 'AVSLÅTT', begrunnelse: 'Lagret begrunnelse', kode: '6016' }),
      ]),
    );
  });

  it('viser V1 skrivebeskyttet uten lagreknapp', () => {
    renderPanel(
      lagProps({ featureToggles: { BRUK_V2_PROSESS_UNNTAK: false }, isReadOnly: true, resultatKode: 'INNVILGET' }),
    );
    expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    expect(innvilget()).toBeDisabled();
    expect(avslått()).toBeDisabled();
  });

  it('deaktiverer V1-lagreknappen når den ikke kan sendes inn og skjemaet er urørt', () => {
    renderPanel(lagProps({ featureToggles: { BRUK_V2_PROSESS_UNNTAK: false }, readOnlySubmitButton: true }));
    expect(lagreKnapp()).toBeDisabled();
  });
});

describe('UnntakProsessStegPanelDef med BRUK_V2_PROSESS_UNNTAK på', () => {
  it('viser V2', () => {
    renderPanel(lagProps());
    expect(screen.getByRole('heading', { name: 'Vurder vilkår' })).toBeInTheDocument();
  });

  it('sender innvilget resultat, lagret begrunnelse og eneste periode', async () => {
    const submitCallback = vi.fn().mockResolvedValue(undefined);
    renderPanel(lagProps({ submitCallback }));

    expect(notat()).toHaveValue('Lagret begrunnelse');
    await userEvent.click(innvilget());
    await userEvent.click(lagreKnapp());

    await waitFor(() =>
      expect(submitCallback).toHaveBeenCalledWith([
        { kode: '6016', periode, behandlingResultatType: 'INNVILGET', begrunnelse: 'Lagret begrunnelse' },
      ]),
    );
    expect(submitCallback).toHaveBeenCalledTimes(1);
  });

  it('sender avslått resultat', async () => {
    const submitCallback = vi.fn().mockResolvedValue(undefined);
    renderPanel(lagProps({ submitCallback }));

    await userEvent.click(avslått());
    await userEvent.click(lagreKnapp());

    await waitFor(() =>
      expect(submitCallback).toHaveBeenCalledWith([
        { kode: '6016', periode, behandlingResultatType: 'AVSLÅTT', begrunnelse: 'Lagret begrunnelse' },
      ]),
    );
  });

  it('forhåndsvelger lagret resultat og sender det uendret', async () => {
    const submitCallback = vi.fn().mockResolvedValue(undefined);
    renderPanel(lagProps({ resultatKode: 'AVSLÅTT', submitCallback }));

    expect(avslått()).toBeChecked();
    expect(innvilget()).not.toBeChecked();
    await userEvent.click(lagreKnapp());

    await waitFor(() =>
      expect(submitCallback).toHaveBeenCalledWith([
        { kode: '6016', periode, behandlingResultatType: 'AVSLÅTT', begrunnelse: 'Lagret begrunnelse' },
      ]),
    );
  });

  it('kan ikke sendes inn uten begrunnelse eller resultat', async () => {
    renderPanel(lagProps({ begrunnelse: '' }));
    expect(lagreKnapp()).toBeDisabled();

    await userEvent.type(notat(), 'Ny begrunnelse');
    expect(lagreKnapp()).toBeDisabled();

    await userEvent.click(innvilget());
    expect(lagreKnapp()).toBeEnabled();
  });

  it('viser skrivebeskyttet uten lagreknapp', () => {
    renderPanel(lagProps({ isReadOnly: true, resultatKode: 'INNVILGET' }));
    expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Notat' })).not.toBeInTheDocument();
    expect(screen.getByText('Lagret begrunnelse')).toBeInTheDocument();
    expect(innvilget()).toBeChecked();
  });

  it('deaktiverer lagreknappen når den ikke kan sendes inn og skjemaet er urørt, og aktiverer den etter endring', async () => {
    renderPanel(lagProps({ readOnlySubmitButton: true, resultatKode: 'INNVILGET' }));
    expect(lagreKnapp()).toBeDisabled();

    await userEvent.click(avslått());
    expect(lagreKnapp()).toBeEnabled();
  });

  it('sender ikke inn på nytt mens en innsending pågår', async () => {
    let fullfør: () => void = () => {};
    const submitCallback = vi.fn().mockReturnValue(
      new Promise<void>(resolve => {
        fullfør = resolve;
      }),
    );
    renderPanel(lagProps({ resultatKode: 'INNVILGET', submitCallback }));

    const knapp = lagreKnapp();
    await userEvent.click(knapp);
    await userEvent.click(knapp);
    fullfør();

    await waitFor(() => expect(submitCallback).toHaveBeenCalledTimes(1));
  });

  it('viser ikke skjema uten periode', () => {
    renderPanel(lagProps({ perioder: [] }));

    expect(screen.getByText(/Fant ikke én entydig og gyldig periode/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  });

  it('viser ikke skjema når det finnes flere perioder', () => {
    renderPanel(lagProps({ perioder: [periode, annenPeriode] }));

    expect(screen.getByText(/Fant ikke én entydig og gyldig periode/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  });

  describe('etter oppdatering av behandlingen', () => {
    it('viser og sender nye lagrede verdier og ny periode', async () => {
      const submitCallback = vi.fn().mockResolvedValue(undefined);
      const { rerenderPanel } = renderPanel(lagProps({ submitCallback }));
      expect(notat()).toHaveValue('Lagret begrunnelse');

      rerenderPanel(
        lagProps({
          begrunnelse: 'Oppdatert begrunnelse',
          resultatKode: 'AVSLÅTT',
          perioder: [annenPeriode],
          submitCallback,
        }),
      );

      expect(notat()).toHaveValue('Oppdatert begrunnelse');
      expect(avslått()).toBeChecked();
      await userEvent.click(lagreKnapp());
      await waitFor(() =>
        expect(submitCallback).toHaveBeenCalledWith([
          {
            kode: '6016',
            periode: annenPeriode,
            behandlingResultatType: 'AVSLÅTT',
            begrunnelse: 'Oppdatert begrunnelse',
          },
        ]),
      );
    });

    it('beholder pågående endringer når de lagrede verdiene er uendret', async () => {
      const { rerenderPanel } = renderPanel(lagProps({ resultatKode: 'INNVILGET' }));
      await userEvent.clear(notat());
      await userEvent.type(notat(), 'Pågående endring');

      rerenderPanel(lagProps({ resultatKode: 'INNVILGET' }));

      expect(notat()).toHaveValue('Pågående endring');
    });

    it('fjerner lagreknappen når behandlingen blir skrivebeskyttet, uten å miste verdiene', () => {
      const { rerenderPanel } = renderPanel(lagProps({ resultatKode: 'INNVILGET' }));
      expect(lagreKnapp()).toBeEnabled();

      rerenderPanel(lagProps({ resultatKode: 'INNVILGET', isReadOnly: true }));

      expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
      expect(innvilget()).toBeChecked();
    });

    it('viser advarsel når perioden blir flertydig og skjema igjen når den blir entydig', () => {
      const { rerenderPanel } = renderPanel(lagProps());
      rerenderPanel(lagProps({ perioder: [periode, annenPeriode] }));
      expect(screen.getByText(/Fant ikke én entydig og gyldig periode/)).toBeInTheDocument();

      rerenderPanel(lagProps({ begrunnelse: 'Tilbake' }));
      expect(notat()).toHaveValue('Tilbake');
    });
  });
});
