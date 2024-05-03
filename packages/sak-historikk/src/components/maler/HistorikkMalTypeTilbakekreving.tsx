import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { decodeHtmlEntity } from '@k9-sak-web/utils';
import { BodyShort } from '@navikt/ds-react';
import historikkEndretFeltType from '../../kodeverk/historikkEndretFeltType';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';

export const HistorikkMalTypeTilbakekreving = ({
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
        const { opplysninger, endredeFelter, begrunnelseFritekst } = historikkinnslagDel;
        const periodeFom = opplysninger.find(
          o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode,
        ).tilVerdi;
        const periodeTom = opplysninger.find(
          o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode,
        ).tilVerdi;
        const begrunnelse = decodeHtmlEntity(
          opplysninger.find(
            o => o.opplysningType.kode === historikkOpplysningTypeCodes.TILBAKEKREVING_OPPFYLT_BEGRUNNELSE.kode,
          ).tilVerdi,
        );
        const sarligGrunnerBegrunnelseFelt = opplysninger.find(
          o => o.opplysningType.kode === historikkOpplysningTypeCodes.SÆRLIG_GRUNNER_BEGRUNNELSE.kode,
        );
        const sarligGrunnerBegrunnelse =
          sarligGrunnerBegrunnelseFelt !== undefined
            ? decodeHtmlEntity(sarligGrunnerBegrunnelseFelt.tilVerdi)
            : undefined;

        return (
          <div key={periodeFom + periodeTom}>
            <BodyShort size="small">
              <FormattedMessage
                id="Historikk.Template.Tilbakekreving.VurderingAvPerioden"
                values={{ periodeFom, periodeTom, b: chunks => <b>{chunks}</b> }}
              />
            </BodyShort>
            <VerticalSpacer eightPx />
            {endredeFelter &&
              endredeFelter.map((felt, index) => {
                const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

                const visBelopTilbakekreves = historikkEndretFeltType.BELOEP_TILBAKEKREVES === endretFeltNavn.kode;
                const visProsentverdi = historikkEndretFeltType.ANDEL_TILBAKEKREVES === endretFeltNavn.kode;
                const visIleggRenter = historikkEndretFeltType.ILEGG_RENTER === endretFeltNavn.kode;
                if ((visBelopTilbakekreves || visProsentverdi || visIleggRenter) && !tilVerdi) {
                  return null;
                }

                const visBegrunnelse =
                  historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT === endretFeltNavn.kode;
                const formatertFraVerdi = visProsentverdi && fraVerdi ? `${fraVerdi}%` : fraVerdi;
                const formatertTilVerdi = visProsentverdi && tilVerdi ? `${tilVerdi}%` : tilVerdi;
                const visAktsomhetBegrunnelse = begrunnelseFritekst && index === endredeFelter.length - 1;
                const visSarligGrunnerBegrunnelse = sarligGrunnerBegrunnelse && index === endredeFelter.length - 1;

                return (
                  <React.Fragment key={endretFeltNavn.kode}>
                    {visBegrunnelse && begrunnelse}
                    {visBegrunnelse && <VerticalSpacer eightPx />}
                    {visAktsomhetBegrunnelse && decodeHtmlEntity(begrunnelseFritekst)}
                    {visAktsomhetBegrunnelse && <VerticalSpacer eightPx />}
                    <BodyShort size="small">
                      <FormattedMessage
                        id={
                          felt.fraVerdi
                            ? 'Historikk.Template.Tilbakekreving.ChangedFromTo'
                            : 'Historikk.Template.Tilbakekreving.FieldSetTo'
                        }
                        values={{
                          navn: getKodeverknavn(endretFeltNavn),
                          fraVerdi: formatertFraVerdi,
                          tilVerdi: formatertTilVerdi,
                          b: chunks => <b>{chunks}</b>,
                        }}
                      />
                    </BodyShort>
                    <VerticalSpacer eightPx />
                    {visSarligGrunnerBegrunnelse && sarligGrunnerBegrunnelse}
                    {visSarligGrunnerBegrunnelse && <VerticalSpacer eightPx />}
                  </React.Fragment>
                );
              })}
            <BodyShort size="small">{!endredeFelter && begrunnelseFritekst && begrunnelseFritekst}</BodyShort>
            <VerticalSpacer eightPx />
          </div>
        );
      })}
    </>
  );
};

export default HistorikkMalTypeTilbakekreving;
