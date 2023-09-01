import React from 'react';

import styles from './fremdriftslinje.css';

interface OwnProps {
  max: number;
  antallGrønnBar: number;
  antallGulBar: number;
  totalBreddeProsent: number;
}

const Fremdriftslinje = ({ max, antallGrønnBar, antallGulBar, totalBreddeProsent }: OwnProps) => {
  const antallTitler = [];
  let antallPerIntervall;

  if (max >= 100) {
    antallPerIntervall = 10;
  } else if (max <= 10) {
    antallPerIntervall = 1;
  } else {
    antallPerIntervall = 5;
  }

  const breddePerDagProsent = totalBreddeProsent / max;

  antallTitler.push(<div key={0}>{0}</div>);
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
          style={{
            width: `${antallGrønnBar >= max ? totalBreddeProsent : antallGrønnBar * breddePerDagProsent}%`,
            borderRadius: `${antallGulBar > 0 && antallGrønnBar < max ? '1.5rem 0rem 0rem 1.5rem' : '1.5rem'}`,
          }}
        />
      )}

      {antallGulBar > 0 && (antallGrønnBar < 60 || !antallGrønnBar) && (
        <div
          className={styles.gulBar}
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

export default Fremdriftslinje;
