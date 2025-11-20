import { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_Linje_Type as LinjeType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { BodyLong } from '@navikt/ds-react';
import type { Location } from 'history';
import type { BeriketHistorikkInnslagLinje } from '../api/HistorikkBackendApi.js';
import { Skjermlenke } from './Skjermlenke.js';

export interface InnslagLinjeProps {
  readonly linje: BeriketHistorikkInnslagLinje;
  readonly behandlingLocation: Location;
}

// Disse verdier er og definert i k9-sak HistorikkinnslagTekstLinje
const BACKSLASH = '\\';
const BOLD_MARKØR = '__';
const ESCAPED_BACKSLASH = BACKSLASH + BACKSLASH;
const ESCAPED_BOLD_MARKØR = BACKSLASH + BOLD_MARKØR;

const parseBoldText = (input: string) =>
  input
    .split(/((?<!\\)__.*?(?<!\\)__)/g)
    .map((part, index) =>
      part.startsWith('__') && part.endsWith('__') ? (
        <b key={index}>{unescapeMarkers(part.slice(2, -2))}</b>
      ) : (
        unescapeMarkers(part)
      ),
    );

/**
 * Sidan server escaper evt __ i input tekst som \__ og evt \ i input tekst som \\ reverserer vi dette her etter at bold markering har blitt parsa.
 */
const unescapeMarkers = (input: string): string =>
  input.replaceAll(ESCAPED_BOLD_MARKØR, BOLD_MARKØR).replaceAll(ESCAPED_BACKSLASH, BACKSLASH);

export const InnslagLinje = ({ linje, behandlingLocation }: InnslagLinjeProps) => {
  switch (linje.type) {
    case LinjeType.SKJERMLENKE: {
      if (linje.skjermlenke == null) {
        throw new Error(`historikk innslag linje med type skjermlenke mangler skjermlenke.`);
      }
      return (
        <>
          <Skjermlenke inlineText skjermlenke={linje.skjermlenke} behandlingLocation={behandlingLocation} />
          {linje.tekst != null ? parseBoldText(linje.tekst) : null}
        </>
      );
      // ^- skjermlenke linje kan ha tekst i tillegg. Skal printast etter link i såfall
    }
    case LinjeType.LINJESKIFT:
      return <br />;
    case LinjeType.TEKST:
      return <BodyLong size="small">{linje.tekst != null ? parseBoldText(linje.tekst) : null}</BodyLong>;
  }
};
