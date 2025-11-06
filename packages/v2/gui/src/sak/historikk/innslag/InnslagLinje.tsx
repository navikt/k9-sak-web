import { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_Linje_Type as LinjeType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { BodyLong } from '@navikt/ds-react';
import type { Location } from 'history';
import type { BeriketHistorikkInnslagLinje } from '../historikkTypeBerikning.js';
import { parseBoldText } from '../snakkeboble/snakkebobleUtils.jsx';
import { Skjermlenke } from './Skjermlenke.js';

export interface InnslagLinjeProps {
  readonly linje: BeriketHistorikkInnslagLinje;
  readonly behandlingLocation: Location;
}

export const InnslagLinje = ({ linje, behandlingLocation }: InnslagLinjeProps) => {
  switch (linje.type) {
    case LinjeType.SKJERMLENKE: {
      if (linje.skjermlenkeType == null || linje.skjermlenkeNavn == null) {
        throw new Error(`historikk innslag linje med skjermlenke mangler skjermlenkeType/skjermlenkeNavn.`);
      }
      return (
        <>
          <Skjermlenke
            inlineText
            skjermlenke={{ type: linje.skjermlenkeType, navn: linje.skjermlenkeNavn }}
            behandlingLocation={behandlingLocation}
          />
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
