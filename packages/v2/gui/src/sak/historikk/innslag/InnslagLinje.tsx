import { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_Linje_Type as LinjeType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { NavLink } from 'react-router';
import type { Location } from 'history';
import { parseBoldText, scrollUp } from '../snakkeboble/snakkebobleUtils.jsx';
import { BodyLong } from '@navikt/ds-react';
import type { NyHistorikkLinje } from '../historikkTypeBerikning.js';

export interface InnslagLinjeProps {
  readonly linje: NyHistorikkLinje;
  readonly behandlingLocation: Location;
  readonly createLocationForSkjermlenke: (
    behandlingLocation: Location,
    skjermlenkeKode: string,
  ) => Location | undefined;
}

export const InnslagLinje = ({ linje, behandlingLocation, createLocationForSkjermlenke }: InnslagLinjeProps) => {
  switch (linje.type) {
    case LinjeType.SKJERMLENKE: {
      if (linje.skjermlenkeType == null) {
        throw new Error(`historikk innslag linje med skjermlenke mangler skjermlenkeType.`);
      }
      const location = createLocationForSkjermlenke(behandlingLocation, linje.skjermlenkeType.kode);
      if (location == null) {
        return null;
      }
      return (
        <>
          <NavLink to={location} onClick={scrollUp}>
            {linje.skjermlenkeType.navn}
          </NavLink>
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
