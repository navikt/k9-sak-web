import React from 'react';
import { FormattedMessage } from 'react-intl';

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
              <FormattedMessage
                id="Historikk.Template.Foreldelse.VurderingAvPerioden"
                values={{ periodeFom, periodeTom, b: chunks => <b>{chunks}</b> }}
              />
            </BodyShort>
            {endredeFelter &&
              endredeFelter.map(felt => {
                const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

                return (
                  <React.Fragment key={endretFeltNavn.kode}>
                    <BodyShort size="small">
                      <FormattedMessage
                        id={
                          felt.fraVerdi
                            ? 'Historikk.Template.Tilbakekreving.ChangedFromTo'
                            : 'Historikk.Template.Tilbakekreving.FieldSetTo'
                        }
                        values={{
                          navn: getKodeverknavn(endretFeltNavn),
                          fraVerdi,
                          tilVerdi,
                          b: chunks => <b>{chunks}</b>,
                        }}
                      />
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
