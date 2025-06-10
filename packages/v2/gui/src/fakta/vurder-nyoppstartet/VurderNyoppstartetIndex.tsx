import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Loader } from '@navikt/ds-react';
import type { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import NetworkErrorPage from '../../app/feilmeldinger/NetworkErrorPage.js';
import { type SubmitValues, VurderNyoppstartet } from './VurderNyoppstartet.js';
import { addLegacySerializerOption } from '../../utils/axios/axiosUtils.js';

interface VurderNyoppstartetIndexProps {
  behandlingUUID: string;
  submitCallback: (data: SubmitValues[]) => void;
  harApneAksjonspunkter: boolean;
  readOnly: boolean;
  aksjonspunkter: AksjonspunktDto[];
}

interface NyoppstartetData {
  erNyoppstartet: boolean | null;
  fom: string | null;
}

export const VurderNyoppstartetIndex = ({
  behandlingUUID,
  submitCallback,
  harApneAksjonspunkter,
  readOnly,
  aksjonspunkter,
}: VurderNyoppstartetIndexProps) => {
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktCodes.VURDER_NYOPPSTARTET);

  const {
    data: nyoppstartetData,
    isFetching,
    isError,
  } = useQuery<NyoppstartetData>({
    queryKey: ['nyoppstartet', behandlingUUID],
    queryFn: () =>
      axios
        .get(
          '/k9/sak/api/behandling/nyoppstartet',
          addLegacySerializerOption({ params: { behandlingUuid: behandlingUUID } }),
        )
        .then(({ data }) => data),
  });

  const formDefaultValues = {
    begrunnelse: aksjonspunkt?.begrunnelse ?? null,
    erNyoppstartet: nyoppstartetData?.erNyoppstartet ?? null,
    fom: nyoppstartetData?.fom ?? null,
  };

  if (isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <NetworkErrorPage />;
  }
  return (
    <VurderNyoppstartet
      submitCallback={submitCallback}
      harApneAksjonspunkter={harApneAksjonspunkter}
      readOnly={readOnly}
      formDefaultValues={formDefaultValues}
    />
  );
};
