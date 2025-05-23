import { oppslagKodeverkSomObjektK9Klage } from '../mocks/oppslagKodeverkSomObjektK9Klage.js';
import {
  BehandlingDtoStatus,
  type KodeverdiSomObjektBehandlingStatus,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import { K9KlageKodeverkoppslag } from './K9KlageKodeverkoppslag.js';
import { OrUndefined } from './GeneriskKodeverkoppslag.js';

describe('Kodeverkoppslag', () => {
  const oppslag = new K9KlageKodeverkoppslag(oppslagKodeverkSomObjektK9Klage);
  const behandlingStatusOppslagResultat: KodeverdiSomObjektBehandlingStatus = {
    kode: BehandlingDtoStatus.OPPRETTET,
    kodeverk: 'BEHANDLING_STATUS',
    navn: 'Opprettet',
    kilde: 'OPPRE',
  };
  it('skal returnere kodeverdi objekt for gitt kodeverdi enum', () => {
    const found: KodeverdiSomObjektBehandlingStatus | undefined = oppslag.behandlingStatuser(
      BehandlingDtoStatus.OPPRETTET,
      'or undefined',
    );
    expect(found).toEqual(behandlingStatusOppslagResultat);
  });

  it('skal returnere undefined for ugyldig kodeverdi når "or undefined" er gitt', () => {
    // @ts-expect-error Tester at ugyldig enum verdi gir undefined når 'or undefined' er satt (og typescript feil)
    const found: undefined = oppslag.behandlingStatuser('XOXO', OrUndefined);
    expect(found).toBeUndefined();
  });

  it("skal kaste feil ved ugyldig kodeverdi når 'or undefined' ikke er satt", () => {
    // @ts-expect-error Tester at ugyldig enum verdi kaster feil når 'or undefined' ikkje er satt (og typescript feil)
    expect(() => oppslag.aktivitetStatuser('XOXO')).toThrowError();
  });

  it('skal ikkje ha undefined som retur type', () => {
    const found: KodeverdiSomObjektBehandlingStatus = oppslag.behandlingStatuser(BehandlingDtoStatus.OPPRETTET);
    expect(found).toEqual(behandlingStatusOppslagResultat);
  });

  it('skal returnere objekt med korrekt navn property (forskjellig frå k9-sak navn)', () => {
    expect(oppslag.fagsakYtelseTyper('OMP_KS').navn).toEqual('Omsorgspenger - Utvidet rett Kronisk sykdom');
  });
});
