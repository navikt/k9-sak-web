import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Loader } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { addLegacySerializerOption } from '../../utils/axios/axiosUtils.js';
import { type SubmitValues, VurderNyoppstartet } from './VurderNyoppstartet.js';
import { AppError } from '../../app/errorhandling/AppError.js';

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
    error,
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
    erNyoppstartet: nyoppstartetData?.erNyoppstartet ?? undefined,
    fom: nyoppstartetData?.fom ?? null,
  };

  if (isFetching) {
    return <Loader />;
  }
  if (isError) {
    if (error != null) {
      throw error;
    } else {
      throw new AppError({ message: 'isError var true, men error var undefined' });
    }
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
