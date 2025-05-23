/* eslint-disable class-methods-use-this */
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { Behandling } from '@k9-sak-web/types';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProsessStegDef, ProsessStegPanelDef } from '../util/prosessSteg/ProsessStegDef';
import { ProsessStegPanelUtledet } from '../util/prosessSteg/ProsessStegUtledet';
import InngangsvilkarPanel from './InngangsvilkarPanel';

describe('<InngangsvilkarPanel>', () => {
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
    behandlingPåVent: false,
    behandlingHenlagt: false,
    links: [],
  };

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };

  const aksjonspunkter = [
    {
      definisjon: { kode: aksjonspunktCodes.AVKLAR_AKTIVITETER, kodeverk: 'BEHANDLING_DEF' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
      kanLoses: true,
      erAktivt: true,
    },
  ];

  const DummyComponent = props => props && <div />;

  const lagPanelDef = (id, aksjonspunktKoder, aksjonspunktTekstKoder) => {
    class PanelDef extends ProsessStegPanelDef {
      getId = () => id;

      getKomponent = props => <DummyComponent props={props} />;

      getAksjonspunktKoder = () => aksjonspunktKoder;

      getAksjonspunktTekstkoder = () => aksjonspunktTekstKoder;
    }
    return new PanelDef();
  };

  const lagStegDef = (urlKode, panelDef) => {
    class StegPanelDef extends ProsessStegDef {
      getUrlKode = () => urlKode;

      getTekstKode = () => urlKode;

      getPanelDefinisjoner = () => [panelDef];
    }
    return new StegPanelDef();
  };

  it('skal vise inngangsvilkår-panel medlemskap', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;

    const medlemskapPanelDef = lagPanelDef(
      'MEDLSEMSKAP',
      [aksjonspunktCodes.AVKLAR_AKTIVITETER],
      ['MEDLSEMSKAP.TEKST'],
    );
    const medlemskapStegDef = lagStegDef('MEDLSEMSKAP', medlemskapPanelDef);
    const utledetMedlemskapDelPanel = new ProsessStegPanelUtledet(
      medlemskapStegDef,
      medlemskapPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );

    const featureToggles = { BRUK_V2_VILKAR_OPPTJENING: true };

    const prosessStegData = [utledetMedlemskapDelPanel];

    renderWithIntl(
      <InngangsvilkarPanel
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        prosessStegData={prosessStegData}
        submitCallback={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
        featureToggles={featureToggles}
      />,
    );

    expect(screen.getByText('MEDLSEMSKAP.TEKST')).toBeInTheDocument();
  });

  it('skal vise aksjonspunkt-hjelpetekst med lenke for avventing av fakta-aksjonspunkt', async () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;

    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const fodselStegDef = lagStegDef('FODSEL', fodselPanelDef);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      fodselStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );

    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const featureToggles = { BRUK_V2_VILKAR_OPPTJENING: true };

    renderWithIntl(
      <InngangsvilkarPanel
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        prosessStegData={[utledetFodselDelPanel]}
        submitCallback={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        apentFaktaPanelInfo={{
          urlCode: 'MEDLEMSKAP',
          textCode: 'FAKTA_APENT',
        }}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
        featureToggles={featureToggles}
      />,
    );

    expect(screen.getByText('Avventer avklaring av fakta om')).toBeInTheDocument();
    expect(screen.getByText('FAKTA_APENT')).toBeInTheDocument();
    await userEvent.click(screen.getByText('FAKTA_APENT'));
    await waitFor(() => {
      expect(oppdaterProsessStegOgFaktaPanelIUrl.mock.calls.length).toBeGreaterThan(0);
    });
    const oppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(oppdaterKall).toHaveLength(1);
    expect(oppdaterKall[0]).toHaveLength(2);
    expect(oppdaterKall[0][0]).toBeUndefined();
    expect(oppdaterKall[0][1]).toEqual('MEDLEMSKAP');
  });
});
