import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.ts';
import { Loader } from '@navikt/ds-react';
import { type SubmitValues, VurderNyoppstartet } from './VurderNyoppstartet.tsx';
import type { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';

interface VurderNyoppstartetIndexProps {
  behandlingUUID: string;
  submitCallback: (data: SubmitValues[]) => void;
  harApneAksjonspunkter: boolean;
  readOnly: boolean;
  aksjonspunkter: AksjonspunktDto[];
}

export const VurderNyoppstartetIndex = ({
  behandlingUUID,
  submitCallback,
  harApneAksjonspunkter,
  readOnly,
  aksjonspunkter,
}:VurderNyoppstartetIndexProps) => {
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktCodes.VURDER_NYOPPSTARTET);

  const { data: nyoppstartetData, isFetching } = useQuery({
    queryKey: ['nyoppstartet', behandlingUUID],
    queryFn: () => axios.get('/k9/sak/api/behandling/nyoppstartet', { params: { behandlingUuid: behandlingUUID}}).then(({ data }) => data),
  });

  const formDefaultValues = {
    begrunnelse: aksjonspunkt?.begrunnelse ?? null,
    erNyoppstartet: nyoppstartetData?.erNyoppstartet ?? null,
    fom: nyoppstartetData?.fom ?? null,
  }

  if (isFetching) {
    return <Loader/>
  } return <VurderNyoppstartet submitCallback={submitCallback} harApneAksjonspunkter={harApneAksjonspunkter} readOnly={readOnly} formDefaultValues={formDefaultValues}/>
}
