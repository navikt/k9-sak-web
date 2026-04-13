import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { FatterVedtakStatusModal, IverksetterVedtakStatusModal, prosessStegHooks } from '@k9-sak-web/behandling-felles';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';
import { Bleed, Box } from '@navikt/ds-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { UngdomsytelseBehandlingApiKeys, restApiUngdomsytelseHooks } from '../data/ungdomsytelseBehandlingApi';
import { UngSakApi } from '../data/UngSakApi';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import { usePollBehandlingStatus } from '../hooks/usePollBehandlingStatus';
import { BeregningProsessStegInitPanel } from './prosess/BeregningProsessStegInitPanel';
import { ForutgåendeMedlemskapInitPanel } from './prosess/ForutgåendeMedlemskapInitPanel';
import { InngangsvilkårInitPanel } from './prosess/InngangsvilkårInitPanel';
import { VedtakProsessStegInitPanel } from './prosess/VedtakProsessStegInitPanel';
import { useProsessmotor } from './Prossesmotor';

interface OwnProps {
  api: UngSakApi;
  fagsak: Fagsak;
  behandling: BehandlingDto;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  setBehandling: (behandling: BehandlingDto) => void;
}

export const AktivitetspengerProsess = ({
  api,
  fagsak,
  behandling,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  setBehandling,
}: OwnProps) => {
  prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);
  const { pollTilBehandlingErKlar } = usePollBehandlingStatus(api, behandling, setBehandling);
  const { mutateAsync: lagreAksjonspunktMutation } = useMutation({
    mutationFn: (aksjonspunktData: BekreftedeAksjonspunkterDto) =>
      api.lagreAksjonspunkt({
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: aksjonspunktData.bekreftedeAksjonspunktDtoer,
      }),
    onSuccess: () => pollTilBehandlingErKlar(),
  });

  const { mutateAsync: lagreOverstyrteAksjonspunktMutation } = useMutation({
    mutationFn: (aksjonspunktData: BekreftetOgOverstyrteAksjonspunkterDto) =>
      api.lagreAksjonspunktOverstyr({
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: [],
        overstyrteAksjonspunktDtoer: aksjonspunktData.overstyrteAksjonspunktDtoer,
      }),
    onSuccess: () => pollTilBehandlingErKlar(),
  });

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

  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter: lagreAksjonspunktMutation,
    lagreOverstyrteAksjonspunkter: lagreOverstyrteAksjonspunktMutation,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const handleVedtakSubmit = async (
    aksjonspunktModels: { isVedtakSubmission: boolean; kode: string }[],
    aksjonspunkt: AksjonspunktDto[],
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
        tekstkode="Behandlingen er sendt til godkjenning."
      />
      <ProsessMeny steg={prosessteg}>
        <Bleed marginInline="space-20">
          <Box borderColor="neutral-subtle" borderWidth="1 0 0 0" padding="space-24" marginBlock="space-16">
            {prosessteg.map(steg => {
              const urlKode = steg.urlKode;
              if (urlKode === prosessStegCodes.VEDTAK) {
                return (
                  <VedtakProsessStegInitPanel
                    key={steg.urlKode}
                    api={api}
                    behandling={behandling}
                    hentFritekstbrevHtmlCallback={hentFriteksbrevHtml}
                    submitCallback={handleVedtakSubmit}
                  />
                );
              }
              if (urlKode === prosessStegCodes.BEREGNING) {
                return (
                  <BeregningProsessStegInitPanel
                    key={steg.urlKode}
                    api={api}
                    behandling={behandling}
                    submitCallback={handleVedtakSubmit}
                  />
                );
              }
              if (urlKode === prosessStegCodes.INNGANGSVILKAR) {
                return (
                  <InngangsvilkårInitPanel
                    api={api}
                    behandling={behandling}
                    submitCallback={bekreftAksjonspunktCallback}
                    key={steg.urlKode}
                  />
                );
              }
              if (urlKode === prosessStegCodes.FORUTGÅENDE_MEDLEMSKAP) {
                return (
                  <ForutgåendeMedlemskapInitPanel
                    api={api}
                    behandling={behandling}
                    submitCallback={bekreftAksjonspunktCallback}
                    key={steg.urlKode}
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
