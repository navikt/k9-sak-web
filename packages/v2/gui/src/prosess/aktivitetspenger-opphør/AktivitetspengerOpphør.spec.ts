import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { describe, expect, it } from 'vitest';
import { utledAktivTab } from './AktivitetspengerOpphør.js';
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

describe('utledAktivTab', () => {
  it('returnerer ÅRSAK_OG_VARSEL når VURDER_FAKTA_OM_BOSTED er OPPRETTET', () => {
    expect(utledAktivTab({ vurderBostedFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED) })).toBe(
      OpphørTab.ÅRSAK_OG_VARSEL,
    );
  });

  it('returnerer VILKÅRSVURDERING når VURDER_BOSTEDVILKÅR er OPPRETTET', () => {
    expect(utledAktivTab({ vurderBostedVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR) })).toBe(
      OpphørTab.VILKÅRSVURDERING,
    );
  });

  it('returnerer BESLUTTER når LOKALKONTOR_BESLUTTER_VILKÅR er OPPRETTET', () => {
    expect(utledAktivTab({ lokalkontorBeslutterAP: lagAp(AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR) })).toBe(
      OpphørTab.BESLUTTER,
    );
  });

  it('returnerer VILKÅRSVURDERING når lokalkontorForeslårVilkårAP finnes, uavhengig av status', () => {
    expect(
      utledAktivTab({
        lokalkontorForeslårVilkårAP: lagAp(
          AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
          AksjonspunktStatus.UTFØRT,
        ),
      }),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });

  it('returnerer ÅRSAK_OG_VARSEL som fallback når ingen aksjonspunkter finnes', () => {
    expect(utledAktivTab({})).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('prioriterer ÅRSAK_OG_VARSEL over VILKÅRSVURDERING når begge er OPPRETTET', () => {
    expect(
      utledAktivTab({
        vurderBostedFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED),
        vurderBostedVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR),
      }),
    ).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('returnerer VILKÅRSVURDERING når VURDER_FAKTA_OM_BOSTED er UTFØRT og VURDER_BOSTEDVILKÅR er OPPRETTET', () => {
    expect(
      utledAktivTab({
        vurderBostedFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED, AksjonspunktStatus.UTFØRT),
        vurderBostedVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR),
      }),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });
});
