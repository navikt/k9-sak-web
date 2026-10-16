import { useSuspenseQueries } from '@tanstack/react-query';
import { omPleietrengendeQueryOptions } from '../om-pleietrengende/api/omPleietrengendeQueryOptions.js';
import { useOmPleietrengendeApi } from '../om-pleietrengende/api/OmPleietrengendeApiContext.js';
import { omBarnetQueryOptions } from './api/omBarnetQueryOptions.js';
import { useOmBarnetApi } from './api/OmBarnetApiContext.js';
import type { BekreftRettVedDødAksjonspunkt } from './BekreftRettVedDødAksjonspunkt.js';
import { OmBarnetPanel } from './OmBarnetPanel.js';

interface OmBarnetFaktaIndexProps {
  behandlingUuid: string;
  behandlingVersjon: number;
  readOnly: boolean;
  submittable: boolean;
  harAksjonspunkt: boolean;
  submitCallback: (aksjonspunkter: BekreftRettVedDødAksjonspunkt[]) => Promise<void>;
}

const OmBarnetFaktaIndex = ({
  behandlingUuid,
  behandlingVersjon,
  readOnly,
  submittable,
  harAksjonspunkt,
  submitCallback,
}: OmBarnetFaktaIndexProps) => {
  const omPleietrengendeApi = useOmPleietrengendeApi();
  const omBarnetApi = useOmBarnetApi();
  const [{ data: pleietrengende }, { data: rettVedDød }] = useSuspenseQueries({
    queries: [
      omPleietrengendeQueryOptions(omPleietrengendeApi, behandlingUuid),
      omBarnetQueryOptions(omBarnetApi, behandlingUuid, behandlingVersjon),
    ],
  });

  return (
    <OmBarnetPanel
      pleietrengende={pleietrengende}
      rettVedDød={rettVedDød}
      readOnly={readOnly || !harAksjonspunkt}
      submittable={submittable}
      bekreftRettVedDød={aksjonspunkt => submitCallback([aksjonspunkt])}
    />
  );
};

export default OmBarnetFaktaIndex;
