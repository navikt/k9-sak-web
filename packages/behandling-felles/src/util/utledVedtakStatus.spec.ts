import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Behandlingsresultat, Vilkar } from '@k9-sak-web/types';

import utledVedtakStatus from './utledVedtakStatus';

const lagAksjonspunkt = (definisjonKode: string, statusKode: string): Aksjonspunkt => {
  const aksjonspunkt: Aksjonspunkt = {
    definisjon: {
      kode: definisjonKode,
      kodeverk: 'AKSJONSPUNKT_KODE',
    },
    status: {
      kode: statusKode,
      kodeverk: 'AKSJONSPUNKT_STATUS',
    },
    kanLoses: true,
    erAktivt: true,
  };

  return aksjonspunkt;
};

const lagVilkår = (vilkarStatusKode: string): Vilkar[] => {
  const vilkar: Vilkar = {
    vilkarType: {
      kode: 'TEST_VILKAR',
      kodeverk: 'VILKAR_TYPE',
    },
    overstyrbar: true,
    relevanteInnvilgetMerknader: [],
    perioder: [
      {
        vilkarStatus: {
          kode: vilkarStatusKode,
          kodeverk: 'VILKAR_UTFALL_TYPE',
        },
        merknadParametere: {},
        periode: {
          fom: '2024-01-01',
          tom: '2024-01-02',
        },
      },
    ],
  };

  return [vilkar];
};

describe('utledVedtakStatus', () => {
  const vedtakAksjonspunkter = [lagAksjonspunkt('VEDTAK_AP', aksjonspunktStatus.UTFORT)];
  const innvilgetResultat: Behandlingsresultat = {
    type: {
      kode: behandlingResultatType.INNVILGET,
    },
  };
  const avslagResultat: Behandlingsresultat = {
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

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, innvilgetResultat, {
      skalSjekkeIkkeOppfyltVilkår: false,
    });

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

  it('kan slå av sjekk for åpent OVERSTYR_BEREGNING-aksjonspunkt', () => {
    const vilkar = lagVilkår(vilkarUtfallType.OPPFYLT);
    const aksjonspunkter = [lagAksjonspunkt(aksjonspunktCodes.OVERSTYR_BEREGNING, aksjonspunktStatus.OPPRETTET)];
    const vedtakAksjonspunkter = [lagAksjonspunkt(aksjonspunktCodes.OVERSTYR_BEREGNING, aksjonspunktStatus.OPPRETTET)];

    const status = utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, innvilgetResultat, {
      skalSjekkeIkkeOppfyltVilkår: false,
      skalSjekkeOverstyrBeregningAksjonspunkt: false,
    });

    expect(status).toBe(vilkarUtfallType.OPPFYLT);
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
