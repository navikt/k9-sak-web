import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useMemo, useState } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { getForhandsvisCallback } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  FatterVedtakStatusModal,
  IverksetterVedtakStatusModal,
  Rettigheter,
  lagDokumentdata,
} from '@k9-sak-web/behandling-felles';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import { Behandling, Fagsak, FagsakPerson } from '@k9-sak-web/types';
import { Bleed, BoxNew } from '@navikt/ds-react';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@navikt/k9-sak-typescript-client/types';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegPleiepengerPanelDefinisjoner';
import { K9SakProsessBackendClient } from '../prosess/api/K9SakProsessBackendClient';
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

const PROSESS_STEG_KODER = {
  INNGANGSVILKAR: 'inngangsvilkar',
  MEDISINSK_VILKAR: 'medisinsk_vilkar',
  OPPTJENING: 'opptjening',
  UTTAK: 'uttak',
  TILKJENT_YTELSE: 'tilkjent_ytelse',
  SIMULERING: 'simulering',
  BEREGNINGSGRUNNLAG: 'beregningsgrunnlag',
  VEDTAK: 'vedtak',
} as const;

export interface PleiepengerProsessV2Props {
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  rettigheter: Rettigheter;
  data: FetchedData;
  hentBehandling: (params?: any, keepData?: boolean) => Promise<Behandling>;
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
  hentBehandling,
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

  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const handleVedtakSubmit = async (
    aksjonspunktModels: { isVedtakSubmission: boolean; kode: string }[],
    aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
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
    if (aksjonspunktModels[0].isVedtakSubmission) {
      const dokumentdata = lagDokumentdata(aksjonspunktModels[0]);
      if (dokumentdata) {
        await lagreDokumentdata(dokumentdata);
      }
    }
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

      <ProsessMeny steg={prosessteg}>
        <Bleed marginInline="space-24">
          <BoxNew borderColor="neutral-subtle" borderWidth="1" padding="space-16">
            {prosessStegPanelDefinisjoner.map(panelDef => {
              const urlKode = panelDef.getUrlKode();

              if (urlKode === PROSESS_STEG_KODER.INNGANGSVILKAR) {
                return (
                  <InngangsvilkarProsessStegInitPanel
                    key={urlKode}
                    submitCallback={bekreftAksjonspunktCallback}
                    overrideReadOnly={isReadOnly}
                    kanOverstyreAccess={rettigheter.kanOverstyreAccess}
                    kanEndrePåSøknadsopplysninger={rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet}
                    behandling={behandling}
                    api={k9SakProsessApi}
                  />
                );
              }
              if (urlKode === PROSESS_STEG_KODER.MEDISINSK_VILKAR) {
                return (
                  <MedisinskVilkarProsessStegInitPanel key={urlKode} behandling={behandling} api={k9SakProsessApi} />
                );
              }
              if (urlKode === PROSESS_STEG_KODER.OPPTJENING) {
                return (
                  <InngangsvilkarFortsProsessStegInitPanel
                    key={urlKode}
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
              if (urlKode === PROSESS_STEG_KODER.UTTAK) {
                return (
                  <UttakProsessStegInitPanel
                    key={urlKode}
                    behandling={behandling}
                    api={k9SakProsessApi}
                    hentBehandling={hentBehandling}
                    erOverstyrer={rettigheter.kanOverstyreAccess.isEnabled}
                    isReadOnly={isReadOnly}
                  />
                );
              }
              if (urlKode === PROSESS_STEG_KODER.TILKJENT_YTELSE) {
                return (
                  <TilkjentYtelseProsessStegInitPanel
                    key={urlKode}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    fagsak={fagsak}
                    isReadOnly={isReadOnly}
                    submitCallback={bekreftAksjonspunktCallback}
                  />
                );
              }
              if (urlKode === PROSESS_STEG_KODER.SIMULERING) {
                return (
                  <SimuleringProsessStegInitPanel
                    api={k9SakProsessApi}
                    key={urlKode}
                    behandling={behandling}
                    aksjonspunkterMedKodeverk={data.aksjonspunkter}
                    fagsak={fagsak}
                    isReadOnly={isReadOnly}
                    submitCallback={bekreftAksjonspunktCallback}
                    previewFptilbakeCallback={previewFptilbakeCallback}
                  />
                );
              }
              if (urlKode === PROSESS_STEG_KODER.BEREGNINGSGRUNNLAG) {
                return (
                  <BeregningsgrunnlagProsessStegInitPanel
                    key={urlKode}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    submitCallback={bekreftAksjonspunktCallback}
                    formData={formData}
                    setFormData={setFormData}
                    isReadOnly={isReadOnly}
                  />
                );
              }
              if (urlKode === PROSESS_STEG_KODER.VEDTAK) {
                return (
                  <VedtakProsessStegInitPanel
                    key={urlKode}
                    api={k9SakProsessApi}
                    behandling={behandling}
                    hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
                    isReadOnly={isReadOnly}
                    submitCallback={handleVedtakSubmit}
                    previewCallback={previewCallback}
                    lagreDokumentdata={lagreDokumentdata}
                  />
                );
              }
              return null;
            })}
          </BoxNew>
        </Bleed>
      </ProsessMeny>
    </VedtakFormContext.Provider>
  );
};
