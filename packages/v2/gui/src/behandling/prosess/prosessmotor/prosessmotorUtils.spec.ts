import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { BehandlingResultatType as behandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { VilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { SimuleringDto } from '@k9-sak-web/backend/k9sak/kontrakt/simulering/v1/SimuleringDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { describe, expect, test } from 'vitest';
import type { Delpanel, Steg, StegStatus } from './prosessmotorUtils.js';
import {
  byggMenysteg,
  byggVilkårSteg,
  beregnVedtakType,
  finnDelpanelStatus,
  finnProsessmenyType,
  finnSamletStatus,
  finnSimuleringStatus,
  finnVedtakStatus,
  harAksjonspunktSomKanLøses,
  SØKNADSFRIST_DELPANEL_ID,
  skalViseDelvisVedtakStatus,
} from './prosessmotorUtils.js';

const lagPeriode = (status: VilkårStatus, vurderesIBehandlingen = true) =>
  ({
    vilkarStatus: status,
    vurderesIBehandlingen,
    periode: { fom: '2024-01-01', tom: '2024-01-31' },
  }) satisfies NonNullable<VilkårMedPerioderDto['perioder']>[number];

const lagVilkår = (
  statuser: VilkårStatus[],
  vilkarType: VilkårMedPerioderDto['vilkarType'] = VilkårType.SØKNADSFRIST,
) =>
  ({
    vilkarType,
    perioder: statuser.map(status => lagPeriode(status)),
    relevanteInnvilgetMerknader: [],
  }) satisfies VilkårMedPerioderDto;

const lagAksjonspunkt = (
  definisjon: AksjonspunktDto['definisjon'] = AksjonspunktDefinisjon.FATTER_VEDTAK,
  kanLoses = true,
  status: AksjonspunktDto['status'] = aksjonspunktStatus.OPPRETTET,
) => ({ definisjon, kanLoses, status }) satisfies AksjonspunktDto;

const lagDelpanel = (id: string, status: StegStatus, vilkår: VilkårMedPerioderDto[] = []): Delpanel => ({
  id,
  vilkår,
  aksjonspunkter: [],
  status,
});

const lagSteg = (
  id: string,
  status: StegStatus,
  options: { delpaneler?: Delpanel[]; påvirkesIkkeAvStopp?: boolean } = {},
) =>
  ({
    id,
    label: id,
    delpaneler: options.delpaneler ?? [lagDelpanel(id, status)],
    ...(options.påvirkesIkkeAvStopp === undefined ? {} : { påvirkesIkkeAvStopp: options.påvirkesIkkeAvStopp }),
  }) satisfies Steg;

const lagBehandling = (kode?: string) => (kode === undefined ? {} : { behandlingsresultat: { type: { kode } } });

const vedtaksAksjonspunkter = [AksjonspunktDefinisjon.FORESLÅ_VEDTAK, AksjonspunktDefinisjon.FATTER_VEDTAK];

const simulering = {
  simuleringResultat: { periode: { fom: '2024-01-01', tom: '2024-01-31' } },
  simuleringResultatUtenInntrekk: { periode: { fom: '2024-01-01', tom: '2024-01-31' } },
  slåttAvInntrekk: false,
} satisfies SimuleringDto;

describe('finnDelpanelStatus', () => {
  test('ser bort fra perioder som ikke vurderes i behandlingen', () => {
    const vilkår = {
      ...lagVilkår([vilkårStatus.OPPFYLT]),
      perioder: [lagPeriode(vilkårStatus.OPPFYLT), lagPeriode(vilkårStatus.IKKE_OPPFYLT, false)],
    } satisfies VilkårMedPerioderDto;

    expect(finnDelpanelStatus([vilkår], [])).toBe(vilkårStatus.OPPFYLT);
  });

  test('returnerer IKKE_VURDERT når ingen perioder kan vurderes', () => {
    expect(finnDelpanelStatus([{ ...lagVilkår([vilkårStatus.OPPFYLT]), perioder: [] }], [])).toBe(
      vilkårStatus.IKKE_VURDERT,
    );
    expect(
      finnDelpanelStatus(
        [{ ...lagVilkår([vilkårStatus.OPPFYLT]), perioder: [lagPeriode(vilkårStatus.OPPFYLT, false)] }],
        [],
      ),
    ).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('returnerer IKKE_VURDERT når en vurderbar periode ikke er vurdert', () => {
    expect(finnDelpanelStatus([lagVilkår([vilkårStatus.OPPFYLT, vilkårStatus.IKKE_VURDERT])], [])).toBe(
      vilkårStatus.IKKE_VURDERT,
    );
  });

  test('returnerer OPPFYLT ved en blanding av oppfylt og ikke oppfylt', () => {
    expect(finnDelpanelStatus([lagVilkår([vilkårStatus.OPPFYLT, vilkårStatus.IKKE_OPPFYLT])], [])).toBe(
      vilkårStatus.OPPFYLT,
    );
  });

  test('returnerer IKKE_OPPFYLT når alle vurderbare perioder er avslått', () => {
    expect(finnDelpanelStatus([lagVilkår([vilkårStatus.IKKE_OPPFYLT, vilkårStatus.IKKE_OPPFYLT])], [])).toBe(
      vilkårStatus.IKKE_OPPFYLT,
    );
  });

  test('returnerer IKKE_VURDERT for vilkår uten vurderbare perioder selv om det finnes aksjonspunkt', () => {
    const åpentAksjonspunkt = lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK);
    expect(
      finnDelpanelStatus(
        [{ ...lagVilkår([vilkårStatus.OPPFYLT]), perioder: [lagPeriode(vilkårStatus.OPPFYLT, false)] }],
        [åpentAksjonspunkt],
      ),
    ).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('uten vilkår returneres IKKE_VURDERT for åpent aksjonspunkt', () => {
    expect(finnDelpanelStatus([], [lagAksjonspunkt()])).toBe(vilkårStatus.IKKE_VURDERT);
  });

  test('uten vilkår returneres OPPFYLT når alle aksjonspunkt er lukket', () => {
    expect(
      finnDelpanelStatus([], [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK, true, aksjonspunktStatus.UTFØRT)]),
    ).toBe(vilkårStatus.OPPFYLT);
  });

  test('uten vilkår eller aksjonspunkt returneres IKKE_VURDERT', () => {
    expect(finnDelpanelStatus([], [])).toBe(vilkårStatus.IKKE_VURDERT);
  });
});

describe('finnSamletStatus', () => {
  test('IKKE_OPPFYLT vinner over de andre delpanelstatusene', () => {
    expect(
      finnSamletStatus([
        lagDelpanel('oppfylt', vilkårStatus.OPPFYLT),
        lagDelpanel('ikke-vurdert', vilkårStatus.IKKE_VURDERT),
        lagDelpanel('avslått', vilkårStatus.IKKE_OPPFYLT),
      ]),
    ).toBe(vilkårStatus.IKKE_OPPFYLT);
  });

  test('returnerer OPPFYLT når alle delpaneler er oppfylt', () => {
    expect(
      finnSamletStatus([lagDelpanel('første', vilkårStatus.OPPFYLT), lagDelpanel('andre', vilkårStatus.OPPFYLT)]),
    ).toBe(vilkårStatus.OPPFYLT);
  });

  test('returnerer IKKE_VURDERT når et delpanel ikke er vurdert', () => {
    expect(
      finnSamletStatus([
        lagDelpanel('oppfylt', vilkårStatus.OPPFYLT),
        lagDelpanel('ventende', vilkårStatus.IKKE_VURDERT),
      ]),
    ).toBe(vilkårStatus.IKKE_VURDERT);
  });
});

describe('aksjonspunkter som kan løses', () => {
  test('gir warning for åpent aksjonspunkt som kan løses', () => {
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK, true)];
    expect(harAksjonspunktSomKanLøses(aksjonspunkter)).toBe(true);
    expect(finnProsessmenyType(vilkårStatus.OPPFYLT, harAksjonspunktSomKanLøses(aksjonspunkter))).toBe(
      ProcessMenuStepType.warning,
    );
  });

  test('gir ikke warning for åpent aksjonspunkt som ikke kan løses', () => {
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK, false)];
    expect(harAksjonspunktSomKanLøses(aksjonspunkter)).toBe(false);
    expect(finnProsessmenyType(vilkårStatus.OPPFYLT, harAksjonspunktSomKanLøses(aksjonspunkter))).toBe(
      ProcessMenuStepType.success,
    );
  });
});

