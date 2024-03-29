import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Behandling } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FetchedData from '../../types/fetchedDataTsType';
import UtvidetRettFakta from '../UtvidetRettFakta';
import utvidetRettTestData from './utvidetRettTestData';

const { aksjonspunkter, behandling, fagsak, fagsakPerson, rettigheter, vilkar, rammevedtak } = utvidetRettTestData;

describe('<UtvidetRettFakta>', () => {
  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      rammevedtak,
    };

    renderWithIntl(
      <UtvidetRettFakta
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={vi.fn()}
        setBehandling={vi.fn()}
        featureToggles={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Barn' })).toBeInTheDocument();
  });

  it('skal oppdatere url ved valg av faktapanel', async () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      rammevedtak,
    };

    renderWithIntl(
      <UtvidetRettFakta
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={vi.fn()}
        setBehandling={vi.fn()}
        featureToggles={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Barn' }));
    });
    const { calls } = oppdaterProsessStegOgFaktaPanelIUrl.mock;
    expect(calls).toHaveLength(1);
    const args = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('barn');
  });
});
