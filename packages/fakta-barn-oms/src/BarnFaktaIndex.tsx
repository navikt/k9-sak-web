import { behandlingÅrskvantumUttak_getBarnOgRammevedtak } from '@k9-sak-web/backend/k9sak/api/behandlingÅrskvantumUttak.js';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { Rammevedtak } from '@k9-sak-web/types';
import { useQuery } from '@tanstack/react-query';
import BarnFakta from './BarnFakta';

type HentBarnOgRammevedtak = (behandlingUuid: string) => Promise<{ barn: BarnDto[]; rammevedtak: Rammevedtak[] }>;

interface BarnFaktaIndexProps {
  behandlingUuid: string;
  fagsaksType?: FagsakYtelsesType;
  hentBarnOgRammevedtak?: HentBarnOgRammevedtak;
}

const hentBarnOgRammevedtakFraApi: HentBarnOgRammevedtak = async behandlingUuid => {
  const response = await behandlingÅrskvantumUttak_getBarnOgRammevedtak({ query: { behandlingUuid } });
  return {
    barn: response.data?.barn ?? [],
    rammevedtak: response.data?.rammevedtak ?? [],
  };
};

const BarnFaktaIndex = ({
  behandlingUuid,
  fagsaksType,
  hentBarnOgRammevedtak = hentBarnOgRammevedtakFraApi,
}: BarnFaktaIndexProps) => {
  const { data, isPending } = useQuery({
    queryKey: ['barn-og-rammevedtak', behandlingUuid],
    queryFn: () => hentBarnOgRammevedtak(behandlingUuid),
  });

  if (isPending || !data) {
    return <LoadingPanel />;
  }

  return <BarnFakta barn={data.barn} rammevedtak={data.rammevedtak} fagsaksType={fagsaksType} />;
};

export default BarnFaktaIndex;
