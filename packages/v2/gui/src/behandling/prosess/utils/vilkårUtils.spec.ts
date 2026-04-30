import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { describe, expect, test } from 'vitest';
import {
  AksjonspunktDefinisjon,
  finnPanelStatus,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_kodeverk_vilkår_Utfall,
  k9_kodeverk_vilkår_VilkårType,
  sjekkDelvisVilkårStatus,
} from './vilkårUtils';

const periode = (fom: string, tom: string) => ({ fom, tom });

describe('sjekkDelvisVilkårStatus', () => {
  test('returnerer false når vilkårForSteg er tom', () => {
    expect(sjekkDelvisVilkårStatus([])).toBe(false);
  });

  test('returnerer false når alle perioder er oppfylt', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(false);
  });

  test('returnerer false når alle perioder er ikke oppfylt', () => {
    const vilkår = [
      {
        perioder: [
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(false);
  });

  test('returnerer false når alle perioder er ikke vurdert', () => {
    const vilkår = [
      {
        perioder: [
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_VURDERT,
            periode: periode('', ''),
          },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_VURDERT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(false);
  });

  test('returnerer true når én periode er oppfylt og én er ikke oppfylt', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(true);
  });

  test('returnerer true når én periode er oppfylt og én er ikke vurdert', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_VURDERT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(true);
  });

  test('returnerer true når én periode er ikke oppfylt og én er ikke vurdert', () => {
    const vilkår = [
      {
        perioder: [
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_VURDERT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(true);
  });

  test('ignorerer perioder der vurderesIBehandlingen er false', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
          // Denne skal ignoreres – blanding ville ellers gitt true
          {
            vurderesIBehandlingen: false,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    // Kun én periode teller (oppfylt) → harFlereVilkår = false → false
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(false);
  });

  test('returnerer false når det kun er én relevant periode', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(false);
  });

  test('kombinerer perioder på tvers av flere vilkår', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
      {
        perioder: [
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.ALDERSVILKÅR,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(sjekkDelvisVilkårStatus(vilkår)).toBe(true);
  });
});

describe('finnPanelStatus', () => {
  test('returnerer default når skalVisePanel er false', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(finnPanelStatus(false, vilkår, [], [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer warning når det finnes et åpent aksjonspunkt', () => {
    const aksjonspunkter = [
      {
        definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
        status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
      },
    ];
    expect(
      finnPanelStatus(true, [], aksjonspunkter, [AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]),
    ).toBe(ProcessMenuStepType.warning);
  });

  test('returnerer ikke warning for lukket aksjonspunkt', () => {
    const aksjonspunkter = [
      {
        definisjon: AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
        status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.UTFØRT,
      },
    ];
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(
      finnPanelStatus(true, vilkår, aksjonspunkter, [AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]),
    ).toBe(ProcessMenuStepType.success);
  });

  test('returnerer ikke warning for aksjonspunkt som ikke er i relevanteAksjonspunktkoder', () => {
    const aksjonspunkter = [
      {
        definisjon: AksjonspunktDefinisjon.ÅRSKVANTUM_FOSTERBARN,
        status: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
      },
    ];
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(
      finnPanelStatus(true, vilkår, aksjonspunkter, [AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]),
    ).toBe(ProcessMenuStepType.success);
  });

  test('returnerer success når minst én periode er oppfylt', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(finnPanelStatus(true, vilkår, [], [])).toBe(ProcessMenuStepType.success);
  });

  test('returnerer danger når alle perioder er ikke oppfylt', () => {
    const vilkår = [
      {
        perioder: [
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_OPPFYLT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(finnPanelStatus(true, vilkår, [], [])).toBe(ProcessMenuStepType.danger);
  });

  test('returnerer default når noen perioder er ikke vurdert', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: true, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
          {
            vurderesIBehandlingen: true,
            vilkarStatus: k9_kodeverk_vilkår_Utfall.IKKE_VURDERT,
            periode: periode('', ''),
          },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(finnPanelStatus(true, vilkår, [], [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når vilkårForSteg er tom', () => {
    expect(finnPanelStatus(true, [], [], [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når ingen perioder har vurderesIBehandlingen=true', () => {
    const vilkår = [
      {
        perioder: [
          { vurderesIBehandlingen: false, vilkarStatus: k9_kodeverk_vilkår_Utfall.OPPFYLT, periode: periode('', '') },
        ],
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(finnPanelStatus(true, vilkår, [], [])).toBe(ProcessMenuStepType.default);
  });

  test('returnerer default når perioder er undefined', () => {
    const vilkår = [
      {
        perioder: undefined,
        vilkarType: k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST,
        relevanteInnvilgetMerknader: [],
      },
    ];
    expect(finnPanelStatus(true, vilkår as any, [], [])).toBe(ProcessMenuStepType.default);
  });
});
