import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { Fagsak } from '@k9-sak-web/types';
import {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
} from '@navikt/ung-sak-typescript-client/types';
import { useCallback } from 'react';

interface UseBekreftAksjonspunktParams {
  fagsak: Fagsak;
  behandling: Pick<ung_sak_kontrakt_behandling_BehandlingDto, 'id' | 'versjon' | 'uuid'>;
  lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<any>;
  lagreOverstyrteAksjonspunkter?: (params: any, keepData?: boolean) => Promise<any>;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
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
  oppdaterProsessStegOgFaktaPanelIUrl,
}: UseBekreftAksjonspunktParams) => {
  return useCallback(
    async (
      aksjonspunktModels: any[],
      aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[] = [],
      skaForhindreOppdaterUrl?: boolean,
    ) => {
      if (!aksjonspunktModels || aksjonspunktModels.length === 0) {
        console.warn('Ingen aksjonspunktmodeller å bekrefte');
        return;
      }

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

      const aksjonspunkterTilLagring = aksjonspunkter.filter(ap =>
        aksjonspunktModels.some(apModel => apModel.kode === ap.definisjon),
      );

      const erOverstyringsaksjonspunkter = aksjonspunkterTilLagring.some(
        ap =>
          ap.aksjonspunktType === aksjonspunktType.OVERSTYRING ||
          ap.aksjonspunktType === aksjonspunktType.SAKSBEHANDLEROVERSTYRING,
      );

      if (lagreOverstyrteAksjonspunkter && (aksjonspunkterTilLagring.length === 0 || erOverstyringsaksjonspunkter)) {
        await lagreOverstyrteAksjonspunkter(
          {
            ...params,
            overstyrteAksjonspunktDtoer: models,
          },
          true,
        );
      } else {
        await lagreAksjonspunkter(
          {
            ...params,
            bekreftedeAksjonspunktDtoer: models,
          },
          true,
        );
      }
      if (!skaForhindreOppdaterUrl) {
        oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
      }
    },
    [
      fagsak.saksnummer,
      behandling.id,
      behandling.versjon,
      behandling.uuid,
      lagreAksjonspunkter,
      lagreOverstyrteAksjonspunkter,
      oppdaterProsessStegOgFaktaPanelIUrl,
    ],
  );
};
