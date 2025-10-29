import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { joinNonNullStrings } from '@fpsak-frontend/utils';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import { Alert } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import styles from './uidentifisertRammevedtak.module.css';

interface UidentifiserteRammevedtakProps {
  rammevedtak: Rammevedtak[];
  type: RammevedtakType;
}

// Helper function to get text for rammevedtak type
const getTypeText = (type: RammevedtakType, antall: number): string => {
  const texts: Record<string, string> = {
    [RammevedtakEnum.UIDENTIFISERT]: `Det finnes ${antall} automatisk utolkbare rammevedtak fra Infotrygd. Vennligst korriger i Infotrygd.`,
    [RammevedtakEnum.UTVIDET_RETT]: `Det finnes ${antall} rammevedtak om utvidet rett fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.`,
    [RammevedtakEnum.ALENEOMSORG]: `Det finnes ${antall} rammevedtak om aleneomsorg fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.`,
    [RammevedtakEnum.FOSTERBARN]: `Det finnes ${antall} rammevedtak om fosterbarn fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.`,
  };
  return texts[type] || `Ukjent type: ${type}`;
};

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
    erUidentifisert: rv => rv.type === RammevedtakEnum.FOSTERBARN && !rv.mottaker,
  },
};

const UidentifiserteRammevedtak = ({ rammevedtak, type }: UidentifiserteRammevedtakProps) => {
  const { text, erUidentifisert } = typeInfo[type];
  const uidentifiserteRammevedtak = useMemo(() => rammevedtak.filter(erUidentifisert), [rammevedtak]);

  return uidentifiserteRammevedtak.length > 0 ? (
    <>
      <Alert variant="warning" size="small" className={styles.advarsel}>
        {getTypeText(type, uidentifiserteRammevedtak.length)}
        <ol className={styles.ol}>
          {uidentifiserteRammevedtak.map(({ gyldigFraOgMed, gyldigTilOgMed, lengde, fritekst, vedtatt, mottaker }) => (
            <li key={joinNonNullStrings([gyldigFraOgMed, gyldigTilOgMed, lengde, fritekst, vedtatt, mottaker])}>
              `Utolkbar tekst: "{fritekst}"`
            </li>
          ))}
        </ol>
      </Alert>
      <VerticalSpacer sixteenPx />
    </>
  ) : null;
};

export default UidentifiserteRammevedtak;
