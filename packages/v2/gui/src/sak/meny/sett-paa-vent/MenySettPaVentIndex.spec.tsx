import { k9_kodeverk_behandling_aksjonspunkt_Venteårsak as AksjonspunktDtoVenteårsak } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { add, format } from 'date-fns';
import MenySettPaVentIndexV2 from './MenySettPaVentIndex';

const testDato = add(new Date(), { months: 2, days: 1 });

describe('<MenySettPaVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', async () => {
    const lukkModalCallback = vi.fn();
    const settBehandlingPaVent = vi.fn(() => Promise.resolve());

    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <MenySettPaVentIndexV2
          behandlingId={3}
          behandlingVersjon={1}
          settBehandlingPaVent={settBehandlingPaVent}
          lukkModal={lukkModalCallback}
          erTilbakekreving={false}
        />
      </KodeverkProvider>,
    );

    expect(await screen.getByTestId('SettPaVentModal')).toBeInTheDocument();
    expect(screen.getAllByText('Behandlingen settes på vent med frist')).toHaveLength(2);

    /**
     * Velg en dato
     */
    const datoFelt = screen.getByRole('textbox', { name: 'Behandlingen settes på vent med frist' });
    const datoStreng = format(testDato, 'dd.MM.yyyy');
    await userEvent.clear(datoFelt);
    await userEvent.type(datoFelt, datoStreng);
    fireEvent.blur(datoFelt);

    /**
     * Velg en venteårsak
     */
    const venteArsakFelt = screen.getByLabelText('Hva venter vi på?');
    await userEvent.selectOptions(venteArsakFelt, AksjonspunktDtoVenteårsak.MEDISINSKE_OPPLYSNINGER);

    /**
     * Ssubmit
     */
    await userEvent.click(screen.getByText(/Sett på vent/i));

    expect(settBehandlingPaVent).toHaveBeenCalledWith({
      behandlingVersjon: 1,
      behandlingId: 3,
      frist: format(testDato, 'yyyy-MM-dd'),
      ventearsak: AksjonspunktDtoVenteårsak.MEDISINSKE_OPPLYSNINGER,
      ventearsakVariant: undefined,
    });
  });
});
