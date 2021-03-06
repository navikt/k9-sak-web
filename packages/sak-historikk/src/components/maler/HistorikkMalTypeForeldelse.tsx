import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import Skjermlenke from './felles/Skjermlenke';
import HistorikkMal from '../HistorikkMalTsType';

export const HistorikkMalTypeForeldelse: FunctionComponent<HistorikkMal> = ({
  historikkinnslag,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => {
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
            <Normaltekst>
              <FormattedMessage
                id="Historikk.Template.Foreldelse.VurderingAvPerioden"
                values={{ periodeFom, periodeTom, b: chunks => <b>{chunks}</b> }}
              />
            </Normaltekst>
            {endredeFelter &&
              endredeFelter.map(felt => {
                const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

                return (
                  <React.Fragment key={endretFeltNavn.kode}>
                    <Normaltekst>
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
                    </Normaltekst>
                    <VerticalSpacer eightPx />
                  </React.Fragment>
                );
              })}
            <VerticalSpacer eightPx />
            {begrunnelseFritekst && <Normaltekst>{begrunnelseFritekst}</Normaltekst>}
            <VerticalSpacer eightPx />
          </div>
        );
      })}
    </>
  );
};

export default HistorikkMalTypeForeldelse;
