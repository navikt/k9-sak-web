import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { HistorikkinnslagDel } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import { KodeverkNavnFraKodeFnType, KodeverkType } from '@k9-sak-web/lib/types/index.js';
import historikkEndretFeltTypeCodes from '../../kodeverk/historikkEndretFeltTypeCodes';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';
import BubbleText from './felles/bubbleText';

const finnFomOpplysning = (opplysninger: HistorikkinnslagDel['opplysninger']): string => {
  const found = opplysninger.find(o => o.opplysningType === historikkOpplysningTypeCodes.PERIODE_FOM.kode);
  return found.tilVerdi;
};

const finnTomOpplysning = (opplysninger: HistorikkinnslagDel['opplysninger']): string => {
  const found = opplysninger.find(o => o.opplysningType === historikkOpplysningTypeCodes.PERIODE_TOM.kode);
  return found.tilVerdi;
};

const buildEndretFeltText = (
  endredeFelter: HistorikkinnslagDel['endredeFelter'],
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType,
): ReactNode => {
  const årsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_AARSAK.kode,
  )[0];
  const underÅrsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_UNDERAARSAK.kode,
  )[0];
  const underÅrsakFraVerdi = underÅrsakFelt
    ? kodeverkNavnFraKodeFn(underÅrsakFelt.fraVerdi as string, underÅrsakFelt.klFraVerdi as KodeverkType)
    : null;
  const underÅrsakTilVerdi = underÅrsakFelt
    ? kodeverkNavnFraKodeFn(underÅrsakFelt.tilVerdi as string, underÅrsakFelt.klTilVerdi as KodeverkType)
    : null;
  const endret = endredeFelter.filter(felt => felt.fraVerdi !== null).length > 0;

  const tilVerdiNavn = kodeverkNavnFraKodeFn(årsakFelt.tilVerdi as string, årsakFelt.klTilVerdi as KodeverkType);
  if (endret) {
    const årsakVerdi = årsakFelt.fraVerdi ? årsakFelt.fraVerdi : årsakFelt.tilVerdi;
    const fraVerdi = `${kodeverkNavnFraKodeFn(årsakVerdi as string, årsakFelt.klFraVerdi as KodeverkType)} ${
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
  kodeverkNavnFraKodeFn,
  createLocationForSkjermlenke,
}: HistorikkMal) => {
  const { historikkinnslagDeler } = historikkinnslag;
  return (
    <>
      <Skjermlenke
        skjermlenke={historikkinnslagDeler[0].skjermlenke}
        behandlingLocation={behandlingLocation}
        kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
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
              {buildEndretFeltText(historikkinnslagDel.endredeFelter, kodeverkNavnFraKodeFn)}
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
