import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { FatterVedtakStatusModal, IverksetterVedtakStatusModal, prosessStegHooks } from '@k9-sak-web/behandling-felles';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import { UngSakApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/UngSakApi.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Bleed, Box } from '@navikt/ds-react';
import { useCallback, useMemo, useState } from 'react';
import { UngdomsytelseBehandlingApiKeys, restApiUngdomsytelseHooks } from '../data/ungdomsytelseBehandlingApi';
import { usePollBehandlingStatus } from '../hooks/usePollBehandlingStatus';
import { BeregningProsessStegInitPanel } from './prosess/BeregningProsessStegInitPanel';
import { ForutgåendeMedlemskapInitPanel } from './prosess/ForutgåendeMedlemskapInitPanel';
import { InngangsvilkårInitPanel } from './prosess/InngangsvilkårInitPanel';
import { VedtakProsessStegInitPanel } from './prosess/VedtakProsessStegInitPanel';
import { useProsessmotor } from './Prossesmotor';

interface OwnProps {
  api: UngSakApi;
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
  const { pollTilBehandlingErKlar } = usePollBehandlingStatus(api, behandling, setBehandling);

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
                    onVedtakAksjonspunktBekreftet={onVedtakAksjonspunktBekreftet}
                  />
                );
              }
              if (urlKode === prosessStegCodes.BEREGNING) {
                return (
                  <BeregningProsessStegInitPanel
                    key={steg.urlKode}
                    api={api}
                    behandling={behandling}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                  />
                );
              }
              if (urlKode === prosessStegCodes.INNGANGSVILKAR) {
                return (
                  <InngangsvilkårInitPanel
                    api={api}
                    behandling={behandling}
                    key={steg.urlKode}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                  />
                );
              }
              if (urlKode === prosessStegCodes.FORUTGAENDE_MEDLEMSKAP) {
                return (
                  <ForutgåendeMedlemskapInitPanel
                    api={api}
                    behandling={behandling}
                    key={steg.urlKode}
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
