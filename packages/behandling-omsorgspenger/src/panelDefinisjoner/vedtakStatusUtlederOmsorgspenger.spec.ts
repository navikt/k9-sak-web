import { describe, expect, it } from 'vitest';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import findStatusForVedtak from './vedtakStatusUtlederOmsorgspenger';

const lagAksjonspunkt = (kode, statusKode) => ({
  status: { kode: statusKode },
  definisjon: { kode },
});

const lagVilkar = statusKode => [{ perioder: [{ vilkarStatus: { kode: statusKode } }] }];

const resultat = kode => ({ type: { kode } });

describe('findStatusForVedtak', () => {
  it('gir oppfylt for ikke oppfylte vilkår uten avslag når andre aksjonspunkter er lukket', () => {
    const status = findStatusForVedtak(
      lagVilkar(vilkarUtfallType.IKKE_OPPFYLT),
      [lagAksjonspunkt(aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD, aksjonspunktStatus.UTFORT)],
      [],
      resultat(behandlingResultatType.INNVILGET),
    );

    expect(status).toBe(vilkarUtfallType.OPPFYLT);
  });

  it('gir ikke oppfylt ved faktisk avslag', () => {
    const status = findStatusForVedtak(
      lagVilkar(vilkarUtfallType.IKKE_OPPFYLT),
      [],
      [],
      resultat(behandlingResultatType.AVSLATT),
    );

    expect(status).toBe(vilkarUtfallType.IKKE_OPPFYLT);
  });

  it('gir ikke vurdert når et annet aksjonspunkt er åpent', () => {
    const status = findStatusForVedtak(
      lagVilkar(vilkarUtfallType.IKKE_OPPFYLT),
      [lagAksjonspunkt(aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD, aksjonspunktStatus.OPPRETTET)],
      [],
      resultat(behandlingResultatType.INNVILGET),
    );

    expect(status).toBe(vilkarUtfallType.IKKE_VURDERT);
  });

  it('gir ikke vurdert når et vilkår ikke er vurdert', () => {
    const status = findStatusForVedtak(
      lagVilkar(vilkarUtfallType.IKKE_VURDERT),
      [],
      [],
      resultat(behandlingResultatType.INNVILGET),
    );

    expect(status).toBe(vilkarUtfallType.IKKE_VURDERT);
  });
});
