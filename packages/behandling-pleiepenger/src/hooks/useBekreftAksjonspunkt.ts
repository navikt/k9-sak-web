import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { lagDokumentdata } from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@navikt/k9-sak-typescript-client/types';
import { useCallback } from 'react';

interface UseBekreftAksjonspunktParams {
  fagsak: Fagsak;
  behandling: Behandling;
  lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<any>;
  lagreOverstyrteAksjonspunkter?: (params: any, keepData?: boolean) => Promise<any>;
  lagreDokumentdata: (data: any) => Promise<any>;
  onIverksetterVedtak: () => void;
  onFatterVedtak: () => void;
  onRevurdering: () => void;
  onDefault: () => void;
}

/**
 * Modernisert versjon av useBekreftAksjonspunkt uten nestede callbacks.
 *
 * I stedet for å sende inn callback-factories, tar denne hooken direkte inn
 * funksjoner som skal kjøres ved ulike utfall. Dette gjør flyten enklere å følge.
 *
 * Erstatter:
 * - prosessStegHooks.useBekreftAksjonspunkt (gammel hook)
 * - getLagringSideeffekter (callback factory)
 * - getBekreftAksjonspunktCallback (util-funksjon)
 */
export const useBekreftAksjonspunkt = ({
  fagsak,
  behandling,
  lagreAksjonspunkter,
  lagreOverstyrteAksjonspunkter,
  lagreDokumentdata,
  onIverksetterVedtak, // Tidligere: toggleIverksetterVedtakModal(true) i getLagringSideeffekter
  onFatterVedtak, // Tidligere: toggleFatterVedtakModal(true) i getLagringSideeffekter
  onRevurdering, // Tidligere: opneSokeside() i getLagringSideeffekter
  onDefault, // Tidligere: oppdaterProsessStegOgFaktaPanelIUrl('default', 'default') i getLagringSideeffekter
}: UseBekreftAksjonspunktParams) => {
  return useCallback(
    async (aksjonspunktModels: any[], aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[] = []) => {
      // === Logikk fra getLagringSideeffekter ===

      // Valider input
      if (!aksjonspunktModels || aksjonspunktModels.length === 0) {
        console.warn('Ingen aksjonspunktmodeller å bekrefte');
        return;
      }

      // Sjekk om dette er et revurderingsaksjonspunkt
      // (Tidligere i getLagringSideeffekter)
      const erRevurderingsaksjonspunkt = aksjonspunktModels.some(
        apModel =>
          (apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL ||
            apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) &&
          apModel.sendVarsel,
      );

      // Sjekk om vi skal vise iverksetter vedtak modal
      // (Tidligere i getLagringSideeffekter)
      const visIverksetterVedtakModal = aksjonspunktModels.some(
        aksjonspunkt =>
          aksjonspunkt.isVedtakSubmission &&
          [
            aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
            aksjonspunktCodes.FATTER_VEDTAK,
            aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
          ].includes(aksjonspunkt.kode),
      );

      // Sjekk om vi skal vise fatter vedtak modal
      // (Tidligere i getLagringSideeffekter)
      const visFatterVedtakModal =
        aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;

      // Lagre dokumentdata hvis dette er et vedtak
      // (Tidligere i getLagringSideeffekter)
      if (aksjonspunktModels[0].isVedtakSubmission) {
        const dokumentdata = lagDokumentdata(aksjonspunktModels[0]);
        if (dokumentdata) {
          await lagreDokumentdata(dokumentdata);
        }
      }

      // === Logikk fra getBekreftAksjonspunktCallback ===

      // Forbered data for API-kall
      const models = aksjonspunktModels.map(ap => ({
        '@type': ap.kode,
        ...ap,
      }));

      const params = {
        saksnummer: fagsak.saksnummer,
        behandlingId: behandling.id,
        behandlingVersjon: behandling.versjon,
        behandlingUuid: behandling.uuid,
      };

      // Bestem om vi skal bruke overstyrt eller standard lagring
      // (Tidligere i getBekreftAksjonspunktCallback)
      let lagrePromise: Promise<any>;

      if (lagreOverstyrteAksjonspunkter) {
        const aksjonspunkterTilLagring = aksjonspunkter.filter(ap =>
          aksjonspunktModels.some(apModel => apModel.kode === ap.definisjon),
        );

        const erOverstyringsaksjonspunkter = aksjonspunkterTilLagring.some(
          ap =>
            ap.aksjonspunktType === aksjonspunktType.OVERSTYRING ||
            ap.aksjonspunktType === aksjonspunktType.SAKSBEHANDLEROVERSTYRING,
        );

        if (aksjonspunkterTilLagring.length === 0 || erOverstyringsaksjonspunkter) {
          lagrePromise = lagreOverstyrteAksjonspunkter(
            {
              ...params,
              overstyrteAksjonspunktDtoer: models,
            },
            true,
          );
        } else {
          lagrePromise = lagreAksjonspunkter(
            {
              ...params,
              bekreftedeAksjonspunktDtoer: models,
            },
            true,
          );
        }
      } else {
        lagrePromise = lagreAksjonspunkter(
          {
            ...params,
            bekreftedeAksjonspunktDtoer: models,
          },
          true,
        );
      }

      // Vent på at lagringen fullføres
      await lagrePromise;

      // === Side-effekter (tidligere returnert callback fra getLagringSideeffekter) ===

      // Utfør riktig side-effekt basert på hva som ble lagret
      if (visFatterVedtakModal) {
        onFatterVedtak();
      } else if (visIverksetterVedtakModal) {
        onIverksetterVedtak();
      } else if (erRevurderingsaksjonspunkt) {
        onRevurdering();
      } else {
        onDefault();
      }
    },
    [
      fagsak.saksnummer,
      behandling.id,
      behandling.versjon,
      behandling.uuid,
      lagreAksjonspunkter,
      lagreOverstyrteAksjonspunkter,
      lagreDokumentdata,
      onIverksetterVedtak,
      onFatterVedtak,
      onRevurdering,
      onDefault,
    ],
  );
};
