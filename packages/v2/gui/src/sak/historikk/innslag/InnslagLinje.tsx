import { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_Linje_Type as LinjeType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { BodyLong } from '@navikt/ds-react';
import type { Location } from 'history';
import type { BeriketHistorikkInnslagLinje } from '../api/HistorikkBackendApi.js';
import { Skjermlenke } from './Skjermlenke.js';

export interface InnslagLinjeProps {
  readonly linje: BeriketHistorikkInnslagLinje;
  readonly behandlingLocation: Location;
}

const parseBoldText = (input: string) =>
  input
    .split(/(__.*?__)/g)
    .map((part, index) =>
      part.startsWith('__') && part.endsWith('__') ? <b key={index}>{part.slice(2, -2)}</b> : part,
    );

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
