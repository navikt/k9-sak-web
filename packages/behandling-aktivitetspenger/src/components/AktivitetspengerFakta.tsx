import { useEffect, useState } from 'react';

import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Fagsak } from '@k9-sak-web/types';

import {
  ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FaktaMeny } from '@k9-sak-web/gui/behandling/fakta/FaktaMeny.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { useMutation } from '@tanstack/react-query';
import { UngSakBackendClient } from '../data/UngSakBackendClient';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import { usePollBehandlingStatus } from '../hooks/usePollBehandlingStatus';
import { TestFaktaPanel } from './fakta/TestFaktaPanel';
import { TestFaktaPanel2 } from './fakta/TestFaktaPanel2';
import { useFaktamotor } from './Faktamotor';

interface OwnProps {
  fagsak: Fagsak;
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  setBehandling: (behandling: ung_sak_kontrakt_behandling_BehandlingDto) => void;
  api: UngSakBackendClient;
}

export const AktivitetspengerFakta = ({
  api,
  behandling,
  fagsak,
  oppdaterProsessStegOgFaktaPanelIUrl,
  setBehandling,
}: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const { pollTilBehandlingErKlar } = usePollBehandlingStatus(api, behandling, setBehandling);
  const { mutateAsync: lagreAksjonspunktMutation } = useMutation({
    mutationFn: (aksjonspunktData: ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) =>
      api.lagreAksjonspunkt({
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: aksjonspunktData.bekreftedeAksjonspunktDtoer,
      }),
    onSuccess: () => pollTilBehandlingErKlar(),
  });

  const { mutateAsync: lagreOverstyrteAksjonspunktMutation } = useMutation({
    mutationFn: (aksjonspunktData: ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto) =>
      api.lagreAksjonspunktOverstyr({
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: [],
        overstyrteAksjonspunktDtoer: aksjonspunktData.overstyrteAksjonspunktDtoer,
      }),
    onSuccess: () => pollTilBehandlingErKlar(),
  });

  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter: lagreAksjonspunktMutation,
    lagreOverstyrteAksjonspunkter: lagreOverstyrteAksjonspunktMutation,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const [formData, setFormData] = useState({});
  const faktapaneler = useFaktamotor({ api, behandling });
  useEffect(() => {
    if (formData) {
      setFormData(undefined);
    }
  }, [behandling.versjon, formData]);

  return (
    <FaktaMeny paneler={faktapaneler}>
      <ErrorBoundary errorMessageCallback={addErrorMessage}>
        {faktapaneler.map(panel => {
          const urlKode = panel.urlKode;
          if (urlKode === faktaPanelCodes.MEDLEMSKAPSVILKARET) {
            return <TestFaktaPanel key={urlKode} api={api} behandling={behandling} />;
          }
          if (urlKode === faktaPanelCodes.BEREGNING) {
            return <TestFaktaPanel2 key={urlKode} api={api} behandling={behandling} />;
          }
          return null;
        })}
      </ErrorBoundary>
    </FaktaMeny>
  );
};
