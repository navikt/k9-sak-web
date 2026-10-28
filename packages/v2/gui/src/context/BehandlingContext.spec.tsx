import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BehandlingProvider, useRefetchBehandling } from './BehandlingContext.js';

describe('BehandlingProvider', () => {
  it('skal sette ny behandling før kalleren av refetchBehandling går videre', async () => {
    const nyBehandling = { uuid: 'abc', versjon: 3 };
    const rekkefølge: string[] = [];
    const settBehandling = vi.fn(() => {
      rekkefølge.push('settBehandling');
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BehandlingProvider refetchBehandling={() => Promise.resolve(nyBehandling)} settBehandling={settBehandling}>
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
      <BehandlingProvider refetchBehandling={() => Promise.resolve(undefined)} settBehandling={settBehandling}>
        {children}
      </BehandlingProvider>
    );

    const { result } = renderHook(() => useRefetchBehandling(), { wrapper });
    await result.current();

    expect(settBehandling).not.toHaveBeenCalled();
  });
});
