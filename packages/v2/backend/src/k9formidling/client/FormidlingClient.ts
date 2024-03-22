import { ForhåndsvisningControllerClient } from "./ForhåndsvisningControllerClient.js";
import { MalControllerClient } from "./MalControllerClient.js";

export class FormidlingClient {
  #forhåndsvisning: ForhåndsvisningControllerClient | null = null

  #malClient: MalControllerClient | null = null

  constructor(private baseUrl: URL) {}

  get forhåndsvisning(): ForhåndsvisningControllerClient {
    if(this.#forhåndsvisning === null) {
      this.#forhåndsvisning = new ForhåndsvisningControllerClient(this.baseUrl)
    }
    return this.#forhåndsvisning
  }

  get maler(): MalControllerClient {
    if(this.#malClient === null) {
      this.#malClient = new MalControllerClient(this.baseUrl)
    }
    return this.#malClient
  }

}
