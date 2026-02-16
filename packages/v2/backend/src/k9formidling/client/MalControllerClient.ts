import type { FagsakYtelseType } from '../../combined/kodeverk/behandling/FagsakYtelseType.js';
import type { AvsenderApplikasjon } from '../models/AvsenderApplikasjon.js';
import { type FritekstbrevDokumentdata, isFritekstbrevDokumentdataArray } from '../models/FritekstbrevDokumentdata.js';
import { isTemplate, type Template } from '../models/Template.js';

export class MalControllerClient {
  constructor(private baseUrl: URL) {
    // intentionally empty
  }

  private newUrl(path: string): URL {
    if (path.startsWith('/')) {
      throw new Error(`newUrl path must be relative so that baseUrl is prepended.`);
    }
    return new URL(path, this.baseUrl);
  }

  private static statusError(resp: Response): Error {
    return new Error(`Request to ${resp.url} failed with status ${resp.status} - ${resp.statusText}`);
  }

  async hentBrevmaler(
    sakstype: FagsakYtelseType,
    behandlingUuid: string,
    avsenderApplikasjon?: AvsenderApplikasjon,
  ): Promise<Map<string, Template>> {
    const url = this.newUrl('brev/maler');
    url.searchParams.set('sakstype', sakstype);
    // MalController.kt::hentBrevmaler forventer å få behandling uuid inn som string på parameter eksternReferanse
    // (behandlingUuid parameter er deprecated)
    url.searchParams.set('eksternReferanse', behandlingUuid);
    if (avsenderApplikasjon !== undefined) {
      url.searchParams.set('avsenderApplikasjon', avsenderApplikasjon);
    }
    const resp = await fetch(url, {
      credentials: 'include',
    });
    if (resp.ok && resp.status === 200) {
      const json = await resp.json();
      const ret = new Map<string, Template>();
      for (const key of Object.keys(json)) {
        const val = json[key];
        if (isTemplate(val)) {
          ret.set(key, val);
        } else {
          throw new Error(`Invalid data format returned (not a Template): ${JSON.stringify(val)}`);
        }
      }
      return ret;
    }
    throw MalControllerClient.statusError(resp);
  }

  async hentInnholdBrevmalType(
    sakstype: FagsakYtelseType,
    eksternReferanse: string,
    avsenderApplikasjon: AvsenderApplikasjon,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]> {
    const url = this.newUrl(`brev/maler/${encodeURIComponent(maltype)}`);
    url.searchParams.set('sakstype', sakstype);
    url.searchParams.set('eksternReferanse', eksternReferanse);
    url.searchParams.set('avsenderApplikasjon', avsenderApplikasjon);
    const resp = await fetch(url, {
      credentials: 'include',
    });
    if (resp.ok && resp.status === 200) {
      const json = await resp.json();
      if (isFritekstbrevDokumentdataArray(json)) {
        return json;
      }
      throw new Error(`returned data not of expected FritekstbrevDokumentdata[] format`);
    }
    throw MalControllerClient.statusError(resp);
  }
}
