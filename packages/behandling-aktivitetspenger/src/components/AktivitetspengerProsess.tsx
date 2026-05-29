import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { DataFetchPendingModal } from '@fpsak-frontend/shared-components';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { FatterVedtakStatusModal, IverksetterVedtakStatusModal, prosessStegHooks } from '@k9-sak-web/behandling-felles';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Bleed, Box } from '@navikt/ds-react';
import { useCallback, useMemo, useState } from 'react';
import { UngdomsytelseBehandlingApiKeys, restApiUngdomsytelseHooks } from '../data/ungdomsytelseBehandlingApi';
import { usePollBehandlingStatus } from '../hooks/usePollBehandlingStatus';
import { BeregnetUtbetalingStegInitPanel } from './prosess/BeregnetUtbetalingStegInitPanel';
import { BeregningProsessStegInitPanel } from './prosess/BeregningProsessStegInitPanel';
import { ForutgåendeMedlemskapInitPanel } from './prosess/ForutgåendeMedlemskapInitPanel';
import { InngangsvilkårInitPanel } from './prosess/InngangsvilkårInitPanel';
import { OpphørInitPanel } from './prosess/OpphørInitPanel';
import { VedtakProsessStegInitPanel } from './prosess/VedtakProsessStegInitPanel';
import { useProsessmotor } from './Prosessmotor';

interface OwnProps {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  setBehandling: (behandling: BehandlingDto) => void;
}

export const AktivitetspengerProsess = ({
  api,
  behandling,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  setBehandling,
}: OwnProps) => {
  prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);
  const { pollTilBehandlingErKlar, isPolling } = usePollBehandlingStatus(api, behandling, setBehandling);

  const { startRequest: hentFriteksbrevHtml } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
  );

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);

  const [vedtakFormState, setVedtakFormState] = useState<any>(null);
  const vedtakFormValue = useMemo(
    () => ({ vedtakFormState, setVedtakFormState }),
    [vedtakFormState, setVedtakFormState],
  );

  const prosessteg = useProsessmotor({ api, behandling });

  const lukkModalOgGåTilSøk = useCallback(() => {
    toggleIverksetterVedtakModal(false);
    toggleFatterVedtakModal(false);
    opneSokeside();
  }, [opneSokeside]);

  const onAksjonspunktBekreftet = async () => {
    await pollTilBehandlingErKlar();
    oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
  };

  const onVedtakAksjonspunktBekreftet = async (visIverksetterVedtakModal: boolean, visFatterVedtakModal: boolean) => {
    await pollTilBehandlingErKlar();
    if (visFatterVedtakModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    }
  };

  return (
    <VedtakFormContext.Provider value={vedtakFormValue}>
      {isPolling && <DataFetchPendingModal pendingMessage="Venter på behandling..." />}
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={lukkModalOgGåTilSøk}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal && behandling.status === behandlingStatus.FATTER_VEDTAK}
        lukkModal={lukkModalOgGåTilSøk}
        tekstkode="Behandlingen er sendt til godkjenning."
      />
      <ProsessMeny steg={prosessteg}>
        <Bleed marginInline="space-20">
          <Box borderColor="neutral-subtle" borderWidth="1 0 0 0" padding="space-24" marginBlock="space-16">
            {prosessteg.map(steg => {
              if (steg.id === prosessStegCodes.VEDTAK) {
                return (
                  <VedtakProsessStegInitPanel
                    key={steg.id}
                    api={api}
                    behandling={behandling}
                    hentFritekstbrevHtmlCallback={hentFriteksbrevHtml}
                    onVedtakAksjonspunktBekreftet={onVedtakAksjonspunktBekreftet}
                  />
                );
              }
              if (steg.id === prosessStegCodes.BEREGNING) {
                return <BeregningProsessStegInitPanel key={steg.id} api={api} behandling={behandling} />;
              }
              if (steg.id === prosessStegCodes.INNGANGSVILKAR) {
                return (
                  <InngangsvilkårInitPanel
                    key={steg.id}
                    api={api}
                    behandling={behandling}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                  />
                );
              }
              if (steg.id === prosessStegCodes.OPPHØR) {
                return (
                  <OpphørInitPanel
                    key={steg.id}
                    api={api}
                    behandling={behandling}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                  />
                );
              }
              if (steg.id === prosessStegCodes.FORUTGAENDE_MEDLEMSKAP) {
                return (
                  <ForutgåendeMedlemskapInitPanel
                    key={steg.id}
                    api={api}
                    behandling={behandling}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                  />
                );
              }
              if (steg.id === prosessStegCodes.BEREGNET_UTBETALING) {
                return (
                  <BeregnetUtbetalingStegInitPanel
                    key={steg.id}
                    api={api}
                    behandling={behandling}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                  />
                );
              }

              return null;
            })}
          </Box>
        </Bleed>
      </ProsessMeny>
    </VedtakFormContext.Provider>
  );
};
