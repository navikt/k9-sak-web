import { Alert } from '@navikt/ds-react';
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { omPleietrengendeQueryOptions } from '../om-pleietrengende/api/omPleietrengendeQueryOptions.js';
import { useOmPleietrengendeApi } from '../om-pleietrengende/api/OmPleietrengendeApiContext.js';
import { omBarnetQueryOptions } from './api/omBarnetQueryOptions.js';
import { useOmBarnetApi } from './api/OmBarnetApiContext.js';
import type { BekreftRettVedDødAksjonspunkt } from './BekreftRettVedDødAksjonspunkt.js';
import { OmBarnetPanel } from './OmBarnetPanel.js';

interface OmBarnetFaktaIndexProps {
  behandlingUuid: string;
  readOnly: boolean;
  submittable: boolean;
  harAksjonspunkt: boolean;
  submitCallback: (aksjonspunkter: BekreftRettVedDødAksjonspunkt[]) => Promise<void>;
}

const OmBarnetFaktaIndex = ({
  behandlingUuid,
  readOnly,
  submittable,
  harAksjonspunkt,
  submitCallback,
}: OmBarnetFaktaIndexProps) => {
  const omPleietrengendeApi = useOmPleietrengendeApi();
  const omBarnetApi = useOmBarnetApi();
  const queryClient = useQueryClient();
  const rettVedDødQueryOptions = omBarnetQueryOptions(omBarnetApi, behandlingUuid);
  const [{ data: pleietrengende }, { data: rettVedDød }] = useSuspenseQueries({
    queries: [omPleietrengendeQueryOptions(omPleietrengendeApi, behandlingUuid), rettVedDødQueryOptions],
  });

  if (!pleietrengende) {
    return <Alert variant="info">Ingen opplysninger om barnet.</Alert>;
  }

  const bekreftRettVedDød = async (aksjonspunkt: BekreftRettVedDødAksjonspunkt) => {
    await submitCallback([aksjonspunkt]);
    // Venter på ny henting slik at panelet ikke viser utdatert vurdering etter lagring
    await queryClient.invalidateQueries({ queryKey: rettVedDødQueryOptions.queryKey, exact: true });
  };

  return (
    <OmBarnetPanel
      pleietrengende={pleietrengende}
      rettVedDød={rettVedDød}
      readOnly={readOnly || !harAksjonspunkt}
      submittable={submittable}
      bekreftRettVedDød={bekreftRettVedDød}
    />
  );
};

export default OmBarnetFaktaIndex;
