import { type LegacyBehandling, utledUnntakV2Props } from './utledUnntakV2Props';

const periode = { fom: '2025-01-01', tom: '2025-12-31' };

type VilkårResultat = NonNullable<LegacyBehandling['behandlingsresultat']>['vilkårResultat'];

const behandling = (vilkårResultat: VilkårResultat, typeKode?: string): LegacyBehandling => ({
  behandlingsresultat: { type: { kode: typeKode }, vilkårResultat },
});

const k9Vilkår = (begrunnelse: string | undefined, p = periode) => ({
  vilkarType: { kode: 'FP_VK_0' },
  perioder: [{ periode: p, begrunnelse }],
});

describe('utledUnntakV2Props', () => {
  it('bruker eneste periode, lagret begrunnelse og behandlingsresultat', () => {
    const resultat = utledUnntakV2Props(
      [k9Vilkår('Lagret begrunnelse')],
      behandling({ K9_VILKÅRET: [{ periode }] }, 'AVSLÅTT'),
    );
    expect(resultat).toEqual({ periode, begrunnelse: 'Lagret begrunnelse', behandlingResultatType: 'AVSLÅTT' });
  });

  it('gir ingen periode når K9_VILKÅRET mangler', () => {
    expect(utledUnntakV2Props([k9Vilkår('x')], behandling({})).periode).toBeUndefined();
    expect(utledUnntakV2Props([k9Vilkår('x')], behandling(undefined)).periode).toBeUndefined();
    expect(utledUnntakV2Props([k9Vilkår('x')], undefined).periode).toBeUndefined();
  });

  it('gir ingen periode eller begrunnelse når det finnes flere perioder', () => {
    const resultat = utledUnntakV2Props(
      [k9Vilkår('Lagret begrunnelse')],
      behandling({ K9_VILKÅRET: [{ periode }, { periode: { fom: '2026-01-01', tom: '2026-12-31' } }] }),
    );
    expect(resultat.periode).toBeUndefined();
    expect(resultat.begrunnelse).toBeUndefined();
  });

  it('gir ingen periode når fom eller tom mangler', () => {
    const resultat = utledUnntakV2Props([], behandling({ K9_VILKÅRET: [{ periode: { fom: '2025-01-01' } }] }));
    expect(resultat.periode).toBeUndefined();
  });

  it('henter begrunnelse bare fra K9-vilkåret og perioden med samme fom og tom', () => {
    const annenPeriode = { fom: '2024-01-01', tom: '2024-12-31' };
    const resultat = utledUnntakV2Props(
      [
        { vilkarType: { kode: 'FP_VK_2' }, perioder: [{ periode, begrunnelse: 'Annet vilkår' }] },
        k9Vilkår('Annen periode', annenPeriode),
      ],
      behandling({ K9_VILKÅRET: [{ periode }] }),
    );
    expect(resultat.periode).toEqual(periode);
    expect(resultat.begrunnelse).toBeUndefined();
  });

  it('forkaster behandlingsresultat som ikke er en kjent verdi', () => {
    const resultat = utledUnntakV2Props([], behandling({ K9_VILKÅRET: [{ periode }] }, 'UKJENT'));
    expect(resultat.behandlingResultatType).toBeUndefined();
    expect(
      utledUnntakV2Props([], behandling({ K9_VILKÅRET: [{ periode }] }, undefined)).behandlingResultatType,
    ).toBeUndefined();
  });
});
