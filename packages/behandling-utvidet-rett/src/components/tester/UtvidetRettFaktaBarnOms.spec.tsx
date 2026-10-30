import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { qFeatureToggles } from '@k9-sak-web/gui/featuretoggles/k9/featureToggles.js';
import { Behandling, Personopplysninger } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import FetchedData from '../../types/fetchedDataTsType';
import UtvidetRettFakta from '../UtvidetRettFakta';
import utvidetRettTestData from './utvidetRettTestData';

vi.mock('@k9-sak-web/gui/fakta/barn-oms/BarnOmsFakta.js', () => ({
  BarnOmsFakta: ({ barn }: { barn: { personIdent?: string }[] }) => (
    <div data-testid="barn-oms-v2">{barn.map(b => b.personIdent).join(',')}</div>
  ),
}));

const { aksjonspunkter, behandling, fagsak, fagsakPerson, rettigheter, vilkar, rammevedtak } = utvidetRettTestData;

const personopplysninger = {
  barn: [{ fnr: '01011012345', fodselsdato: '2010-01-01' }],
  barnSoktFor: [{ fnr: '03031598765', fodselsdato: '2015-03-03' }],
} as Personopplysninger;

const renderBarnPanel = (BRUK_V2_BARN_OMS: boolean) => {
  const fetchedData: Partial<FetchedData> = { aksjonspunkter, vilkar, rammevedtak, personopplysninger };
  renderWithIntl(
    <UtvidetRettFakta
      data={fetchedData as FetchedData}
      behandling={behandling as Behandling}
      fagsak={fagsak}
      fagsakPerson={fagsakPerson}
      rettigheter={rettigheter}
      alleKodeverk={{}}
      oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
      valgtFaktaSteg="barn"
      valgtProsessSteg="default"
      hasFetchError={false}
      setApentFaktaPanel={vi.fn()}
      setBehandling={vi.fn()}
      featureToggles={{ ...qFeatureToggles, BRUK_V2_BARN_OMS }}
      arbeidsgiverOpplysningerPerId={{}}
    />,
  );
};

describe('<UtvidetRettFakta> barnepanel', () => {
  it('sender feature toggles videre og viser v2 med barnet det er søkt for ved kronisk sykt barn', () => {
    renderBarnPanel(true);

    expect(screen.getByTestId('barn-oms-v2')).toHaveTextContent(/^03031598765$/);
  });

  it('viser v1 når feature toggle er av', () => {
    renderBarnPanel(false);

    expect(screen.queryByTestId('barn-oms-v2')).not.toBeInTheDocument();
    expect(screen.getByText('03031598765', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('01011012345', { exact: false })).not.toBeInTheDocument();
  });
});
