import { BarnDto, BarnType } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import { Rammevedtak } from '@k9-sak-web/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BarnFaktaIndex from './BarnFaktaIndex';

export default {
  title: 'omsorgspenger/fakta/BarnFaktaIndex',
  component: BarnFaktaIndex,
};

const nyQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const fakeApi = (data: { barn: BarnDto[]; rammevedtak: Rammevedtak[] }) => async () => data;

const barn: BarnDto[] = [
  {
    personIdent: '010116',
    fødselsdato: '2016-01-01',
    barnType: BarnType.VANLIG,
  },
];

const rammevedtak: Rammevedtak[] = [];

export const treBarn = () => (
  <QueryClientProvider client={nyQueryClient()}>
    <BarnFaktaIndex behandlingUuid="story-behandling" hentBarnOgRammevedtak={fakeApi({ barn, rammevedtak })} />
  </QueryClientProvider>
);

export const ingenBarn = () => (
  <QueryClientProvider client={nyQueryClient()}>
    <BarnFaktaIndex behandlingUuid="story-behandling" hentBarnOgRammevedtak={fakeApi({ barn: [], rammevedtak: [] })} />
  </QueryClientProvider>
);
