import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { HistorikkinnslagDel, Kodeverk } from '@k9-sak-web/types';
import { decodeHtmlEntity } from '@k9-sak-web/utils';
import { BodyShort } from '@navikt/ds-react';
import historikkEndretFeltTypeCodes from '../../kodeverk/historikkEndretFeltTypeCodes';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';
import BubbleText from './felles/bubbleText';

const finnFomOpplysning = (opplysninger: HistorikkinnslagDel['opplysninger']): string => {
  const found = opplysninger.find(o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode);
  return found.tilVerdi;
};

const finnTomOpplysning = (opplysninger: HistorikkinnslagDel['opplysninger']): string => {
  const found = opplysninger.find(o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode);
  return found.tilVerdi;
};

const buildEndretFeltText = (
  endredeFelter: HistorikkinnslagDel['endredeFelter'],
  getKodeverknavn: (kodeverk: Kodeverk) => string,
): ReactNode => {
  const årsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn.kode === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_AARSAK.kode,
  )[0];
  const underÅrsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn.kode === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_UNDERAARSAK.kode,
  )[0];
  const underÅrsakFraVerdi = underÅrsakFelt
    ? getKodeverknavn({ kode: underÅrsakFelt.fraVerdi as string, kodeverk: underÅrsakFelt.klFraVerdi })
    : null;
  const underÅrsakTilVerdi = underÅrsakFelt
    ? getKodeverknavn({ kode: underÅrsakFelt.tilVerdi as string, kodeverk: underÅrsakFelt.klTilVerdi })
    : null;
  const endret = endredeFelter.filter(felt => felt.fraVerdi !== null).length > 0;

  const tilVerdiNavn = getKodeverknavn({ kode: årsakFelt.tilVerdi as string, kodeverk: årsakFelt.klTilVerdi });
  if (endret) {
    const årsakVerdi = årsakFelt.fraVerdi ? årsakFelt.fraVerdi : årsakFelt.tilVerdi;
    const fraVerdi = `${getKodeverknavn({ kode: årsakVerdi as string, kodeverk: årsakFelt.klFraVerdi })} ${
      underÅrsakFraVerdi ? `(${underÅrsakFraVerdi})` : ''
    }`;
    const tilVerdi = `${tilVerdiNavn} ${underÅrsakTilVerdi ? `(${underÅrsakTilVerdi})` : ''}`;
    return (
      <FormattedMessage
        id="Historikk.Template.Feilutbetaling.endretFelt"
        values={{ fraVerdi, tilVerdi, b: chunks => <b>{chunks}</b> }}
      />
    );
  }
  const feltVerdi = `${tilVerdiNavn} ${underÅrsakTilVerdi ? `(${underÅrsakTilVerdi})` : ''}`;
  return (
    <FormattedMessage
      id="Historikk.Template.Feilutbetaling.sattFelt"
      values={{ feltVerdi, b: chunks => <b>{chunks}</b> }}
    />
  );
};

const HistorikkMalTypeFeilutbetaling = ({
  historikkinnslag,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}: HistorikkMal) => {
  const { historikkinnslagDeler } = historikkinnslag;
  return (
    <>
      <Skjermlenke
        skjermlenke={historikkinnslagDeler[0].skjermlenke}
        behandlingLocation={behandlingLocation}
        getKodeverknavn={getKodeverknavn}
        scrollUpOnClick
        createLocationForSkjermlenke={createLocationForSkjermlenke}
      />
      {historikkinnslagDeler.map((historikkinnslagDel, index) =>
        historikkinnslagDel.endredeFelter ? (
          <div key={`historikkinnslagDel${index + 1}`}>
            <FormattedMessage
              id="Historikk.Template.Feilutbetaling.FaktaFeilutbetalingPeriode"
              values={{
                periodeFom: finnFomOpplysning(historikkinnslagDel.opplysninger),
                periodeTom: finnTomOpplysning(historikkinnslagDel.opplysninger),
                b: chunks => <b>{chunks}</b>,
              }}
            />
            <BodyShort size="small">
              {buildEndretFeltText(historikkinnslagDel.endredeFelter, getKodeverknavn)}
            </BodyShort>
            <VerticalSpacer eightPx />
          </div>
        ) : null,
      )}
      {historikkinnslagDeler[0] && historikkinnslagDeler[0].begrunnelseFritekst && (
        <BubbleText bodyText={decodeHtmlEntity(historikkinnslagDeler[0].begrunnelseFritekst)} />
      )}
    </>
  );
};

export default HistorikkMalTypeFeilutbetaling;
