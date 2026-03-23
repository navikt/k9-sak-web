import {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ung_sak_kontrakt_AsyncPollingStatus,
  ung_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';

export interface UngSakApi {
  getAksjonspunkter(behandlingId: string): Promise<ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]>;
  lagreAksjonspunkt(props: ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto): Promise<unknown>;
  lagreAksjonspunktOverstyr(
    props: ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ): Promise<unknown>;
  getVilkår(behandlingUuid: string): Promise<ung_sak_kontrakt_vilkår_VilkårMedPerioderDto[]>;
  getBehandling(behandlingUuid: string): Promise<BehandlingDto>;
  hentBehandlingMidlertidigStatus(behandlingUuid: string): Promise<ung_sak_kontrakt_AsyncPollingStatus>;
}
