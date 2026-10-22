import type { Aksjonspunkt } from '@k9-sak-web/types';
import type { Vilkar } from '@k9-sak-web/types';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårUtfallMerknad } from '@k9-sak-web/backend/k9sak/kodeverk/vilkår/VilkårUtfallMerknad.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import OpplaeringProsessIndex from '@k9-sak-web/gui/prosess/opplaering/OpplaeringProsessIndex.js';
import { prodFeatureToggles, qFeatureToggles } from '@k9-sak-web/gui/featuretoggles/k9/featureToggles.js';
import { describe, expect, it } from 'vitest';
import InstitusjonPanelDef from './InstitusjonPanelDef';
import LangvarigSykdomPanelDef from './LangvarigSykdomPanelDef';
import NødvendigOpplæringPanelDef from './NødvendigOpplæringPanelDef';
import { utledOpplaeringV2Props } from './utledOpplaeringV2Props';

const kodeverk = (kode: string) => ({ kode, kodeverk: 'TEST' });

const lagVilkår = (vilkarType: string): Vilkar => ({
  vilkarType: kodeverk(vilkarType),
  perioder: [
    {
      periode: { fom: '2020-03-01', tom: '2020-03-31' },
      vilkarStatus: kodeverk(vilkårStatus.IKKE_VURDERT),
      vurderesIBehandlingen: true,
      merknadParametere: {},
    },
  ],
  overstyrbar: false,
  relevanteInnvilgetMerknader: [],
});

const lagAksjonspunkt = (
  definisjon: Aksjonspunkt['definisjon']['kode'],
  status: Aksjonspunkt['status']['kode'],
): Aksjonspunkt => ({
  definisjon: kodeverk(definisjon),
  status: kodeverk(status),
  kanLoses: true,
  erAktivt: true,
});

const paneler = [
  {
    id: 'INSTITUSJON',
    vilkarType: VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON,
    aksjonspunktKoder: [AksjonspunktDefinisjon.VURDER_INSTITUSJON],
    create: () => new InstitusjonPanelDef(),
  },
  {
    id: 'LANGVARIG_SYKDOM',
    vilkarType: VilkårType.LANGVARIG_SYKDOM,
    aksjonspunktKoder: [AksjonspunktDefinisjon.VURDER_LANGVARIG_SYK],
    create: () => new LangvarigSykdomPanelDef(),
  },
  {
    id: 'NØDVENDIG_OPPLÆRING',
    vilkarType: VilkårType.NØDVENDIG_OPPLÆRING,
    aksjonspunktKoder: [AksjonspunktDefinisjon.VURDER_OPPLÆRING, AksjonspunktDefinisjon.VURDER_REISETID],
    create: () => new NødvendigOpplæringPanelDef(),
  },
] as const;

describe('opplæringspenger prosesspaneler', () => {
  it('slår på v2 kun i K9 Q', () => {
    expect(qFeatureToggles.BRUK_V2_PROSESS_OPPLAERING).toBe(true);
    expect(prodFeatureToggles.BRUK_V2_PROSESS_OPPLAERING).toBe(false);
  });

  it.each(paneler)('bruker v2-visningen for $id når togglen er på', panel => {
    const element = panel.create().getKomponent({
      featureToggles: { BRUK_V2_PROSESS_OPPLAERING: true },
      aksjonspunkter: panel.aksjonspunktKoder.map(kode => lagAksjonspunkt(kode, aksjonspunktStatus.OPPRETTET)),
      vilkar: [lagVilkår(panel.vilkarType)],
      visAllePerioder: true,
    });

    expect(element).toMatchObject({
      type: OpplaeringProsessIndex,
      props: {
        aksjonspunkter: panel.aksjonspunktKoder.map(definisjon => ({
          definisjon,
          status: aksjonspunktStatus.OPPRETTET,
        })),
        vilkarPanel: panel.id,
        visAllePerioder: true,
      },
    });
  });

  it.each(paneler)('beholder eksisterende v1-renderer for $id når togglen er av', panel => {
    const element = panel.create().getKomponent({
      featureToggles: { BRUK_V2_PROSESS_OPPLAERING: false },
      aksjonspunkter: [],
      vilkar: [lagVilkår(panel.vilkarType)],
    });

    expect(element).toMatchObject({ type: VilkarresultatMedOverstyringProsessIndex });
  });

  it('bruker gjeldende periode som standard i enkeltpanelsruten', () => {
    const element = new InstitusjonPanelDef().getKomponent({
      featureToggles: { BRUK_V2_PROSESS_OPPLAERING: true },
      aksjonspunkter: [],
      vilkar: [lagVilkår(VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON)],
    });

    expect(element).toMatchObject({
      type: OpplaeringProsessIndex,
      props: { vilkarPanel: 'INSTITUSJON', visAllePerioder: false },
    });
  });

  it('mapper legacy vilkår og aksjonspunktdata til generated DTO-er ved grensen', () => {
    const vilkar: Vilkar = {
      lovReferanse: '§ 9-14',
      vilkarType: kodeverk(VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON),
      perioder: [
        {
          periode: { fom: '2020-03-01', tom: '2020-03-31' },
          vilkarStatus: kodeverk(vilkårStatus.OPPFYLT),
          vurderesIBehandlingen: true,
          merknad: kodeverk(VilkårUtfallMerknad.UDEFINERT),
          merknadParametere: { grunnlag: 'test' },
        },
        {
          periode: { fom: '2020-01-01', tom: '2020-01-31' },
          vilkarStatus: kodeverk(vilkårStatus.IKKE_OPPFYLT),
          vurderesIBehandlingen: false,
          avslagKode: 'TEST_AVSLAG',
          begrunnelse: 'Testbegrunnelse',
          merknadParametere: {},
        },
      ],
      overstyrbar: true,
      relevanteInnvilgetMerknader: [{ merknad: kodeverk(VilkårUtfallMerknad.UDEFINERT), navn: 'Testmerknad' }],
    };
    const props = utledOpplaeringV2Props(
      {
        aksjonspunkter: [
          lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_INSTITUSJON, aksjonspunktStatus.OPPRETTET),
          lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_INSTITUSJON, aksjonspunktStatus.UTFØRT),
          lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_OPPLÆRING, aksjonspunktStatus.OPPRETTET),
        ],
        vilkar: [vilkar],
      },
      'INSTITUSJON',
    );

    expect(props).toEqual({
      aksjonspunkter: [{ definisjon: AksjonspunktDefinisjon.VURDER_INSTITUSJON, status: aksjonspunktStatus.OPPRETTET }],
      vilkar: [
        {
          lovReferanse: '§ 9-14',
          vilkarType: VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON,
          overstyrbar: true,
          relevanteInnvilgetMerknader: [{ merknad: VilkårUtfallMerknad.UDEFINERT, navn: 'Testmerknad' }],
          perioder: [
            {
              periode: { fom: '2020-03-01', tom: '2020-03-31' },
              vilkarStatus: vilkårStatus.OPPFYLT,
              vurderesIBehandlingen: true,
              merknad: VilkårUtfallMerknad.UDEFINERT,
              merknadParametere: { grunnlag: 'test' },
            },
            {
              periode: { fom: '2020-01-01', tom: '2020-01-31' },
              vilkarStatus: vilkårStatus.IKKE_OPPFYLT,
              vurderesIBehandlingen: false,
              avslagKode: 'TEST_AVSLAG',
              begrunnelse: 'Testbegrunnelse',
              merknadParametere: {},
            },
          ],
        },
      ],
      vilkarPanel: 'INSTITUSJON',
      visAllePerioder: false,
    });
  });
});
