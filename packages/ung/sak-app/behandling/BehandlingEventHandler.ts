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
}

export default new BehandlingEventHandler();
