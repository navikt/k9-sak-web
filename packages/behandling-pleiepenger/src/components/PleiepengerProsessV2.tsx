import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useMemo, useState } from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { getForhandsvisCallback } from '@fpsak-frontend/utils/src/formidlingUtils';
import { FatterVedtakStatusModal, IverksetterVedtakStatusModal, Rettigheter } from '@k9-sak-web/behandling-felles';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { useBehandlingContext } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import { Behandling, Fagsak, FagsakPerson } from '@k9-sak-web/types';
import { Bleed, Box } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import { K9SakProsessBackendClient } from '../prosess/api/K9SakProsessBackendClient';
import { aksjonspunkterQueryOptions } from '../prosess/api/k9SakQueryOptions';
import { useProsessmotor } from '../prosess/api/Prosessmotor';
import {
  BeregningsgrunnlagProsessStegInitPanel,
  type BeregningsgrunnlagProsessStegInitPanelProps,
} from '../prosess/BeregningsgrunnlagProsessStegInitPanel';
import { InngangsvilkarFortsProsessStegInitPanel } from '../prosess/inngangsvilkårFortsetterPaneler/InngangsvilkarFortsProsessStegInitPanel';
import { InngangsvilkarProsessStegInitPanel } from '../prosess/inngangsvilkårPaneler/InngangsvilkarProsessStegInitPanel';
import { MedisinskVilkarProsessStegInitPanel } from '../prosess/MedisinskVilkarProsessStegInitPanel';
import { SimuleringProsessStegInitPanel } from '../prosess/SimuleringProsessStegInitPanel';
import { TilkjentYtelseProsessStegInitPanel } from '../prosess/TilkjentYtelseProsessStegInitPanel';
import { UttakProsessStegInitPanel } from '../prosess/UttakProsessStegInitPanel';
import { VedtakProsessStegInitPanel } from '../prosess/VedtakProsessStegInitPanel';
import FetchedData from '../types/FetchedData';
import { getForhandsvisFptilbakeCallback } from './PleiepengerProsess';
import styles from './pleiepengerProsessV2.module.css';

export interface PleiepengerProsessV2Props {
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  rettigheter: Rettigheter;
  data: FetchedData;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  visIverksetterVedtakModal: boolean;
  toggleIverksetterVedtakModal: Dispatch<SetStateAction<boolean>>;
  visFatterVedtakModal: boolean;
  toggleFatterVedtakModal: Dispatch<SetStateAction<boolean>>;
  lukkModalOgGåTilSøk: () => void;
  ToggleComponent: ReactNode;
  lagreAksjonspunkter: (data?: any) => Promise<any>;
  lagreOverstyrteAksjonspunkter: (data?: any) => Promise<any>;
  forhandsvisMelding: (data?: any) => Promise<any>;
  forhandsvisTilbakekrevingMelding: (data?: any) => Promise<any>;
  lagreDokumentdata: (data?: any) => Promise<any>;
  hentFritekstbrevHtmlCallback: (parameters: any) => Promise<any>;
}

