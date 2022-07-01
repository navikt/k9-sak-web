import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkEndretFeltType from '../../kodeverk/historikkEndretFeltType';
import Skjermlenke from './felles/Skjermlenke';
import HistorikkMal from '../HistorikkMalTsType';
import KodeverkType from 'kodeverk/src/kodeverkTyper';

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
          o => o.opplysningType === historikkOpplysningTypeCodes.PERIODE_FOM.kode,
        ).tilVerdi;
        const periodeTom = opplysninger.find(
          o => o.opplysningType === historikkOpplysningTypeCodes.PERIODE_TOM.kode,
        ).tilVerdi;
        const begrunnelse = decodeHtmlEntity(
          opplysninger.find(
            o => o.opplysningType === historikkOpplysningTypeCodes.TILBAKEKREVING_OPPFYLT_BEGRUNNELSE.kode,
          ).tilVerdi,
        );
        const sarligGrunnerBegrunnelseFelt = opplysninger.find(
          o => o.opplysningType === historikkOpplysningTypeCodes.SÆRLIG_GRUNNER_BEGRUNNELSE.kode,
        );
        const sarligGrunnerBegrunnelse =
          sarligGrunnerBegrunnelseFelt !== undefined
            ? decodeHtmlEntity(sarligGrunnerBegrunnelseFelt.tilVerdi)
            : undefined;

        return (
          <div key={periodeFom + periodeTom}>
            <Normaltekst>
              <FormattedMessage
                id="Historikk.Template.Tilbakekreving.VurderingAvPerioden"
                values={{ periodeFom, periodeTom, b: chunks => <b>{chunks}</b> }}
              />
            </Normaltekst>
            <VerticalSpacer eightPx />
            {endredeFelter &&
              endredeFelter.map((felt, index) => {
                const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

                const visBelopTilbakekreves = historikkEndretFeltType.BELOEP_TILBAKEKREVES === endretFeltNavn;
                const visProsentverdi = historikkEndretFeltType.ANDEL_TILBAKEKREVES === endretFeltNavn;
                const visIleggRenter = historikkEndretFeltType.ILEGG_RENTER === endretFeltNavn;
                if ((visBelopTilbakekreves || visProsentverdi || visIleggRenter) && !tilVerdi) {
                  return null;
                }

                const visBegrunnelse =
                  historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT === endretFeltNavn;
                const formatertFraVerdi = visProsentverdi && fraVerdi ? `${fraVerdi}%` : fraVerdi;
                const formatertTilVerdi = visProsentverdi && tilVerdi ? `${tilVerdi}%` : tilVerdi;
                const visAktsomhetBegrunnelse = begrunnelseFritekst && index === endredeFelter.length - 1;
                const visSarligGrunnerBegrunnelse = sarligGrunnerBegrunnelse && index === endredeFelter.length - 1;

                return (
                  <React.Fragment key={endretFeltNavn}>
                    {visBegrunnelse && begrunnelse}
                    {visBegrunnelse && <VerticalSpacer eightPx />}
                    {visAktsomhetBegrunnelse && decodeHtmlEntity(begrunnelseFritekst)}
                    {visAktsomhetBegrunnelse && <VerticalSpacer eightPx />}
                    <Normaltekst>
                      <FormattedMessage
                        id={
                          felt.fraVerdi
                            ? 'Historikk.Template.Tilbakekreving.ChangedFromTo'
                            : 'Historikk.Template.Tilbakekreving.FieldSetTo'
                        }
                        values={{
                          navn: getKodeverknavn(endretFeltNavn, KodeverkType.HISTORIKK_ENDRET_FELT_TYPE),
                          fraVerdi: formatertFraVerdi,
                          tilVerdi: formatertTilVerdi,
                          b: chunks => <b>{chunks}</b>,
                        }}
                      />
                    </Normaltekst>
                    <VerticalSpacer eightPx />
                    {visSarligGrunnerBegrunnelse && sarligGrunnerBegrunnelse}
                    {visSarligGrunnerBegrunnelse && <VerticalSpacer eightPx />}
                  </React.Fragment>
                );
              })}
            <Normaltekst>{!endredeFelter && begrunnelseFritekst && begrunnelseFritekst}</Normaltekst>
            <VerticalSpacer eightPx />
          </div>
        );
      })}
    </>
  );
};

export default HistorikkMalTypeTilbakekreving;
