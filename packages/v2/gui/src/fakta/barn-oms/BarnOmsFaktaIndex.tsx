import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useBarnOmsApi } from './api/BarnOmsApiContext.js';
import { barnOmsQueryOptions } from './api/barnOmsQueryOptions.js';
import { BarnOmsFakta } from './BarnOmsFakta.js';

export interface BarnOmsFaktaIndexProps {
  behandlingUuid: string;
  behandlingVersjon: number;
  fagsakYtelseType?: FagsakYtelsesType;
}

const BarnOmsFaktaIndex = ({ behandlingUuid, behandlingVersjon, fagsakYtelseType }: BarnOmsFaktaIndexProps) => {
  const api = useBarnOmsApi();
  const { data } = useSuspenseQuery(barnOmsQueryOptions(api, behandlingUuid, behandlingVersjon));
  return <BarnOmsFakta barn={data.barn} rammevedtak={data.rammevedtak} fagsakYtelseType={fagsakYtelseType} />;
};

export default BarnOmsFaktaIndex;
