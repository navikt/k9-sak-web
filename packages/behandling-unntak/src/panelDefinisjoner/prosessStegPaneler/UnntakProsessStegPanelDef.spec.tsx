import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnntakProsessStegPanelDef from './UnntakProsessStegPanelDef';

const periode = { fom: '2025-01-01', tom: '2025-12-31' };

const lagProps = (submitCallback = vi.fn().mockResolvedValue(undefined)) => ({
  featureToggles: { BRUK_V2_PROSESS_UNNTAK: true },
  behandling: {
    behandlingsresultat: { type: { kode: 'IKKE_FASTSATT' }, vilkårResultat: { K9_VILKÅRET: [{ periode }] } },
  },
  vilkar: [{ vilkarType: { kode: 'FP_VK_0' }, perioder: [{ periode, begrunnelse: 'Lagret begrunnelse' }] }],
  isReadOnly: false,
  readOnlySubmitButton: false,
  submitCallback,
});

const hentKomponent = (props: ReturnType<typeof lagProps>) => {
  const [panelDef] = new UnntakProsessStegPanelDef().getPanelDefinisjoner();
  if (panelDef === undefined) {
    throw new Error('Forventet et panel');
  }
  return panelDef.getKomponent(props);
};

describe('UnntakProsessStegPanelDef', () => {
  it('sender valgt resultat, lagret begrunnelse og eneste periode til submitCallback når V2 er på', async () => {
    const submitCallback = vi.fn().mockResolvedValue(undefined);
    render(hentKomponent(lagProps(submitCallback)));

    expect(screen.getByRole('textbox', { name: 'Notat' })).toHaveValue('Lagret begrunnelse');
    await userEvent.click(screen.getByRole('radio', { name: 'Avslå eller ingen endring' }));
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));

    await waitFor(() =>
      expect(submitCallback).toHaveBeenCalledWith([
        { kode: '6016', periode, behandlingResultatType: 'AVSLÅTT', begrunnelse: 'Lagret begrunnelse' },
      ]),
    );
  });

  it('viser ikke skjema når det finnes flere perioder', () => {
    const props = lagProps();
    props.behandling.behandlingsresultat.vilkårResultat.K9_VILKÅRET.push({
      periode: { fom: '2026-01-01', tom: '2026-12-31' },
    });
    render(hentKomponent(props));

    expect(screen.getByText(/Fant ikke én entydig og gyldig periode/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  });
});
