import { Behandling } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import getAlleMerknaderFraBeslutter from './getAlleMerknaderFraBeslutter';

describe('<getAlleMerknaderFraBeslutter>', () => {
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
    behandlingPåVent: false,
    behandlingHenlagt: false,
    links: [],
  };

  const aksjonspunkter = [
    {
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        kodeverk: 'AKSJONSPUNKT_STATUS',
      },
      definisjon: {
        kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
        kodeverk: 'AKSJONSPUNKT_KODE',
      },
      kanLoses: true,
      erAktivt: true,
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
    },
  ];

  it('skal hente alle merknader fra beslutter når behandlingstatus er BEHANDLING_UTREDER', () => {
    const merknader = getAlleMerknaderFraBeslutter(behandling as Behandling, aksjonspunkter);

    expect(merknader).toEqual({
      [aksjonspunkter[0].definisjon.kode]: {
        notAccepted: true,
      },
    });
  });

  it('skal ikke hente merknader  behandlingstatus er ulik BEHANDLING_UTREDER', () => {
    const behandlingMedAnnenStatus = {
      ...behandling,
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: 'BEHANDLING_STATUS',
      },
    };
    const merknader = getAlleMerknaderFraBeslutter(behandlingMedAnnenStatus as Behandling, aksjonspunkter);

    expect(merknader).toEqual({});
  });
});
