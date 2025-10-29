import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React from 'react';
import styles from './nokkeltall.module.css';

export interface Nokkeltalldetalj {
  antallDager: number;
  antallTimer?: React.ReactNode;
  overskrifttekstId: string;
  infotekstContent?: React.ReactNode;
}

export interface NøkkeltallProps {
  overskrift: {
    antallDager: number;
    antallTimer?: React.ReactNode;
    overskrifttekstId: string;
  };
  detaljer: Nokkeltalldetalj[];
  viserDetaljer: boolean;
  visDetaljer: () => void;
  className?: string;
}

// Helper to get nokkeltall text
const getNokkeltallText = (textId: string): string => {
  const texts: Record<string, string> = {
    'Nøkkeltall.Restdager': 'Restdager',
    'Nøkkeltall.ForbrukteDager': 'Forbrukte dager',
    'Nøkkeltall.TotaltForbrukte': 'Totalt forbrukte dager',
    'Nøkkeltall.DagerFraInfotrygd': 'Dager fra Infotrygd',
    'Nøkkeltall.DagerNavKanUtbetale': 'Dager NAV kan utbetale',
    'Nøkkeltall.DagerSøkerHarRettPå': 'Dager søker har rett på',
  };
  return texts[textId] || textId;
};

const Nokkeltall = ({ overskrift, detaljer, viserDetaljer, visDetaljer, className }: NøkkeltallProps) => (
  <article className={classNames(viserDetaljer && styles.viserDetaljer, className)}>
    <button className={styles.overskrift} onClick={visDetaljer} type="button">
      <span className={styles.dagerOgTimer}>
        <span className={styles.dager}>{overskrift.antallDager}</span>
        {overskrift.antallTimer && <span className={styles.timer}>{overskrift.antallTimer}</span>}
      </span>
      <span className={styles.banner}>
        <span className={styles.overskrifttekst}>
          {getNokkeltallText(overskrift.overskrifttekstId)}
        </span>
        <span className={styles.knapp}>
          {viserDetaljer ? (
            Skjul utregning
          ) : (
            Vis utregning
          )}
          {viserDetaljer ? <ChevronUpIcon fontSize="1.5rem" /> : <ChevronDownIcon fontSize="1.5rem" />}
        </span>
      </span>
    </button>
    {viserDetaljer &&
      detaljer.map(({ antallDager, antallTimer, overskrifttekstId, infotekstContent }) => (
        <div className={styles.detaljer} key={overskrifttekstId}>
          <span className={styles.dagerOgTimer}>
            <span className={styles.dager}>{antallDager}</span>
            {antallTimer && <span className={styles.timer}>{antallTimer}</span>}
          </span>
          <span className={styles.detaljoverskrift}>
            {getNokkeltallText(overskrifttekstId)}
          </span>
          <span className={styles.detaljinfotekst}>{infotekstContent}</span>
        </div>
      ))}
  </article>
);

export default Nokkeltall;
