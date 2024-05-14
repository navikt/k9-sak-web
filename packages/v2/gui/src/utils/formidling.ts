/*
 * Flytter funksjonar frå packages/utils/src/formidlingUtils.tsx inn her etterkvart som dei blir tatt i bruk frå v2/gui pakke.
 * Skal ikkje ha avhengigheter frå v2 til gammal kode!
 */

import type { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { avsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import type { AvsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';

/**
 * Definerer dei brukte properties frå parametra her, for å sleppe å flytte gamle typer inn i første omgang, og for å unngå avhengighet til gammal kode.
 *
 * Dette sidan vi ønsker å bruke nye openapi genererte typer så mykje som mulig når vi kjem lenger i omskriving.
 */
export interface Personopplysninger {
  readonly aktoerId?: string;
  readonly navn?: string;
  readonly fnr?: string;
  readonly nummer?: number;
}

interface ArbeidsgiverOpplysninger {
  readonly navn: string;
}

export type ArbeidsgiverOpplysningerPerId = Record<string, ArbeidsgiverOpplysninger>;

export const lagVisningsnavnForMottaker = (
  mottakerId: string,
  personopplysninger?: Personopplysninger,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
): string => {
  if (
    arbeidsgiverOpplysningerPerId &&
    arbeidsgiverOpplysningerPerId[mottakerId] &&
    arbeidsgiverOpplysningerPerId[mottakerId]?.navn
  ) {
    return `${arbeidsgiverOpplysningerPerId[mottakerId]?.navn} (${mottakerId})`;
  }

  if (personopplysninger && personopplysninger.aktoerId === mottakerId && personopplysninger.navn) {
    return `${personopplysninger.navn} (${personopplysninger.fnr || personopplysninger.nummer || mottakerId})`;
  }

  return mottakerId;
};

export const bestemAvsenderApp = (type: BehandlingType): AvsenderApplikasjon =>
  type === behandlingType.KLAGE ? avsenderApplikasjon.K9KLAGE : avsenderApplikasjon.K9SAK;
