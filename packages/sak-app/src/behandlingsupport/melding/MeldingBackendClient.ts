import type { EregOrganizationLookupResponse } from "@k9-sak-web/types";
import { BackendApi } from "./MeldingIndex";

export default class MeldingBackendClient implements BackendApi {
  // TODO Bytt ut denne implementasjonen med ein som går mot eigen backend, og bruker requestApi, eller ein lågare nivå
  //  http klient dependency injecta i konstruktør (axios)
  async getTredjepartsmottakerInfo(orgnr: string): Promise<EregOrganizationLookupResponse> {
    const resp = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`, {
      headers: {
        'Accept': 'application/vnd.brreg.enhetsregisteret.enhet.v2+json;charset=UTF-8'
      }
    })
    if(resp.ok) {
      const json = await resp.json()
      return {name: json.navn}
    }
    if(resp.status === 400) {
      return {invalidOrgnum: true}
    }
    if(resp.status === 404) {
      return {notFound: true}
    }
    throw new Error(`Unexpected response from data.brreg.no: ${resp.status} - ${resp.statusText}`)
  }
}
