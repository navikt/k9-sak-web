import classNames from 'classnames';
import NavFrontendChevron from 'nav-frontend-chevron';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './nokkeltall.css';

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

const Nokkeltall = ({ overskrift, detaljer, viserDetaljer, visDetaljer, className }: NøkkeltallProps) => (
  <article className={classNames(viserDetaljer && styles.viserDetaljer, className)}>
    <button className={styles.overskrift} onClick={visDetaljer} type="button">
      <span className={styles.dagerOgTimer}>
        <span className={styles.dager}>{overskrift.antallDager}</span>
        {overskrift.antallTimer && <span className={styles.timer}>{overskrift.antallTimer}</span>}
      </span>
      <span className={styles.banner}>
        <span className={styles.overskrifttekst}>
          <FormattedMessage id={overskrift.overskrifttekstId} />
        </span>
        <span className={styles.knapp}>
          {viserDetaljer ? (
            <FormattedMessage id="Nøkkeltall.SkjulUtregning" />
          ) : (
            <FormattedMessage id="Nøkkeltall.VisUtregning" />
          )}
          <NavFrontendChevron type={viserDetaljer ? 'opp' : 'ned'} />
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
            <FormattedMessage id={overskrifttekstId} />
          </span>
          <span className={styles.detaljinfotekst}>{infotekstContent}</span>
        </div>
      ))}
  </article>
);

export default Nokkeltall;
