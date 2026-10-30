import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BehandlingProvider, useBehandlingContext, useRefetchBehandling } from './BehandlingContext.js';

describe('BehandlingProvider', () => {
  it('skal sette ny behandling før kalleren av refetchBehandling går videre', async () => {
    const nyBehandling = { uuid: 'abc', versjon: 3 };
    const rekkefølge: string[] = [];
    const settBehandling = vi.fn(() => {
      rekkefølge.push('settBehandling');
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BehandlingProvider
        refetchBehandling={() => Promise.resolve(nyBehandling)}
        settBehandling={settBehandling}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
      >
        {children}
      </BehandlingProvider>
    );

    const { result } = renderHook(() => useRefetchBehandling(), { wrapper });
    await result.current().then(() => {
      rekkefølge.push('kaller');
    });

    expect(settBehandling).toHaveBeenCalledWith(nyBehandling);
    expect(rekkefølge).toEqual(['settBehandling', 'kaller']);
  });

  it('skal ikke sette behandling når svaret ikke er en behandling', async () => {
    const settBehandling = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BehandlingProvider
        refetchBehandling={() => Promise.resolve(undefined)}
        settBehandling={settBehandling}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
      >
        {children}
      </BehandlingProvider>
    );

    const { result } = renderHook(() => useRefetchBehandling(), { wrapper });
    await result.current();

    expect(settBehandling).not.toHaveBeenCalled();
  });

  it('skal sette ny behandling og deretter navigere til aktivt steg når aksjonspunkt er bekreftet', async () => {
    const nyBehandling = { uuid: 'abc', versjon: 3 };
    const rekkefølge: string[] = [];
    const settBehandling = vi.fn(() => {
      rekkefølge.push('settBehandling');
    });
    const oppdaterUrl = vi.fn(() => {
      rekkefølge.push('navigering');
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BehandlingProvider
        refetchBehandling={() => Promise.resolve(nyBehandling)}
        settBehandling={settBehandling}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterUrl}
      >
        {children}
      </BehandlingProvider>
    );

    const { result } = renderHook(() => useBehandlingContext(), { wrapper });
    await result.current.onAksjonspunktBekreftet();

    expect(settBehandling).toHaveBeenCalledWith(nyBehandling);
    expect(oppdaterUrl).toHaveBeenCalledWith('default', 'default');
    expect(rekkefølge).toEqual(['settBehandling', 'navigering']);
  });
});
