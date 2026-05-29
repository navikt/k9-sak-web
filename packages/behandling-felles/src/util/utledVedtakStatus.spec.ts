import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import utledVedtakStatus from './utledVedtakStatus';

const lagAksjonspunkt = (definisjonKode, statusKode) => ({
  definisjon: {
    kode: definisjonKode,
  },
  status: {
    kode: statusKode,
  },
});

const lagVilkår = vilkarStatusKode => [
  {
    perioder: [
      {
        vilkarStatus: {
          kode: vilkarStatusKode,
        },
      },
    ],
  },
];

describe('utledVedtakStatus', () => {
  const vedtakAksjonspunkter = [lagAksjonspunkt('VEDTAK_AP', aksjonspunktStatus.UTFORT)];
  const innvilgetResultat = {
    type: {
      kode: behandlingResultatType.INNVILGET,
    },
  };
  const avslagResultat = {
    type: {
      kode: behandlingResultatType.AVSLATT,
    },
  };

  it('returnerer IKKE_VURDERT når vilkårsliste er tom', () => {
    const status = utledVedtakStatus([], [], vedtakAksjonspunkter, innvilgetResultat);

    expect(status).toBe(vilkarUtfallType.IKKE_VURDERT);
  });

  it('returnerer IKKE_OPPFYLT når vilkår er IKKE_OPPFYLT og alle relevante aksjonspunkt er lukket', () => {
    const vilkar = lagVilkår(vilkarUtfallType.IKKE_OPPFYLT);
    const aksjonspunkter = [lagAksjonspunkt('ANNET_AP', aksjonspunktStatus.UTFORT)];

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, innvilgetResultat);

    expect(status).toBe(vilkarUtfallType.IKKE_OPPFYLT);
  });

  it('returnerer OPPFYLT når sjekk for IKKE_OPPFYLT-vilkår er slått av', () => {
    const vilkar = lagVilkår(vilkarUtfallType.IKKE_OPPFYLT);
    const aksjonspunkter = [lagAksjonspunkt('ANNET_AP', aksjonspunktStatus.UTFORT)];

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, innvilgetResultat, false);

    expect(status).toBe(vilkarUtfallType.OPPFYLT);
  });

  it('returnerer IKKE_VURDERT når det finnes åpent OVERSTYR_BEREGNING-aksjonspunkt', () => {
    const vilkar = lagVilkår(vilkarUtfallType.OPPFYLT);
    const aksjonspunkter = [
      lagAksjonspunkt(aksjonspunktCodes.OVERSTYR_BEREGNING, aksjonspunktStatus.OPPRETTET),
      lagAksjonspunkt('ANNET_AP', aksjonspunktStatus.UTFORT),
    ];

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, innvilgetResultat);

    expect(status).toBe(vilkarUtfallType.IKKE_VURDERT);
  });

  it('returnerer IKKE_VURDERT når et ikke-vedtak-aksjonspunkt er åpent', () => {
    const vilkar = lagVilkår(vilkarUtfallType.OPPFYLT);
    const aksjonspunkter = [lagAksjonspunkt('ANNET_AP', aksjonspunktStatus.OPPRETTET)];

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, innvilgetResultat);

    expect(status).toBe(vilkarUtfallType.IKKE_VURDERT);
  });

  it('returnerer IKKE_OPPFYLT ved avslag når øvrige sjekker passerer', () => {
    const vilkar = lagVilkår(vilkarUtfallType.OPPFYLT);
    const aksjonspunkter = [lagAksjonspunkt('ANNET_AP', aksjonspunktStatus.UTFORT)];

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, avslagResultat);

    expect(status).toBe(vilkarUtfallType.IKKE_OPPFYLT);
  });

  it('returnerer OPPFYLT når vilkår er oppfylt, aksjonspunkt er lukket og resultat er innvilget', () => {
    const vilkar = lagVilkår(vilkarUtfallType.OPPFYLT);
    const aksjonspunkter = [lagAksjonspunkt('ANNET_AP', aksjonspunktStatus.UTFORT)];

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, innvilgetResultat);

    expect(status).toBe(vilkarUtfallType.OPPFYLT);
  });
});
