import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { HistorikkinnslagDel, Kodeverk } from '@k9-sak-web/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkEndretFeltTypeCodes from '../../kodeverk/historikkEndretFeltTypeCodes';
import BubbleText from './felles/bubbleText';
import Skjermlenke from './felles/Skjermlenke';
import HistorikkMal from '../HistorikkMalTsType';

const finnKodeverkType = (kodeverk: string): KodeverkType => KodeverkType[kodeverk];

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
  getKodeverknavn: (kode: string, kodeverk: KodeverkType) => string,
): ReactNode => {
  const årsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_AARSAK.kode,
  )[0];
  const underÅrsakFelt = endredeFelter.filter(
    felt => felt.endretFeltNavn === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_UNDERAARSAK.kode,
  )[0];
  const underÅrsakFraVerdi = underÅrsakFelt
    ? getKodeverknavn(underÅrsakFelt.fraVerdi as string, finnKodeverkType(underÅrsakFelt.klFraVerdi))
    : null;
  const underÅrsakTilVerdi = underÅrsakFelt
    ? getKodeverknavn(underÅrsakFelt.tilVerdi as string, finnKodeverkType(underÅrsakFelt.klTilVerdi))
    : null;
  const endret = endredeFelter.filter(felt => felt.fraVerdi !== null).length > 0;

  const tilVerdiNavn = getKodeverknavn(årsakFelt.tilVerdi as string, finnKodeverkType(årsakFelt.klTilVerdi));
  if (endret) {
    const årsakVerdi = årsakFelt.fraVerdi ? årsakFelt.fraVerdi : årsakFelt.tilVerdi;
    const fraVerdi = `${getKodeverknavn(årsakVerdi as string, finnKodeverkType(årsakFelt.klFraVerdi))} ${
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
            <Normaltekst>{buildEndretFeltText(historikkinnslagDel.endredeFelter, getKodeverknavn)}</Normaltekst>
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
