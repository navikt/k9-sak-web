import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import { Behandling } from '@k9-sak-web/types';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BehandlingPaVent from './BehandlingPaVent';

describe('<BehandlingPaVent>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      kodeverk: 'BEHANDLING_STATUS',
    },
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    },
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
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
            definisjon: {
              kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
              kodeverk: 'AKSJONSPUNKT_KODE',
            },
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
