import fpsakApi from "@fpsak-frontend/sak-app/src/data/fpsakApi";
import behandlingstype from '@fpsak-frontend/kodeverk/src/behandlingType';

class ApiForBehandlingstype {

  behandlingstypekode;

  constructor(behandlingstypekode) {
    this.behandlingstypekode = behandlingstypekode;
  }

  behandlingerApi() {
    switch (this.behandlingstypekode) {
      case behandlingstype.TILBAKEKREVING:
      case behandlingstype.TILBAKEKREVING_REVURDERING: return fpsakApi.BEHANDLINGER_FPTILBAKE;
      case behandlingstype.KLAGE: return fpsakApi.BEHANDLINGER_KLAGE;
      default: return fpsakApi.BEHANDLINGER_FPSAK;
    }
  }

  newBehandlingApi() {
    switch (this.behandlingstypekode) {
      case behandlingstype.TILBAKEKREVING:
      case behandlingstype.TILBAKEKREVING_REVURDERING: return fpsakApi.NEW_BEHANDLING_FPTILBAKE;
      case behandlingstype.KLAGE: return fpsakApi.NEW_BEHANDLING_KLAGE;
      default: return fpsakApi.NEW_BEHANDLING_FPSAK;
    }
  }
}

export default ApiForBehandlingstype;
