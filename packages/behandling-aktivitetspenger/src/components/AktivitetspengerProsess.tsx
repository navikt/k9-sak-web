import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Rettigheter, prosessStegHooks, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import { FatterVedtakStatusModal } from '@k9-sak-web/gui/shared/fatterVedtakStatusModal/FatterVedtakStatusModal.js';
import { IverksetterVedtakStatusModal } from '@k9-sak-web/gui/shared/iverksetterVedtakStatusModal/IverksetterVedtakStatusModal.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { Box } from '@navikt/ds-react';
import { useCallback, useMemo, useState } from 'react';
import { UngdomsytelseBehandlingApiKeys, restApiUngdomsytelseHooks } from '../data/ungdomsytelseBehandlingApi';
import { UngSakBackendClient } from '../data/UngSakBackendClient';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import { BeregningProsessStegInitPanel } from './prosess/BeregningProsessStegInitPanel';
import { VedtakProsessStegInitPanel } from './prosess/VedtakProsessStegInitPanel';
import { useProsessmotor } from './Prossesmotor';

interface OwnProps {
  fagsak: Fagsak;
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  rettigheter: Rettigheter;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  setBehandling: (behandling: Behandling) => void;
}

export const AktivitetspengerProsess = ({
  fagsak,
  behandling,
  rettigheter,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  setBehandling,
}: OwnProps) => {
  prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(UngdomsytelseBehandlingApiKeys.SAVE_AKSJONSPUNKT);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(UngdomsytelseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);

  const { startRequest: forhandsvisMelding } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.PREVIEW_MESSAGE,
  );
  const { startRequest: forhandsvisTilbakekrevingMelding } = restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(
    UngdomsytelseBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  );
  const { startRequest: hentFriteksbrevHtml } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);

  const [vedtakFormState, setVedtakFormState] = useState<any>(null);
  const vedtakFormValue = useMemo(
    () => ({ vedtakFormState, setVedtakFormState }),
    [vedtakFormState, setVedtakFormState],
  );

  const ungSakApi = useMemo(() => new UngSakBackendClient(), []);

  const prosessteg = useProsessmotor({ api: ungSakApi, behandling });
  const isReadOnly = !rettigheter.writeAccess.isEnabled;

  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const handleVedtakSubmit = async (
    aksjonspunktModels: { isVedtakSubmission: boolean; kode: string }[],
    aksjonspunkt: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  ) => {
    const fatterVedtakAksjonspunktkoder = [
      aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
      aksjonspunktCodes.FATTER_VEDTAK,
      aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    ];
    const visIverksetterVedtakModal = aksjonspunktModels.some(
      ap => ap.isVedtakSubmission && fatterVedtakAksjonspunktkoder.includes(ap.kode),
    );
    const visFatterVedtakModal =
      aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;

    await bekreftAksjonspunktCallback(
      aksjonspunktModels,
      aksjonspunkt,
      visIverksetterVedtakModal || visFatterVedtakModal,
    );

    if (visFatterVedtakModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    }
  };

  const lukkModalOgGåTilSøk = useCallback(() => {
    toggleIverksetterVedtakModal(false);
    toggleFatterVedtakModal(false);
    opneSokeside();
  }, [opneSokeside]);

  return (
    <VedtakFormContext.Provider value={vedtakFormValue}>
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={lukkModalOgGåTilSøk}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal && behandling.status === behandlingStatus.FATTER_VEDTAK}
        lukkModal={lukkModalOgGåTilSøk}
        tekst="Behandlingen er sendt til godkjenning."
      />
      <ProsessMeny steg={prosessteg}>
        <Box borderColor="neutral-subtle" borderWidth="1" padding="space-16">
          {prosessteg.map(steg => {
            const urlKode = steg.urlKode;
            if (urlKode === prosessStegCodes.VEDTAK) {
              return (
                <VedtakProsessStegInitPanel
                  key={steg.urlKode}
                  api={ungSakApi}
                  behandling={behandling}
                  hentFritekstbrevHtmlCallback={hentFriteksbrevHtml}
                  isReadOnly={isReadOnly}
                  submitCallback={handleVedtakSubmit}
                />
              );
            }
            if (urlKode === prosessStegCodes.BEREGNING) {
              return <BeregningProsessStegInitPanel key={steg.urlKode} />;
            }
            return null;
          })}
        </Box>
      </ProsessMeny>
    </VedtakFormContext.Provider>
  );
};