describe('byggVilkårSteg', () => {
  test('utelater delpaneler for vilkår som ikke finnes i behandlingen', () => {
    const steg = byggVilkårSteg(
      {
        id: 'vilkar',
        label: 'Vilkår',
        delpaneler: [
          { id: 'alder', vilkår: [VilkårType.ALDERSVILKÅR], aksjonspunkter: [] },
          { id: 'søknadsfrist', vilkår: [VilkårType.SØKNADSFRIST], aksjonspunkter: [] },
        ],
      },
      [lagVilkår([vilkårStatus.OPPFYLT], VilkårType.ALDERSVILKÅR)],
      [],
    );

    expect(steg?.delpaneler.map(delpanel => delpanel.id)).toEqual(['alder']);
  });

  test('returnerer undefined når ingen delpaneler har vilkår i behandlingen', () => {
    expect(
      byggVilkårSteg(
        {
          id: 'vilkar',
          label: 'Vilkår',
          delpaneler: [{ id: 'alder', vilkår: [VilkårType.ALDERSVILKÅR], aksjonspunkter: [] }],
        },
        [],
        [],
      ),
    ).toBeUndefined();
  });
});

describe('byggMenysteg', () => {
  test.each([vilkårStatus.IKKE_OPPFYLT, vilkårStatus.IKKE_VURDERT])(
    'stanser varig etter et steg med status %s',
    status => {
      const menysteg = byggMenysteg([
        lagSteg('første', status),
        lagSteg('andre', vilkårStatus.OPPFYLT),
        lagSteg('tredje', vilkårStatus.OPPFYLT),
      ]);
      const typeForFørsteSteg =
        status === vilkårStatus.IKKE_OPPFYLT ? ProcessMenuStepType.danger : ProcessMenuStepType.default;

      expect(menysteg.map(steg => steg.type)).toEqual([
        typeForFørsteSteg,
        ProcessMenuStepType.default,
        ProcessMenuStepType.default,
      ]);
      expect(menysteg.map(steg => steg.erVurdert)).toEqual([status !== vilkårStatus.IKKE_VURDERT, false, false]);
    },
  );

  test('stanser ikke når forrige steg bare har søknadsfrist som ikke er oppfylt', () => {
    const menysteg = byggMenysteg([
      lagSteg('inngang', vilkårStatus.IKKE_OPPFYLT, {
        delpaneler: [
          lagDelpanel(SØKNADSFRIST_DELPANEL_ID, vilkårStatus.IKKE_OPPFYLT),
          lagDelpanel('alder', vilkårStatus.OPPFYLT),
        ],
      }),
      lagSteg('senere', vilkårStatus.OPPFYLT),
    ]);

    expect(menysteg.map(steg => steg.type)).toEqual([ProcessMenuStepType.danger, ProcessMenuStepType.success]);
  });

  test('et unntatt grønt steg etter avslag lar neste steg fortsette som i gammel rigg', () => {
    const menysteg = byggMenysteg([
      lagSteg('avslått', vilkårStatus.IKKE_OPPFYLT),
      lagSteg('unntatt', vilkårStatus.OPPFYLT, { påvirkesIkkeAvStopp: true }),
      lagSteg('neste', vilkårStatus.OPPFYLT),
    ]);

    expect(menysteg.map(steg => steg.type)).toEqual([
      ProcessMenuStepType.danger,
      ProcessMenuStepType.success,
      ProcessMenuStepType.success,
    ]);
  });

  test('viser delvis vilkårsstatus bare på grønne steg', () => {
    const delviseVilkår = [lagVilkår([vilkårStatus.OPPFYLT, vilkårStatus.IKKE_OPPFYLT])];
    const menysteg = byggMenysteg([
      lagSteg('grønt', vilkårStatus.OPPFYLT, {
        delpaneler: [lagDelpanel('grønt', vilkårStatus.OPPFYLT, delviseVilkår)],
      }),
      lagSteg('rødt', vilkårStatus.IKKE_OPPFYLT, {
        delpaneler: [lagDelpanel('rødt', vilkårStatus.IKKE_OPPFYLT, delviseVilkår)],
      }),
      lagSteg('ikke-vurdert', vilkårStatus.IKKE_VURDERT, {
        delpaneler: [lagDelpanel('ikke-vurdert', vilkårStatus.IKKE_VURDERT, delviseVilkår)],
      }),
    ]);

    expect(menysteg.map(steg => steg.usePartialStatus)).toEqual([true, false, false]);
  });
});

