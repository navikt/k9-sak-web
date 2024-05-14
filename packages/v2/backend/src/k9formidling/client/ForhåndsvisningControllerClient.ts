import type { ForhåndsvisDto } from '../models/ForhåndsvisDto.js';

/**
 * Dette er ein klient for server service endepunkt definert i Forhåndsvis.kt i k9-formidling.
 */
export class ForhåndsvisningControllerClient {
  constructor(private baseUrl: URL) {
    // intentionally empty
  }

  private newUrl(path: string): URL {
    return new URL(path, this.baseUrl);
  }

  async lagPdf(forhåndsvisDto: ForhåndsvisDto): Promise<Blob> {
    const resp = await fetch(this.newUrl('/brev/forhaandsvis'), {
      method: 'POST',
      headers: {
        Accept: 'application/pdf, application/json, text/plain',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(forhåndsvisDto),
    });

    if (resp.ok) {
      const contentType = resp.headers.get('Content-Type');
      if (contentType === 'application/pdf') {
        return resp.blob();
      }
      if (contentType === 'application/json') {
        const json = await resp.json();
        throw new Error(`Incorrect response type. Expected pdf, got json: ${json}`);
      } else {
        const txt = await resp.text();
        throw new Error(`Incorrect response type. Expected pdf, got text: ${txt}`);
      }
    } else {
      throw new Error(`Unexpected response status when calling ${resp.url}: ${resp.status} - ${resp.statusText}`);
    }
  }
}
