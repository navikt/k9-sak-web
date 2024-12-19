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
        if (URL.createObjectURL) {
          window.open(URL.createObjectURL(response));
        }
      });
    }
  };
  return (
    <Button variant="primary" onClick={handleForhåndsvisButtonClick}>
      Forhåndsvis
    </Button>
  );
};
