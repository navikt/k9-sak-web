import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { describe, expect, it } from 'vitest';
import { samleOpphørData, utledAktivTab, utledVilkårForBehandlingsårsak } from './AktivitetspengerOpphør.js';
import { OpphørTab } from './types.js';

const lagAp = (
  definisjon: AksjonspunktDto['definisjon'],
  status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET,
): AksjonspunktDto => ({
  definisjon,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

const årsaker = (...typer: BehandlingÅrsakType[]) => typer.map(behandlingArsakType => ({ behandlingArsakType }));
const alleOpphørsårsaker = årsaker(
  BehandlingÅrsakType.ENDRET_BOSTED,
  BehandlingÅrsakType.ENDRET_BISTANDSBEHOV,
  BehandlingÅrsakType.ENDRET_AKTIVITET,
  BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE,
);

describe('utledAktivTab', () => {
  it('returnerer ÅRSAK_OG_VARSEL når VURDER_FAKTA_OM_BOSTED er OPPRETTET', () => {
    expect(
      utledAktivTab(samleOpphørData([lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED)], [], alleOpphørsårsaker)),
    ).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('returnerer ÅRSAK_OG_VARSEL når VURDER_FAKTA_OM_BISTAND er OPPRETTET', () => {
    expect(
      utledAktivTab(samleOpphørData([lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND)], [], alleOpphørsårsaker)),
    ).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('returnerer VILKÅRSVURDERING når VURDER_BOSTEDSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(
      utledAktivTab(
        samleOpphørData([lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR)], [], alleOpphørsårsaker),
      ),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });

  it('returnerer VILKÅRSVURDERING når VURDER_BISTANDSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(
      utledAktivTab(
        samleOpphørData([lagAp(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR_OPPHØR)], [], alleOpphørsårsaker),
      ),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });

  it('returnerer ÅRSAK_OG_VARSEL når VURDER_FAKTA_OM_AKTIVITET er OPPRETTET', () => {
    expect(
      utledAktivTab(samleOpphørData([lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET)], [], alleOpphørsårsaker)),
    ).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('returnerer VILKÅRSVURDERING når VURDER_AKTIVITETSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(
      utledAktivTab(
        samleOpphørData([lagAp(AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR)], [], alleOpphørsårsaker),
      ),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });

  it('returnerer BESLUTTER når NAV_KONTOR_BESLUTTER_VILKÅR er OPPRETTET', () => {
    expect(
      utledAktivTab(
        samleOpphørData([lagAp(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR)], [], alleOpphørsårsaker),
      ),
    ).toBe(OpphørTab.BESLUTTER);
  });

  it('returnerer VILKÅRSVURDERING når lokalkontorForeslårVilkårAP finnes, uavhengig av status', () => {
    expect(
      utledAktivTab(
        samleOpphørData(
          [lagAp(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR, AksjonspunktStatus.UTFØRT)],
          [],
          alleOpphørsårsaker,
        ),
      ),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });

  it('returnerer ÅRSAK_OG_VARSEL som fallback når ingen aksjonspunkter finnes', () => {
    expect(utledAktivTab(samleOpphørData([], [], alleOpphørsårsaker))).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('prioriterer ÅRSAK_OG_VARSEL over VILKÅRSVURDERING når begge er OPPRETTET', () => {
    expect(
      utledAktivTab(
        samleOpphørData(
          [
            lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED),
            lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR),
          ],
          [],
          alleOpphørsårsaker,
        ),
      ),
    ).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('returnerer VILKÅRSVURDERING når VURDER_FAKTA_OM_BOSTED er UTFØRT og VURDER_BOSTEDSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(
      utledAktivTab(
        samleOpphørData(
          [
            lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED, AksjonspunktStatus.UTFØRT),
            lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR),
          ],
          [],
          alleOpphørsårsaker,
        ),
      ),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });

  it('ser bort fra aksjonspunkter for vilkår som ikke gjelder behandlingsårsaken', () => {
    expect(
      utledAktivTab(
        samleOpphørData(
          [
            lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED),
            lagAp(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR_OPPHØR),
          ],
          [],
          årsaker(BehandlingÅrsakType.ENDRET_BISTANDSBEHOV),
        ),
      ),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });
});

const lagVilkår = (type: VilkårMedPerioderDto['vilkarType']): VilkårMedPerioderDto => ({
  vilkarType: type,
  lovReferanse: '',
  overstyrbar: false,
  perioder: [],
});

describe('utledVilkårForBehandlingsårsak', () => {
  const bostedVilkår = lagVilkår(vilkarType.BOSTEDSVILKÅR);
  const bistandVilkår = lagVilkår(vilkarType.BISTANDSVILKÅR);
  const aktivitetVilkår = lagVilkår(vilkarType.AKTIVITETSVILKÅR);
  const andreLivsoppholdytelserVilkår = lagVilkår(vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR);
  const alleVilkår = [bostedVilkår, bistandVilkår, aktivitetVilkår, andreLivsoppholdytelserVilkår];

  it.each([
    [BehandlingÅrsakType.ENDRET_BOSTED, bostedVilkår],
    [BehandlingÅrsakType.ENDRET_BISTANDSBEHOV, bistandVilkår],
    [BehandlingÅrsakType.ENDRET_AKTIVITET, aktivitetVilkår],
    [BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE, andreLivsoppholdytelserVilkår],
  ])('returnerer vilkåret for behandlingsårsak %s', (årsak, forventetVilkår) => {
    expect(utledVilkårForBehandlingsårsak(samleOpphørData([], alleVilkår, årsaker(årsak)))).toBe(forventetVilkår);
  });

  it('følger rekkefølgen i opphørsvilkår når behandlingen har flere opphørsårsaker', () => {
    expect(
      utledVilkårForBehandlingsårsak(
        samleOpphørData(
          [],
          alleVilkår,
          årsaker(BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE, BehandlingÅrsakType.ENDRET_BISTANDSBEHOV),
        ),
      ),
    ).toBe(bistandVilkår);
  });

  it('hopper over en opphørsårsak der vilkåret mangler', () => {
    expect(
      utledVilkårForBehandlingsårsak(
        samleOpphørData(
          [],
          [andreLivsoppholdytelserVilkår],
          årsaker(BehandlingÅrsakType.ENDRET_BISTANDSBEHOV, BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE),
        ),
      ),
    ).toBe(andreLivsoppholdytelserVilkår);
  });

  it('returnerer undefined når behandlingen ikke har noen opphørsårsak', () => {
    expect(utledVilkårForBehandlingsårsak(samleOpphørData([], alleVilkår, undefined))).toBeUndefined();
  });
});
