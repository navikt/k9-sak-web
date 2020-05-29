import React, { useMemo, FunctionComponent } from 'react';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { joinNonNullStrings } from '@fpsak-frontend/fp-felles/index';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types';
import styles from './uidentifisertRammevedtak.less';

interface UidentifiserteRammevedtakProps {
  rammevedtak: Rammevedtak[];
  type: RammevedtakType;
}

const typeInfo = {
  [RammevedtakEnum.UIDENTIFISERT]: {
    text: 'FaktaRammevedtak.UidentifiserteRammevedtak',
    erUidentifisert: rv => rv.type === RammevedtakEnum.UIDENTIFISERT,
  },
  [RammevedtakEnum.UTVIDET_RETT]: {
    text: 'FaktaRammevedtak.Uidentifisert.UtvidetRett',
    erUidentifisert: rv => rv.type === RammevedtakEnum.UTVIDET_RETT && !rv.utvidetRettFor,
  },
  [RammevedtakEnum.ALENEOMSORG]: {
    text: 'FaktaRammevedtak.Uidentifisert.Aleneomsorg',
    erUidentifisert: rv => rv.type === RammevedtakEnum.ALENEOMSORG && !rv.aleneOmOmsorgenFor,
  },
  [RammevedtakEnum.FOSTERBARN]: {
    text: 'FaktaRammevedtak.Uidentifisert.Fosterbarn',
    erUidentifisert: rv => rv.type === RammevedtakEnum.FOSTERBARN && !rv.fosterbarnFor,
  },
};

const UidentifiserteRammevedtak: FunctionComponent<UidentifiserteRammevedtakProps> = ({ rammevedtak, type }) => {
  const { text, erUidentifisert } = typeInfo[type];
  const uidentifiserteRammevedtak = useMemo(() => rammevedtak.filter(erUidentifisert), [rammevedtak]);

  return uidentifiserteRammevedtak.length > 0 ? (
    <>
      <AlertStripeAdvarsel className={styles.advarsel}>
        <FormattedMessage id={text} values={{ antall: uidentifiserteRammevedtak.length }} />
        <ol className={styles.ol}>
          {uidentifiserteRammevedtak.map(({ gyldigFraOgMed, gyldigTilOgMed, lengde, fritekst, vedtatt, mottaker }) => (
            <li key={joinNonNullStrings([gyldigFraOgMed, gyldigTilOgMed, lengde, fritekst, vedtatt, mottaker])}>
              <FormattedMessage id="FaktaRammevedtak.Uidentifisert.UtolkbarTekst" values={{ fritekst }} />
            </li>
          ))}
        </ol>
      </AlertStripeAdvarsel>
      <VerticalSpacer sixteenPx />
    </>
  ) : null;
};

export default UidentifiserteRammevedtak;
