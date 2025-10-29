import React from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort } from '@navikt/ds-react';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';

export const HistorikkMalTypeForeldelse = ({
  historikkinnslag,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}: HistorikkMal) => {
  const { historikkinnslagDeler } = historikkinnslag;
  if (historikkinnslagDeler.length === 0) {
    return null;
  }
  return (
    <>
      <Skjermlenke
        skjermlenke={historikkinnslagDeler[0].skjermlenke}
        behandlingLocation={behandlingLocation}
        getKodeverknavn={getKodeverknavn}
        scrollUpOnClick
        createLocationForSkjermlenke={createLocationForSkjermlenke}
      />
      {historikkinnslagDeler.map(historikkinnslagDel => {
        const { begrunnelseFritekst, opplysninger, endredeFelter } = historikkinnslagDel;
        const periodeFom = opplysninger.find(
          o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode,
        ).tilVerdi;
        const periodeTom = opplysninger.find(
          o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode,
        ).tilVerdi;

        return (
          <div key={periodeFom + periodeTom}>
            <BodyShort size="small">
              <>Vurdering av perioden <b>{periodeFom}</b> - <b>{periodeTom}</b></>
            </BodyShort>
            {endredeFelter &&
              endredeFelter.map(felt => {
                const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

                return (
                  <React.Fragment key={endretFeltNavn.kode}>
                    <BodyShort size="small">
                      {felt.fraVerdi
                        ? <><b>{getKodeverknavn(endretFeltNavn)}</b> er endret fra {fraVerdi} til {tilVerdi}</>
                        : <><b>{getKodeverknavn(endretFeltNavn)}</b> er satt til {tilVerdi}</>
                      }
                    </BodyShort>
                    <VerticalSpacer eightPx />
                  </React.Fragment>
                );
              })}
            <VerticalSpacer eightPx />
            {begrunnelseFritekst && <BodyShort size="small">{begrunnelseFritekst}</BodyShort>}
            <VerticalSpacer eightPx />
          </div>
        );
      })}
    </>
  );
};

export default HistorikkMalTypeForeldelse;
