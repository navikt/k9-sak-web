import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

class MenyKodeverk {
  $$behandlingType;

  $$fpSakKodeverk;

  $$fpTilbakeKodeverk;

  $$klagekodeverk;

  constructor(behandlingType) {
    this.$$behandlingType = behandlingType;
  }

  medFpSakKodeverk(fpSakKodeverk) {
    this.$$fpSakKodeverk = fpSakKodeverk;
    return this;
  }

  medFpTilbakeKodeverk(fpTilbakeKodeverk) {
    this.$$fpTilbakeKodeverk = fpTilbakeKodeverk;
    return this;
  }

  medKlagekodeverk(klagekodeverk) {
    this.$$klagekodeverk = klagekodeverk;
    return this;
  }

  getKodeverkForBehandlingstype(behandlingTypeKode, kodeverkType) {
    if (
      behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
      behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING
    ) {
      return this.$$fpTilbakeKodeverk[kodeverkType];
    }
    if (behandlingTypeKode === BehandlingType.KLAGE) {
      return this.$$klagekodeverk[kodeverkType];
    }
    return this.$$fpSakKodeverk[kodeverkType];
  }

  getKodeverkForValgtBehandling(kodeverkType) {
    return this.getKodeverkForBehandlingstype(this.$$behandlingType.kode, kodeverkType);
  }

  getKodeverkForBehandlingstyper(behandlingTypeKoder, kodeverkType) {
    return behandlingTypeKoder.reduce((acc, btk) => {
      const alleKodeverkForKodeverkType = this.getKodeverkForBehandlingstype(btk, kodeverkType);
      return alleKodeverkForKodeverkType && alleKodeverkForKodeverkType.some(k => k.kode === btk)
        ? acc.concat([alleKodeverkForKodeverkType.find(k => k.kode === btk)])
        : acc;
    }, []);
  }
}

export default MenyKodeverk;
