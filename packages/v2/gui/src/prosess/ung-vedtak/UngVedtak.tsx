import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/generated';
import { Button } from '@navikt/ds-react';
import type { UngVedtakBackendApiType } from './UngVedtakBackendApiType';

interface UngVedtakProps {
  api: UngVedtakBackendApiType;
  behandling: BehandlingDto;
}

export const UngVedtak = ({ api, behandling }: UngVedtakProps) => {
  const handleForhåndsvisButtonClick = () => {
    if (behandling.id) {
      api.forhåndsvisVedtaksbrev(behandling.id);
    }
  };
  return (
    <Button variant="primary" onClick={handleForhåndsvisButtonClick}>
      Forhåndsvis
    </Button>
  );
};
