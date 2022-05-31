/**
 * Denne brukers til å utføre operasjoner på behandling utenfor behandlingskonteksten.
 */
class BehandlingEventHandler {
  handler?: { [key: string]: (params: any) => Promise<any> };

  setHandler = (handler: { [key: string]: (params: any) => Promise<any> }): void => {
    this.handler = handler;
  };

  clear = (): void => {
    this.handler = undefined;
  };

  endreBehandlendeEnhet = params => this.handler.endreBehandlendeEnhet(params);

  settBehandlingPaVent = params => this.handler.settBehandlingPaVent(params);

  taBehandlingAvVent = params => this.handler.taBehandlingAvVent(params);

  henleggBehandling = params => this.handler.henleggBehandling(params);

  opprettVerge = params => this.handler.opprettVerge(params);

  fjernVerge = params => this.handler.fjernVerge(params);

  lagreRisikoklassifiseringAksjonspunkt = params => this.handler.lagreRisikoklassifiseringAksjonspunkt(params);
}

export default new BehandlingEventHandler();
