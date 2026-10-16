import type { JSX } from 'react';
import styles from './fremdriftslinje.module.css';

interface FremdriftslinjeProps {
  max: number;
  antallGrønnBar: number;
  antallGulBar: number;
  totalBreddeProsent: number;
}

const finnAntallPerIntervall = (max: number): number => {
  if (max >= 100) {
    return 10;
  }
  if (max <= 10) {
    return 1;
  }
  return 5;
};

export const Fremdriftslinje = ({ max, antallGrønnBar, antallGulBar, totalBreddeProsent }: FremdriftslinjeProps) => {
  const antallPerIntervall = finnAntallPerIntervall(max);
  const breddePerDagProsent = totalBreddeProsent / max;

  const antallTitler: JSX.Element[] = [<div key={0}>{0}</div>];
  for (let i = antallPerIntervall; i <= max; i += antallPerIntervall) {
    antallTitler.push(
      <div key={i} style={{ width: `${breddePerDagProsent * antallPerIntervall}%`, textAlign: 'right' }}>
        {' '}
        {i}{' '}
      </div>,
    );
  }

  return (
    <>
      <div className={styles.antallTitler}>{antallTitler}</div>
      <div className={styles.bakgrunnsBar} style={{ width: `${totalBreddeProsent}%` }} />

      {antallGrønnBar > 0 && (
        <div
          className={styles.gronnBar}
          data-testid="fremdriftslinje-gronn"
          style={{
            width: `${antallGrønnBar >= max ? totalBreddeProsent : antallGrønnBar * breddePerDagProsent}%`,
            borderRadius: `${antallGulBar > 0 && antallGrønnBar < max ? '1.5rem 0rem 0rem 1.5rem' : '1.5rem'}`,
          }}
        />
      )}

      {antallGulBar > 0 && (antallGrønnBar < 60 || !antallGrønnBar) && (
        <div
          className={styles.gulBar}
          data-testid="fremdriftslinje-gul"
          style={{
            width: `${
              antallGulBar + antallGrønnBar >= max
                ? totalBreddeProsent - antallGrønnBar * breddePerDagProsent
                : antallGulBar * breddePerDagProsent
            }%`,
            marginLeft: `${antallGrønnBar * breddePerDagProsent}%`,
            borderRadius: `${antallGrønnBar > 0 ? '0rem 1.5rem 1.5rem 0rem' : '1.5rem'}`,
          }}
        />
      )}
    </>
  );
};
