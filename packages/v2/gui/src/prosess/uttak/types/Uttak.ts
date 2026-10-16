import type { Uttaksplan } from '@k9-sak-web/backend/k9sak/kontrakt/Uttaksplan.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';

export type Uttak = UttaksplanMedUtsattePerioder & {
  uttaksplan: Uttaksplan & {
    kvoteInfo?: Uttaksplan['kvoteInfo'] & {
      totaltForbruktKvote: number;
    };
  };
};

// totaltForbruktKvote i  som at den alltid eksisterer når kvoteInfo eksisterer
export function validerUttak(uttak: UttaksplanMedUtsattePerioder): asserts uttak is Uttak {
  if (uttak.uttaksplan.kvoteInfo && uttak.uttaksplan.kvoteInfo.totaltForbruktKvote == undefined) {
    throw Error('Utviklerfeil: Totalt forbrukt kvote er undefined');
  }
}
