import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { describe, expect, it } from 'vitest';
import { utledAktivTab, utledGjeldendeVilkår } from './AktivitetspengerOpphør.js';
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

  it('returnerer ÅRSAK_OG_VARSEL når VURDER_FAKTA_OM_BISTAND er OPPRETTET', () => {
    expect(utledAktivTab({ vurderBistandFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND) })).toBe(
      OpphørTab.ÅRSAK_OG_VARSEL,
    );
  });

  it('returnerer VILKÅRSVURDERING når VURDER_BOSTEDSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(utledAktivTab({ vurderBostedVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR) })).toBe(
      OpphørTab.VILKÅRSVURDERING,
    );
  });

  it('returnerer VILKÅRSVURDERING når VURDER_BISTANDSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(utledAktivTab({ vurderBistandVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR_OPPHØR) })).toBe(
      OpphørTab.VILKÅRSVURDERING,
    );
  });

  it('returnerer ÅRSAK_OG_VARSEL når VURDER_FAKTA_OM_AKTIVITET er OPPRETTET', () => {
    expect(utledAktivTab({ vurderAktivitetFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET) })).toBe(
      OpphørTab.ÅRSAK_OG_VARSEL,
    );
  });

  it('returnerer VILKÅRSVURDERING når VURDER_AKTIVITETSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(
      utledAktivTab({
        vurderAktivitetVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR),
      }),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });

  it('returnerer BESLUTTER når NAV_KONTOR_BESLUTTER_VILKÅR er OPPRETTET', () => {
    expect(utledAktivTab({ lokalkontorBeslutterAP: lagAp(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR) })).toBe(
      OpphørTab.BESLUTTER,
    );
  });

  it('returnerer VILKÅRSVURDERING når lokalkontorForeslårVilkårAP finnes, uavhengig av status', () => {
    expect(
      utledAktivTab({
        lokalkontorForeslårVilkårAP: lagAp(
          AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR,
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
        vurderBostedVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR),
      }),
    ).toBe(OpphørTab.ÅRSAK_OG_VARSEL);
  });

  it('returnerer VILKÅRSVURDERING når VURDER_FAKTA_OM_BOSTED er UTFØRT og VURDER_BOSTEDSVILKÅR_OPPHØR er OPPRETTET', () => {
    expect(
      utledAktivTab({
        vurderBostedFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED, AksjonspunktStatus.UTFØRT),
        vurderBostedVilkårAP: lagAp(AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR),
      }),
    ).toBe(OpphørTab.VILKÅRSVURDERING);
  });
});

const lagVilkår = (type: VilkårMedPerioderDto['vilkarType']): VilkårMedPerioderDto => ({
  vilkarType: type,
  lovReferanse: '',
  overstyrbar: false,
  perioder: [],
});

describe('utledGjeldendeVilkår', () => {
  const bostedVilkår = lagVilkår(vilkarType.BOSTEDSVILKÅR);
  const bistandVilkår = lagVilkår(vilkarType.BISTANDSVILKÅR);
  const aktivitetVilkår = lagVilkår(vilkarType.AKTIVITETSVILKÅR);
  const andreLivsoppholdytelserVilkår = lagVilkår(vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR);
  const alleVilkår = { bostedVilkår, bistandVilkår, aktivitetVilkår, andreLivsoppholdytelserVilkår };

  it('returnerer bostedsvilkåret når VURDER_FAKTA_OM_BOSTED finnes', () => {
    expect(
      utledGjeldendeVilkår({
        ...alleVilkår,
        vurderBostedFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED),
      }),
    ).toBe(bostedVilkår);
  });

  it('returnerer bistandsvilkåret når VURDER_FAKTA_OM_BISTAND finnes', () => {
    expect(
      utledGjeldendeVilkår({
        ...alleVilkår,
        vurderBistandFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND),
      }),
    ).toBe(bistandVilkår);
  });

  it('returnerer aktivitetsvilkåret når VURDER_FAKTA_OM_AKTIVITET finnes', () => {
    expect(
      utledGjeldendeVilkår({
        ...alleVilkår,
        vurderAktivitetFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET),
      }),
    ).toBe(aktivitetVilkår);
  });

  it('returnerer vilkåret for andre livsoppholdsytelser når VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER finnes', () => {
    expect(
      utledGjeldendeVilkår({
        ...alleVilkår,
        vurderAndreLivsoppholdytelserFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER),
      }),
    ).toBe(andreLivsoppholdytelserVilkår);
  });

  it('prioriterer bosted over bistand når begge fakta-aksjonspunktene finnes', () => {
    expect(
      utledGjeldendeVilkår({
        ...alleVilkår,
        vurderBostedFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED, AksjonspunktStatus.UTFØRT),
        vurderBistandFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND),
      }),
    ).toBe(bostedVilkår);
  });

  it('prioriterer bistand over andre livsoppholdsytelser når begge fakta-aksjonspunktene finnes', () => {
    expect(
      utledGjeldendeVilkår({
        ...alleVilkår,
        vurderBistandFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND),
        vurderAndreLivsoppholdytelserFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER),
      }),
    ).toBe(bistandVilkår);
  });

  it('prioriterer bistand over aktivitet når begge fakta-aksjonspunktene finnes', () => {
    expect(
      utledGjeldendeVilkår({
        ...alleVilkår,
        vurderBistandFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND),
        vurderAktivitetFaktaAP: lagAp(AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET),
      }),
    ).toBe(bistandVilkår);
  });

  it('faller tilbake til vilkåret for andre livsoppholdsytelser når ingen fakta-aksjonspunkter finnes', () => {
    expect(utledGjeldendeVilkår(alleVilkår)).toBe(andreLivsoppholdytelserVilkår);
  });
});