describe('vedtaksstatus', () => {
  test('uten vilkår er status IKKE_VURDERT', () => {
    expect(finnVedtakStatus([], [], lagBehandling(behandlingResultatType.INNVILGET), vedtaksAksjonspunkter)).toBe(
      vilkårStatus.IKKE_VURDERT,
    );
    expect(beregnVedtakType([], [], lagBehandling(behandlingResultatType.INNVILGET), vedtaksAksjonspunkter)).toBe(
      ProcessMenuStepType.default,
    );
  });

  test('en IKKE_VURDERT-periode gir status IKKE_VURDERT', () => {
    const vilkår = [lagVilkår([vilkårStatus.IKKE_VURDERT])];
    expect(finnVedtakStatus(vilkår, [], lagBehandling(behandlingResultatType.INNVILGET), vedtaksAksjonspunkter)).toBe(
      vilkårStatus.IKKE_VURDERT,
    );
  });

  test('et åpent aksjonspunkt utenfor vedtakslisten gir status IKKE_VURDERT', () => {
    const vilkår = [lagVilkår([vilkårStatus.OPPFYLT])];
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)];
    expect(
      finnVedtakStatus(vilkår, aksjonspunkter, lagBehandling(behandlingResultatType.INNVILGET), vedtaksAksjonspunkter),
    ).toBe(vilkårStatus.IKKE_VURDERT);
    expect(
      beregnVedtakType(vilkår, aksjonspunkter, lagBehandling(behandlingResultatType.INNVILGET), vedtaksAksjonspunkter),
    ).toBe(ProcessMenuStepType.default);
  });

  test('et åpent aksjonspunkt i vedtakslisten blokkerer ikke statusen', () => {
    const vilkår = [lagVilkår([vilkårStatus.OPPFYLT])];
    const aksjonspunkter = [lagAksjonspunkt(AksjonspunktDefinisjon.FATTER_VEDTAK)];
    const behandling = lagBehandling(behandlingResultatType.INNVILGET);

    expect(finnVedtakStatus(vilkår, aksjonspunkter, behandling, vedtaksAksjonspunkter)).toBe(vilkårStatus.OPPFYLT);
    expect(beregnVedtakType(vilkår, aksjonspunkter, behandling, vedtaksAksjonspunkter)).toBe(
      ProcessMenuStepType.warning,
    );
  });

  test('manglende behandlingsresultat gir status IKKE_VURDERT', () => {
    expect(finnVedtakStatus([lagVilkår([vilkårStatus.OPPFYLT])], [], lagBehandling(), vedtaksAksjonspunkter)).toBe(
      vilkårStatus.IKKE_VURDERT,
    );
  });

  test.each([
    behandlingResultatType.AVSLÅTT,
    behandlingResultatType.KLAGE_AVVIST,
    behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET,
  ])('%s behandlingsresultat gir status IKKE_OPPFYLT og rød vedtaksstatus', kode => {
    const status = finnVedtakStatus(
      [lagVilkår([vilkårStatus.IKKE_OPPFYLT])],
      [],
      lagBehandling(kode),
      vedtaksAksjonspunkter,
    );

    expect(status).toBe(vilkårStatus.IKKE_OPPFYLT);
    expect(
      beregnVedtakType([lagVilkår([vilkårStatus.IKKE_OPPFYLT])], [], lagBehandling(kode), vedtaksAksjonspunkter),
    ).toBe(ProcessMenuStepType.danger);
  });

  test('andre behandlingsresultater enn avslag gir status OPPFYLT', () => {
    const status = finnVedtakStatus(
      [lagVilkår([vilkårStatus.OPPFYLT])],
      [],
      lagBehandling(behandlingResultatType.INNVILGET),
      vedtaksAksjonspunkter,
    );

    expect(status).toBe(vilkårStatus.OPPFYLT);
    expect(
      beregnVedtakType(
        [lagVilkår([vilkårStatus.OPPFYLT])],
        [],
        lagBehandling(behandlingResultatType.INNVILGET),
        vedtaksAksjonspunkter,
      ),
    ).toBe(ProcessMenuStepType.success);
  });
});

