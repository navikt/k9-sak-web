import { AksjonspunktStatus, aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { describe, expect, it } from 'vitest';
import { beregnSimuleringType, beregnTilkjentYtelseType, beregnUttakType, beregnVedtakType } from './Prosessmotor';

const lagAksjonspunkt = (
  definisjon: AksjonspunktDefinisjon,
  status: AksjonspunktStatus = aksjonspunktStatus.OPPRETTET,
) => ({
  definisjon,
  status,
});

describe('beregnUttakType', () => {
  it('returnerer warning når det finnes et åpent uttak-aksjonspunkt', () => {
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK)];
    const resultat = beregnUttakType(aksjonspunkter, null, [AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK]);
    expect(resultat).toBe(ProcessMenuStepType.warning);
  });

  it('returnerer default når uttak er null', () => {
    const resultat = beregnUttakType([], null, []);
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer default når uttaksplan ikke har perioder', () => {
    const uttak = { uttaksplan: { perioder: {} } } as any;
    const resultat = beregnUttakType([], uttak, []);
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer danger når alle perioder er avslått', () => {
    const uttak = {
      uttaksplan: {
        perioder: {
          '2024-01-01/2024-01-31': { utfall: 'IKKE_OPPFYLT' },
          '2024-02-01/2024-02-28': { utfall: 'IKKE_OPPFYLT' },
        },
      },
    } as any;
    const resultat = beregnUttakType([], uttak, []);
    expect(resultat).toBe(ProcessMenuStepType.danger);
  });

  it('returnerer success når minst én periode er innvilget', () => {
    const uttak = {
      uttaksplan: {
        perioder: {
          '2024-01-01/2024-01-31': { utfall: 'OPPFYLT' },
          '2024-02-01/2024-02-28': { utfall: 'IKKE_OPPFYLT' },
        },
      },
    } as any;
    const resultat = beregnUttakType([], uttak, []);
    expect(resultat).toBe(ProcessMenuStepType.success);
  });
});

describe('beregnTilkjentYtelseType', () => {
  const panelKonfig = { aksjonspunkter: [AksjonspunktDefinisjon.VURDER_TILBAKETREKK] };

  it('returnerer default når beregningsresultat er null', () => {
    const resultat = beregnTilkjentYtelseType(null, panelKonfig, []);
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer default når perioder er tom', () => {
    const resultat = beregnTilkjentYtelseType({ perioder: [] } as any, panelKonfig, []);
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer warning når aksjonspunkt er åpent', () => {
    const beregningsresultat = { perioder: [{ dagsats: 100 }] } as any;
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_TILBAKETREKK)];
    const resultat = beregnTilkjentYtelseType(beregningsresultat, panelKonfig, aksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.warning);
  });
});

describe('beregnSimuleringType', () => {
  const simuleringAksjonspunkter = [
    AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
    AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
  ];

  it('returnerer warning når det finnes et åpent simulering-aksjonspunkt', () => {
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING)];
    const resultat = beregnSimuleringType(aksjonspunkter, null, simuleringAksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.warning);
  });

  it('ignorerer avsluttede aksjonspunkter', () => {
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING, aksjonspunktStatus.AVBRUTT)];
    const resultat = beregnSimuleringType(aksjonspunkter, null, simuleringAksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer success når simuleringResultat finnes og ingen åpne aksjonspunkter', () => {
    const resultat = beregnSimuleringType([], { mottakere: [] } as any, simuleringAksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.success);
  });

  it('returnerer default når simuleringResultat er null og ingen åpne aksjonspunkter', () => {
    const resultat = beregnSimuleringType([], null, simuleringAksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.default);
  });
});

describe('beregnVedtakType', () => {
  const vedtakAksjonspunkter = [AksjonspunktDefinisjon.FORESLÅ_VEDTAK, AksjonspunktDefinisjon.FATTER_VEDTAK];

  const lagVilkårMedStatus = (vilkarStatus: string) => ({
    vilkarType: 'SØKNADSFRIST',
    perioder: [{ vilkarStatus }],
  });

  it('returnerer default når vilkår er tom', () => {
    const resultat = beregnVedtakType(
      [],
      [],
      { uuid: 'x', versjon: 1, behandlingsresultat: undefined } as any,
      vedtakAksjonspunkter,
    );
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer default når et vilkår ikke er vurdert', () => {
    const vilkår = [lagVilkårMedStatus('IKKE_VURDERT')] as any;
    const resultat = beregnVedtakType(
      vilkår,
      [],
      { uuid: 'x', versjon: 1, behandlingsresultat: undefined } as any,
      vedtakAksjonspunkter,
    );
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer warning når et vedtaks-aksjonspunkt er åpent', () => {
    const vilkår = [lagVilkårMedStatus('OPPFYLT')] as any;
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.FORESLÅ_VEDTAK)];
    const resultat = beregnVedtakType(
      vilkår,
      aksjonspunkter,
      { uuid: 'x', versjon: 1, behandlingsresultat: undefined } as any,
      vedtakAksjonspunkter,
    );
    expect(resultat).toBe(ProcessMenuStepType.warning);
  });

  it('returnerer default når et ikke-vedtaks-aksjonspunkt er åpent', () => {
    const vilkår = [lagVilkårMedStatus('OPPFYLT')] as any;
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_LEGEERKLÆRING)];
    const resultat = beregnVedtakType(
      vilkår,
      aksjonspunkter,
      { uuid: 'x', versjon: 1, behandlingsresultat: undefined } as any,
      vedtakAksjonspunkter,
    );
    expect(resultat).toBe(ProcessMenuStepType.default);
  });

  it('returnerer success når behandlingsresultat er innvilget', () => {
    const vilkår = [lagVilkårMedStatus('OPPFYLT')] as any;
    const behandling = { uuid: 'x', versjon: 1, behandlingsresultat: { type: { kode: 'INNVILGET' } } } as any;
    const resultat = beregnVedtakType(vilkår, [], behandling, vedtakAksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.success);
  });
});

describe('simulering med uttak avslått', () => {
  const simuleringAksjonspunkter = [AksjonspunktDefinisjon.VURDER_FEILUTBETALING];

  it('beregnSimuleringType returnerer warning når aksjonspunkt er åpent, uavhengig av uttaksstatus', () => {
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_FEILUTBETALING)];
    const resultat = beregnSimuleringType(aksjonspunkter, null, simuleringAksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.warning);
  });

  it('beregnSimuleringType returnerer default når uttak er avslått og ingen aksjonspunkt', () => {
    const resultat = beregnSimuleringType([], null, simuleringAksjonspunkter);
    expect(resultat).toBe(ProcessMenuStepType.default);
  });
});
