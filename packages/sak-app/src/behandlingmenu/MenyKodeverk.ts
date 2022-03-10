import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

class MenyKodeverk {
  $$behandlingType: string;

  $$k9SakKodeverk: { [key: string]: KodeverkMedNavn[] };

  $$tilbakeKodeverk: { [key: string]: KodeverkMedNavn[] };

  $$klagekodeverk: { [key: string]: KodeverkMedNavn[] };

  constructor(behandlingType: string) {
    this.$$behandlingType = behandlingType;
  }

  medK9SakKodeverk(k9SakKodeverk: { [key: string]: KodeverkMedNavn[] }): this {
    this.$$k9SakKodeverk = k9SakKodeverk;
    return this;
  }

  medTilbakeKodeverk(tilbakeKodeverk: { [key: string]: KodeverkMedNavn[] } = {}): this {
    this.$$tilbakeKodeverk = tilbakeKodeverk;
    return this;
  }

  medKlageKodeverk(klagekodeverk: { [key: string]: KodeverkMedNavn[] } = {}): this {
    this.$$klagekodeverk = klagekodeverk;
    return this;
  }

  getKodeverkForBehandlingstype(behandlingTypeKode: string, kodeverkType: string): KodeverkMedNavn[] {
    if (
      behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
      behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING
    ) {
      return this.$$tilbakeKodeverk[kodeverkType];
    }
    if (behandlingTypeKode === BehandlingType.KLAGE) {
      return this.$$klagekodeverk[kodeverkType];
    }
    return this.$$k9SakKodeverk[kodeverkType];
  }

  getKodeverkForValgtBehandling(kodeverkType: string): KodeverkMedNavn[] {
    return this.getKodeverkForBehandlingstype(this.$$behandlingType, kodeverkType);
  }

  getKodeverkForBehandlingstyper(behandlingTypeKoder: string[], kodeverkType: string): KodeverkMedNavn[] {
    return behandlingTypeKoder.reduce((acc, btk) => {
      const alleKodeverkForKodeverkType = this.getKodeverkForBehandlingstype(btk, kodeverkType);
      return alleKodeverkForKodeverkType && alleKodeverkForKodeverkType.some(k => k.kode === btk)
        ? acc.concat([alleKodeverkForKodeverkType.find(k => k.kode === btk)])
        : acc;
    }, []);
  }
}

export default MenyKodeverk;
