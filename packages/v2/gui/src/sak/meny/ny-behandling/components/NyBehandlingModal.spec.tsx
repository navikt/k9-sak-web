import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { behandlingÅrsakType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingÅrsakType.js';
import { behandlingÅrsakType as tilbakekrevingBehandlingÅrsakType } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/BehandlingÅrsakType.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import {
  getBehandlingAarsaker,
  getBehandlingTyper,
  getEnabledBehandlingstyper,
  type BehandlingOppretting,
} from './NyBehandlingModal';

describe('<NyBehandlingModal>', () => {
  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype TILBAKEKREVING_REVURDERING', () => {
    const behandlingArsakerK9Tilbake = [
      {
        kode: tilbakekrevingBehandlingÅrsakType.RE_KLAGE_KA,
        navn: 'RE_KLAGE_KA',
        kodeverk: '',
      },
      {
        kode: tilbakekrevingBehandlingÅrsakType.RE_KLAGE_NFP,
        navn: 'RE_KLAGE_KA',
        kodeverk: '',
      },
      {
        kode: tilbakekrevingBehandlingÅrsakType.RE_VILKÅR,
        navn: 'Nye opplysninger om vilkårsvurdering',
        kodeverk: '',
      },
      {
        kode: tilbakekrevingBehandlingÅrsakType.RE_FORELDELSE,
        navn: 'Nye opplysninger om foreldelse',
        kodeverk: '',
      },
      {
        kode: tilbakekrevingBehandlingÅrsakType.RE_FEILUTBETALT_BELØP_REDUSERT,
        navn: 'Feilutbetalt beløp helt eller delvis bortfalt',
        kodeverk: '',
      },
    ];
    const bType = BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING;

    const behandlingÅrsakerK9Sak = [] as KodeverkObject[];

    const res = getBehandlingAarsaker(behandlingÅrsakerK9Sak, behandlingArsakerK9Tilbake, bType);

    expect(res).toEqual(expect.arrayContaining([behandlingArsakerK9Tilbake[3], behandlingArsakerK9Tilbake[2]]));
  });

  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype REVURDERING', () => {
    const behandlingÅrsakerK9Sak = [
      {
        kode: behandlingÅrsakType.ANNET,
        navn: 'annet',
        kodeverk: '',
      },
      {
        kode: behandlingÅrsakType.FEIL_I_LOVANDVENDELSE,
        navn: 'feil i lovandvendelse',
        kodeverk: '',
      },
      {
        kode: behandlingÅrsakType.FEIL_ELLER_ENDRET_FAKTA,
        navn: 'feil eller endret fakta',
        kodeverk: '',
      },
      {
        kode: behandlingÅrsakType.FEIL_REGELVERKSFORSTAELSE,
        navn: 'feil regelverksforstaelse',
        kodeverk: '',
      },
      {
        kode: behandlingÅrsakType.FEIL_PROSESSUELL,
        navn: 'feil prosessuell',
        kodeverk: '',
      },
    ] as KodeverkObject[];
    const bType = BehandlingTypeK9Klage.REVURDERING;
    const behandlingArsakerK9Tilbake = [] as KodeverkObject[];

    const res = getBehandlingAarsaker(behandlingÅrsakerK9Sak, behandlingArsakerK9Tilbake, bType);

    expect(res).toEqual(
      expect.arrayContaining([
        behandlingÅrsakerK9Sak[0],
        behandlingÅrsakerK9Sak[2],
        behandlingÅrsakerK9Sak[1],
        behandlingÅrsakerK9Sak[4],
        behandlingÅrsakerK9Sak[3],
      ]),
    );
  });

  it('skal finne filtrere behandlingstyper for kun fpsak', () => {
    const kodeverkFpSak = [
      {
        kode: BehandlingTypeK9Klage.TILBAKEKREVING,
        navn: 'tilbakekreving',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING,
        navn: 'revurdering',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        navn: 'forstegangssoknad',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

    const res = getBehandlingTyper(kodeverkFpSak);

    expect(res).toEqual(expect.arrayContaining([kodeverkFpSak[2], kodeverkFpSak[1]]));
  });

  it('skal filtrere bort tilbakekreving når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: BehandlingTypeK9Klage.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.KLAGE,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

    const behandlingOppretting = [
      {
        behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Klage.REVURDERING,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Klage.KLAGE,
        kanOppretteBehandling: true,
      },
    ] as BehandlingOppretting[];
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: false,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper(behandlingstyper, behandlingOppretting, kanTilbakekrevingOpprettes);

    expect(res).toEqual([behandlingstyper[2], behandlingstyper[3], behandlingstyper[4], behandlingstyper[1]]);
  });

  it('skal filtrere bort tilbakekreving-revurdering når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: BehandlingTypeK9Klage.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.KLAGE,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

    const behandlingOppretting = [
      {
        behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Klage.REVURDERING,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Klage.KLAGE,
        kanOppretteBehandling: true,
      },
    ] as BehandlingOppretting[];
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: false,
    };

    const res = getEnabledBehandlingstyper(behandlingstyper, behandlingOppretting, kanTilbakekrevingOpprettes);

    expect(res).toEqual([behandlingstyper[2], behandlingstyper[3], behandlingstyper[4], behandlingstyper[0]]);
  });

  it('skal filtrere bort førstegangsbehandling når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: BehandlingTypeK9Klage.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.KLAGE,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

    const behandlingOppretting = [
      {
        behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        kanOppretteBehandling: false,
      },
      {
        behandlingType: BehandlingTypeK9Klage.REVURDERING,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Klage.KLAGE,
        kanOppretteBehandling: true,
      },
    ] as BehandlingOppretting[];
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper(behandlingstyper, behandlingOppretting, kanTilbakekrevingOpprettes);

    expect(res).toEqual([behandlingstyper[3], behandlingstyper[4], behandlingstyper[0], behandlingstyper[1]]);
  });

  it('skal filtrere bort revurdering når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: BehandlingTypeK9Klage.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: BehandlingTypeK9Klage.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

    const behandlingOppretting = [
      {
        behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Klage.REVURDERING,
        kanOppretteBehandling: false,
      },
      {
        behandlingType: BehandlingTypeK9Klage.KLAGE,
        kanOppretteBehandling: true,
      },
    ] as BehandlingOppretting[];

    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper(behandlingstyper, behandlingOppretting, kanTilbakekrevingOpprettes);

    expect(res).toEqual([behandlingstyper[2], behandlingstyper[0], behandlingstyper[1]]);
  });
});
