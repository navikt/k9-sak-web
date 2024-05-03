import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { Behandling } from '@k9-sak-web/types';

import readOnlyUtils from './readOnlyUtils';

describe('<readOnlyUtils>', () => {
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

  const vilkar = [
    {
      vilkarType: { kode: vilkarType.BEREGNINGSGRUNNLAGVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
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
