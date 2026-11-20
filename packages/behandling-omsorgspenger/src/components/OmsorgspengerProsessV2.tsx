import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useMemo, useState } from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { getForhandsvisCallback } from '@fpsak-frontend/utils/src/formidlingUtils';
import { FatterVedtakStatusModal, IverksetterVedtakStatusModal, Rettigheter } from '@k9-sak-web/behandling-felles';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import {
  BeregningsgrunnlagProsessStegInitPanel,
  type BeregningsgrunnlagProsessStegInitPanelProps,
} from '@k9-sak-web/behandling-felles/src/prosessV2/BeregningsgrunnlagProsessStegInitPanel';
import { SimuleringProsessStegInitPanel } from '@k9-sak-web/behandling-felles/src/prosessV2/SimuleringProsessStegInitPanel';
import { TilkjentYtelseProsessStegInitPanel } from '@k9-sak-web/behandling-felles/src/prosessV2/TilkjentYtelseProsessStegInitPanel';
import { useBekreftAksjonspunkt } from '@k9-sak-web/behandling-felles/src/prosessV2/useBekreftAksjonspunkt';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import { K9SakProsessBackendClient } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessBackendClient.js';
import { aksjonspunkterQueryOptions } from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';
import { useBehandlingContext } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { prosessStegCodes } from '@k9-sak-web/gui/utils/skjermlenke/prosessStegCodes.js';
import { Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import { Bleed, Box } from '@navikt/ds-react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useQuery } from '@tanstack/react-query';

import { OmsorgspengerBehandlingApiKeys, restApiOmsorgHooks } from '../data/omsorgspengerBehandlingApi';
import { InngangsvilkarProsessStegInitPanel } from '../prosess/InngangsvilkarProsessStegInitPanel';
import { useOmsorgspengerProsessmotor } from '../prosess/Prosessmotor';
import { UttakProsessStegInitPanel } from '../prosess/UttakProsessStegInitPanel';
import { VedtakProsessStegInitPanel } from '../prosess/VedtakProsessStegInitPanel';
import FetchedData from '../types/fetchedDataTsType';
import { getForhandsvisTilbakeCallback } from './OmsorgspengerProsess';
import styles from './omsorgspengerProsessV2.module.css';

export interface OmsorgspengerProsessV2Props {
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  rettigheter: Rettigheter;
  data: FetchedData;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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

export const OmsorgspengerProsessV2 = ({
  fagsak,
  fagsakPerson,
  behandling,
  rettigheter,
  data,
  alleKodeverk,
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
}: OmsorgspengerProsessV2Props) => {
  const { erBehandlingsdataUtdatert = false } = useBehandlingContext();
  const previewCallback = getForhandsvisCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling);
  const previewFptilbakeCallback = getForhandsvisTilbakeCallback(forhandsvisTilbakekrevingMelding, fagsak, behandling);

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
  const prosessteg = useOmsorgspengerProsessmotor({ api: k9SakProsessApi, behandling });
  const { isFetching: aksjonspunkterLaster } = useQuery(aksjonspunkterQueryOptions(k9SakProsessApi, behandling));

  const legacySimuleringData = restApiOmsorgHooks.useMultipleRestApi<{
    simuleringResultat: any;
    tilbakekrevingvalg: any;
  }>(
    [
      { key: OmsorgspengerBehandlingApiKeys.SIMULERING_RESULTAT },
      { key: OmsorgspengerBehandlingApiKeys.TILBAKEKREVINGVALG },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [behandling.versjon] },
  );

  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const onVedtakAksjonspunktBekreftet = (visIverksetterModal: boolean, visFatterModal: boolean) => {
    if (visFatterModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterModal) {
      toggleIverksetterVedtakModal(true);
    }
  };

  const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status.kode;
  const isReadOnly = !rettigheter.writeAccess.isEnabled;
  const vedtaksstegErOppfylt =
    prosessteg.find(steg => steg.id === prosessStegCodes.VEDTAK)?.type === ProcessMenuStepType.success;
  const fosterbarn = data.fosterbarn?.fosterbarn ?? [];

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
        tekstkode={
          vedtaksstegErOppfylt
            ? 'FatterVedtakStatusModal.SendtBeslutter'
            : 'FatterVedtakStatusModal.ModalDescriptionOMS'
        }
      />

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
                    alleKodeverk={alleKodeverk}
                    fosterbarn={fosterbarn}
                    submitCallback={bekreftAksjonspunktCallback}
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
              if (steg.id === prosessStegCodes.TILKJENT_YTELSE) {
                return (
                  <TilkjentYtelseProsessStegInitPanel
                    key={steg.id}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    fagsak={fagsak}
                    isReadOnly={isReadOnly}
                    submitCallback={bekreftAksjonspunktCallback}
                    kunV1
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
                    legacyData={legacySimuleringData.data}
                  />
                );
              }
              if (steg.id === prosessStegCodes.VEDTAK) {
                return (
                  <VedtakProsessStegInitPanel
                    key={steg.id}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    employeeHasAccess={rettigheter.kanOverstyreAccess.isEnabled}
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