export const PleiepengerProsessV2 = ({
  fagsak,
  fagsakPerson,
  behandling,
  rettigheter,
  data,
  oppdaterProsessStegOgFaktaPanelIUrl,
  visIverksetterVedtakModal,
  toggleIverksetterVedtakModal,
  visFatterVedtakModal,
  toggleFatterVedtakModal,
  lukkModalOgGåTilSøk,
  ToggleComponent,
  lagreAksjonspunkter,
  lagreOverstyrteAksjonspunkter,
  forhandsvisMelding,
  forhandsvisTilbakekrevingMelding,
  lagreDokumentdata,
  hentFritekstbrevHtmlCallback,
}: PleiepengerProsessV2Props) => {
  const { erBehandlingsdataUtdatert = false } = useBehandlingContext();
  const previewCallback = getForhandsvisCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling);

  const previewFptilbakeCallback = getForhandsvisFptilbakeCallback(
    forhandsvisTilbakekrevingMelding,
    fagsak,
    behandling,
  );

  const [formData, setFormData] = useState<BeregningsgrunnlagProsessStegInitPanelProps['formData']>();
  useEffect(() => {
    setFormData(undefined);
  }, [behandling.versjon]);

  const [vedtakFormState, setVedtakFormState] = useState<any>(null);
  const vedtakFormValue = useMemo(
    () => ({ vedtakFormState, setVedtakFormState }),
    [vedtakFormState, setVedtakFormState],
  );

  const k9SakProsessApi = useMemo(() => new K9SakProsessBackendClient(), []);
  const prosessteg = useProsessmotor({ api: k9SakProsessApi, behandling });
  const { isFetching: aksjonspunkterLaster } = useQuery(aksjonspunkterQueryOptions(k9SakProsessApi, behandling));

  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const onVedtakAksjonspunktBekreftet = (visIverksetterVedtakModal: boolean, visFatterVedtakModal: boolean) => {
    if (visFatterVedtakModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    }
  };

  const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status.kode;
  const isReadOnly = !rettigheter.writeAccess.isEnabled;

  return (
    <VedtakFormContext.Provider value={vedtakFormValue}>
      {ToggleComponent}
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={lukkModalOgGåTilSøk}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal && behandling.status.kode === behandlingStatus.FATTER_VEDTAK}
        lukkModal={lukkModalOgGåTilSøk}
        tekstkode="FatterVedtakStatusModal.ModalDescriptionPleiepenger"
      />

      {/* Behandlingen som sendes inn er forrige versjon mens nye data hentes, så aksjonspunktene for den er
          allerede i cache. Derfor må også erBehandlingsdataUtdatert sjekkes. */}
      <ProsessMeny
        steg={prosessteg}
        erKlar={!aksjonspunkterLaster && !erBehandlingsdataUtdatert}
        defaultPanelId={behandlingenErAvsluttet ? prosessStegCodes.VEDTAK : undefined}
      >
        <Bleed marginInline="space-24">
          <Box padding="space-16" className={styles.prosessmenyWrapper}>
            {prosessteg.map(steg => {
              if (steg.id === prosessStegCodes.INNGANGSVILKAR) {
                return (
                  <InngangsvilkarProsessStegInitPanel
                    key={steg.id}
                    submitCallback={bekreftAksjonspunktCallback}
                    overrideReadOnly={isReadOnly}
                    kanOverstyreAccess={rettigheter.kanOverstyreAccess}
                    kanEndrePåSøknadsopplysninger={rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet}
                    behandling={behandling}
                    api={k9SakProsessApi}
                  />
                );
              }
              if (steg.id === prosessStegCodes.MEDISINSK_VILKAR) {
                return (
                  <MedisinskVilkarProsessStegInitPanel key={steg.id} behandling={behandling} api={k9SakProsessApi} />
                );
              }
              if (steg.id === prosessStegCodes.OPPTJENING) {
                return (
                  <InngangsvilkarFortsProsessStegInitPanel
                    key={steg.id}
                    submitCallback={bekreftAksjonspunktCallback}
                    overrideReadOnly={isReadOnly}
                    kanOverstyreAccess={rettigheter.kanOverstyreAccess}
                    kanEndrePåSøknadsopplysninger={rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet}
                    behandling={behandling}
                    api={k9SakProsessApi}
                    isReadOnly={isReadOnly}
                    fagsak={fagsak}
                  />
                );
              }
              if (steg.id === prosessStegCodes.UTTAK) {
                return (
                  <UttakProsessStegInitPanel
                    key={steg.id}
                    behandling={behandling}
                    api={k9SakProsessApi}
                    kanOverstyreNå={rettigheter.kanOverstyreAccess.isEnabled}
                    harOverstyrerrolle={rettigheter.kanOverstyreAccess.employeeHasAccess}
                    isReadOnly={isReadOnly}
                  />
                );
              }
              if (steg.id === prosessStegCodes.TILKJENT_YTELSE) {
                return (
                  <TilkjentYtelseProsessStegInitPanel
                    key={steg.id}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    fagsak={fagsak}
                    isReadOnly={isReadOnly}
                    submitCallback={bekreftAksjonspunktCallback}
                  />
                );
              }
              if (steg.id === prosessStegCodes.SIMULERING) {
                return (
                  <SimuleringProsessStegInitPanel
                    api={k9SakProsessApi}
                    key={steg.id}
                    behandling={behandling}
                    aksjonspunkterMedKodeverk={data.aksjonspunkter}
                    fagsak={fagsak}
                    isReadOnly={isReadOnly}
                    submitCallback={bekreftAksjonspunktCallback}
                    previewFptilbakeCallback={previewFptilbakeCallback}
                  />
                );
              }
              if (steg.id === prosessStegCodes.BEREGNINGSGRUNNLAG) {
                return (
                  <BeregningsgrunnlagProsessStegInitPanel
                    key={steg.id}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    submitCallback={bekreftAksjonspunktCallback}
                    formData={formData}
                    setFormData={setFormData}
                    isReadOnly={isReadOnly}
                  />
                );
              }
              if (steg.id === prosessStegCodes.VEDTAK) {
                return (
                  <VedtakProsessStegInitPanel
                    key={steg.id}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
                    isReadOnly={isReadOnly}
                    submitCallback={bekreftAksjonspunktCallback}
                    previewCallback={previewCallback}
                    lagreDokumentdata={lagreDokumentdata}
                    onVedtakAksjonspunktBekreftet={onVedtakAksjonspunktBekreftet}
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
