import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FetchedData from '../../types/fetchedDataTsType';
import UtvidetRettProsess from '../UtvidetRettProsess';
import utvidetRettTestData from './utvidetRettTestData';

const { aksjonspunkter, arbeidsgiverOpplysningerPerId, behandling, fagsak, fagsakPerson, rettigheter, vilkar, soknad } =
  utvidetRettTestData;

describe('<UtvidetRettProsess>', () => {
  const fetchedData: Partial<FetchedData> = {
    aksjonspunkter,
    vilkar,
    rammevedtak: [],
    soknad,
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <UtvidetRettProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="uttak"
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        oppdaterBehandlingVersjon={vi.fn()}
        opneSokeside={vi.fn()}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'default', textCode: 'default' }}
        setBehandling={vi.fn()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Omsorgen For' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Utvidet Rett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vedtak' })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    renderWithIntl(
      <UtvidetRettProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="default"
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={vi.fn()}
        opneSokeside={vi.fn()}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'default', textCode: 'default' }}
        setBehandling={vi.fn()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Utvidet Rett' }));
    });

    const oppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(oppdaterKall).toHaveLength(1);
    expect(oppdaterKall[0][0]).toEqual('utvidet_rett');
  });
});
