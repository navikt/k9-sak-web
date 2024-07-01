import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Behandling } from '@k9-sak-web/types';

import readOnlyUtils from './readOnlyUtils';

describe('<readOnlyUtils>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };

  const aksjonspunkter = [
    {
      status: aksjonspunktStatus.OPPRETTET,
      definisjon: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
      kanLoses: true,
      erAktivt: true,
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
    },
  ];

  const vilkar = [
    {
      vilkarType: vilkarType.BEREGNINGSGRUNNLAGVILKARET,
      overstyrbar: true,
      perioder: [
        {
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          merknadParametere: {
            antattGodkjentArbeid: 'P0D',
            antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
          },
          periode: { fom: '2020-03-16', tom: '2020-03-19' },
        },
      ],
    },
  ];

  const rettigheter = {
    writeAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
    kanOverstyreAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
  };

  it('skal behandling readonly-status', () => {
    const behandlingMedReadOnly = {
      ...behandling,
      taskStatus: {
        readOnly: true,
      },
    };
    const status = readOnlyUtils.harBehandlingReadOnlyStatus(behandlingMedReadOnly as Behandling);
    expect(status).toBe(true);
  });

  it('skal ikke behandling readonly-status', () => {
    const behandlingMedReadOnly = {
      ...behandling,
      taskStatus: {
        readOnly: false,
      },
    };
    const status = readOnlyUtils.harBehandlingReadOnlyStatus(behandlingMedReadOnly as Behandling);
    expect(status).toBe(false);
  });

  it('skal ikke være readonly', () => {
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(
      behandling as Behandling,
      aksjonspunkter,
      vilkar,
      rettigheter,
      hasFetchError,
    );

    expect(erReadOnly).toBe(false);
  });

  it('skal være readonly når en ikke har rettighet', () => {
    const nyRettigheter = {
      ...rettigheter,
      writeAccess: {
        isEnabled: false,
        employeeHasAccess: true,
      },
    };
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(
      behandling as Behandling,
      aksjonspunkter,
      vilkar,
      nyRettigheter,
      hasFetchError,
    );

    expect(erReadOnly).toBe(true);
  });

  it('skal være readonly når en har fetch error', () => {
    const hasFetchError = true;
    const erReadOnly = readOnlyUtils.erReadOnly(
      behandling as Behandling,
      aksjonspunkter,
      vilkar,
      rettigheter,
      hasFetchError,
    );

    expect(erReadOnly).toBe(true);
  });

  it('skal være readonly når en har tastStatus.readOnly', () => {
    const behandlingMedReadOnly = {
      ...behandling,
      taskStatus: {
        readOnly: true,
      },
    };
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(
      behandlingMedReadOnly as Behandling,
      aksjonspunkter,
      vilkar,
      rettigheter,
      hasFetchError,
    );

    expect(erReadOnly).toBe(true);
  });

  it('skal være readonly når en har minst ett ikke aktivt aksjonspunkt', () => {
    const nyeAksjonspunkter = [
      {
        ...aksjonspunkter[0],
        erAktivt: false,
      },
    ];
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(
      behandling as Behandling,
      nyeAksjonspunkter,
      vilkar,
      rettigheter,
      hasFetchError,
    );

    expect(erReadOnly).toBe(true);
  });

  it('skal være readonly når en har minst ett ikke overstyrbart vilkar', () => {
    const nyeVilkar = [
      {
        ...vilkar[0],
        overstyrbar: false,
      },
    ];
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(
      behandling as Behandling,
      aksjonspunkter,
      nyeVilkar,
      rettigheter,
      hasFetchError,
    );

    expect(erReadOnly).toBe(true);
  });
});
