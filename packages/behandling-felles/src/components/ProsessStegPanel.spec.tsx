/* eslint-disable class-methods-use-this */
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import { ProsessStegDef, ProsessStegPanelDef } from '../util/prosessSteg/ProsessStegDef';
import { ProsessStegPanelUtledet, ProsessStegUtledet } from '../util/prosessSteg/ProsessStegUtledet';
import ProsessStegPanel from './ProsessStegPanel';

describe('<ProsessStegPanel>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak;

  const behandling = {
    id: 1,
    versjon: 1,
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      kodeverk: 'BEHANDLING_STATUS',
    },
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    },
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };

  const aksjonspunkter = [
    {
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        kodeverk: 'AKSJONSPUNKT_STATUS',
      },
      definisjon: {
        kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
        kodeverk: 'AKSJONSPUNKT_KODE',
      },
      kanLoses: true,
      erAktivt: true,
    },
  ];

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };

  const isReadOnlyCheck = () => false;

  const toggleOverstyring = () => undefined;

  const DummyComponent = props => props && <div />;

  const lagPanelDef = (id, aksjonspunktKoder, aksjonspunktTekstKoder) => {
    class PanelDef extends ProsessStegPanelDef {
      getId = () => '';

      getKomponent = props => <DummyComponent props={props} />;

      getAksjonspunktKoder = () => aksjonspunktKoder;

      getAksjonspunktTekstkoder = () => aksjonspunktTekstKoder;
    }
    return new PanelDef();
  };

  const lagStegDef = (urlKode, panelDefs) => {
    class StegPanelDef extends ProsessStegDef {
      getUrlKode = () => urlKode;

      getTekstKode = () => urlKode;

      getPanelDefinisjoner = () => panelDefs;
    }
    return new StegPanelDef();
  };

  it('skal vise panel for henlagt behandling når valgt panel er vedtakspanelet og behandling er henlagt', () => {
    const vedtakPanelDef = lagPanelDef(
      prosessStegCodes.VEDTAK,
      [aksjonspunktCodes.AVKLAR_AKTIVITETER],
      ['VEDTAK.TEKST'],
    );
    const vedtakStegDef = lagStegDef(prosessStegCodes.VEDTAK, [vedtakPanelDef]);
    const utledetVedtakDelPanel = new ProsessStegPanelUtledet(
      vedtakStegDef,
      vedtakPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetVedtakSteg = new ProsessStegUtledet(vedtakStegDef, [utledetVedtakDelPanel]);

    renderWithIntl(
      <ProsessStegPanel
        valgtProsessSteg={utledetVedtakSteg}
        fagsak={fagsak}
        behandling={
          {
            ...behandling,
            behandlingHenlagt: true,
          } as Behandling
        }
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        lagringSideeffekterCallback={vi.fn()}
        lagreAksjonspunkter={vi.fn()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );
    expect(screen.getByText('Behandlingen er henlagt')).toBeInTheDocument();
  });

  it('skal vise panel for steg ikke behandlet når steget ikke er behandlet og saken ikke er henlagt', () => {
    const vedtakPanelDef = lagPanelDef(
      prosessStegCodes.VEDTAK,
      [aksjonspunktCodes.AVKLAR_AKTIVITETER],
      ['VEDTAK.TEKST'],
    );
    const vedtakStegDef = lagStegDef(prosessStegCodes.VEDTAK, [vedtakPanelDef]);
    const utledetVedtakDelPanel = new ProsessStegPanelUtledet(
      vedtakStegDef,
      vedtakPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetVedtakSteg = new ProsessStegUtledet(vedtakStegDef, [utledetVedtakDelPanel]);

    renderWithIntl(
      <ProsessStegPanel
        valgtProsessSteg={utledetVedtakSteg}
        fagsak={fagsak}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        lagringSideeffekterCallback={vi.fn()}
        lagreAksjonspunkter={vi.fn()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );
    expect(screen.getByText('Dette steget er ikke behandlet')).toBeInTheDocument();
  });

  it('skal vise panel for inngangsvilkår når det er data for flere panel', () => {
    const fodselAksjonspunkter = [
      {
        ...aksjonspunkter[0],
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'AKSJONSPUNKT_KODE',
        },
      },
    ];
    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const omsorgPanelDef = lagPanelDef('OMSORG', [], ['OMSORG.TEKST']);
    const inngangsvilkarStegDef = lagStegDef(prosessStegCodes.INNGANGSVILKAR, [fodselPanelDef, omsorgPanelDef]);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      fodselAksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetOmsorgDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      omsorgPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetInngangsvilkarSteg = new ProsessStegUtledet(inngangsvilkarStegDef, [
      utledetFodselDelPanel,
      utledetOmsorgDelPanel,
    ]);

    const { container } = renderWithIntl(
      <ProsessStegPanel
        valgtProsessSteg={utledetInngangsvilkarSteg}
        fagsak={fagsak}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        lagringSideeffekterCallback={vi.fn()}
        lagreAksjonspunkter={vi.fn()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    expect(screen.getByText('FODSEL.TEKST')).toBeInTheDocument();
    expect(container.getElementsByClassName('prosesspunkt').length).toBe(1);
  });

  it('skal vise kun vise ett panel', () => {
    const fodselAksjonspunkter = [
      {
        ...aksjonspunkter[0],
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
          kodeverk: 'AKSJONSPUNKT_KODE',
        },
      },
    ];
    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const inngangsvilkarStegDef = lagStegDef(prosessStegCodes.INNGANGSVILKAR, [fodselPanelDef]);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      inngangsvilkarStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      fodselAksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetInngangsvilkarSteg = new ProsessStegUtledet(inngangsvilkarStegDef, [utledetFodselDelPanel]);

    const { container } = renderWithIntl(
      <ProsessStegPanel
        valgtProsessSteg={utledetInngangsvilkarSteg}
        fagsak={fagsak}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        lagringSideeffekterCallback={vi.fn()}
        lagreAksjonspunkter={vi.fn()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    expect(container.getElementsByClassName('prosesspunkt').length).toBe(1);
  });
});
