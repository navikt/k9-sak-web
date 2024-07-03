import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { Behandling } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BehandlingPaVent from './BehandlingPaVent';

describe('<BehandlingPaVent>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };
  const aksjonspunkter = [];
  const kodeverk = {
    Venteårsak: [
      {
        kode: 'FOR_TIDLIG_SOKNAD',
        navn: 'Venter pga for tidlig søknad',
        kodeverk: 'VENT_AARSAK',
      },
    ],
  };

  it('skal ikke vise modal når behandling ikke er på vent', () => {
    renderWithIntlAndReduxForm(
      <BehandlingPaVent
        behandling={behandling as Behandling}
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={vi.fn()}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('skal vise modal når behandling er på vent', () => {
    renderWithIntlAndReduxForm(
      <BehandlingPaVent
        behandling={
          {
            ...behandling,
            behandlingPaaVent: true,
          } as Behandling
        }
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Behandlingen settes på vent med frist' })).toBeInTheDocument();
  });

  it('skal vise modal og så skjule den ved trykk på knapp', async () => {
    renderWithIntlAndReduxForm(
      <BehandlingPaVent
        behandling={
          {
            ...behandling,
            behandlingPaaVent: true,
          } as Behandling
        }
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Behandlingen settes på vent med frist' })).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Lukk' }));
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('skal markeres som automatisk satt på vent når en har åpent aksjonspunkt for auto-manuelt satt på vent', () => {
    renderWithIntlAndReduxForm(
      <BehandlingPaVent
        behandling={
          {
            ...behandling,
            behandlingPaaVent: true,
          } as Behandling
        }
        aksjonspunkter={[
          {
            status: aksjonspunktStatus.OPPRETTET,
            definisjon: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        kodeverk={kodeverk}
        settPaVent={vi.fn()}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Hva venter vi på?' })).toBeInTheDocument();
  });
});