describe('skalViseDelvisVedtakStatus', () => {
  test('viser delvis status ved både oppfylt og ikke oppfylt vilkår', () => {
    expect(
      skalViseDelvisVedtakStatus([lagVilkår([vilkårStatus.OPPFYLT]), lagVilkår([vilkårStatus.IKKE_OPPFYLT])]),
    ).toBe(true);
  });

  test('viser ikke delvis status uten både oppfylt og ikke oppfylt vilkår', () => {
    expect(skalViseDelvisVedtakStatus([lagVilkår([vilkårStatus.OPPFYLT])])).toBe(false);
    expect(skalViseDelvisVedtakStatus([lagVilkår([vilkårStatus.IKKE_OPPFYLT])])).toBe(false);
    expect(skalViseDelvisVedtakStatus([lagVilkår([vilkårStatus.IKKE_VURDERT])])).toBe(false);
  });
});

describe('finnSimuleringStatus', () => {
  test('returnerer OPPFYLT når simuleringsresultat finnes', () => {
    expect(finnSimuleringStatus(simulering)).toBe(vilkårStatus.OPPFYLT);
  });

  test('returnerer IKKE_VURDERT når simuleringsresultat mangler', () => {
    expect(finnSimuleringStatus(null)).toBe(vilkårStatus.IKKE_VURDERT);
    expect(finnSimuleringStatus(undefined)).toBe(vilkårStatus.IKKE_VURDERT);
  });
});
