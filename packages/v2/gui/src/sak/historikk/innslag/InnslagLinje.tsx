import { type Linje, LinjeType } from '@k9-sak-web/backend/k9sak/generated';
import { NavLink } from 'react-router';
import type { Location } from 'history';
import { parseBoldText, scrollUp } from '../snakkeboble/snakkebobleUtils.jsx';
import { BodyLong } from '@navikt/ds-react';
import type { K9Kodeverkoppslag } from '../../../kodeverk/oppslag/useK9Kodeverkoppslag.jsx';

export interface InnslagLinjeProps {
  readonly linje: Linje;
  readonly behandlingLocation: Location;
  readonly createLocationForSkjermlenke: (
    behandlingLocation: Location,
    skjermlenkeKode: string,
  ) => Location | undefined;
  readonly kodeverkoppslag: K9Kodeverkoppslag; // <- Kan erstattast med useContext når samanlikningssjekk er fjerna
}

export const InnslagLinje = ({
  linje,
  behandlingLocation,
  createLocationForSkjermlenke,
  kodeverkoppslag,
}: InnslagLinjeProps) => {
  switch (linje.type) {
    case LinjeType.SKJERMLENKE: {
      if (linje.skjermlenkeType == null) {
        throw new Error(`historikk innslag linje med skjermlenke mangler skjermlenkeType.`);
      }
      const location = createLocationForSkjermlenke(behandlingLocation, linje.skjermlenkeType);
      if (location == null) {
        return null;
      }
      return (
        <>
          <NavLink to={location} onClick={scrollUp}>
            {kodeverkoppslag.k9sak.skjermlenkeTyper(linje.skjermlenkeType).navn}
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
