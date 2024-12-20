import type { BehandlingDto, ForhåndsvisVedtaksbrevResponse } from '@k9-sak-web/backend/ungsak/generated';
import { Button } from '@navikt/ds-react';
import type { UngVedtakBackendApiType } from './UngVedtakBackendApiType';

interface UngVedtakProps {
  api: UngVedtakBackendApiType;
  behandling: BehandlingDto;
}

export const UngVedtak = ({ api, behandling }: UngVedtakProps) => {
  const handleForhåndsvisButtonClick = () => {
    if (behandling.id) {
      api.forhåndsvisVedtaksbrev(behandling.id).then((response: ForhåndsvisVedtaksbrevResponse) => {
        // Create a URL object from the PDF blob
        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

        // Open the PDF in a new tab
        window.open(fileURL, '_blank');
      });
    }
  };
  return (
    <Button variant="primary" onClick={handleForhåndsvisButtonClick}>
      Forhåndsvis
    </Button>
  );
};
