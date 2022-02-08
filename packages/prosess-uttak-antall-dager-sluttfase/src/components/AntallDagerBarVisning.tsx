import React from 'react';

import styles from './antallDagerBarVisning.less';

interface OwnProps{
  maxDager: number;
  antallDager: number;
  widthPercentage: number;
}

const AntallDagerBarVisning= ({maxDager, antallDager, widthPercentage}: OwnProps) => {
  const antallDagerHeadings = [];
  let antallDagerPerIntervall;

  if(maxDager >= 100){
    antallDagerPerIntervall = 10;
  } else if (maxDager <= 10){
    antallDagerPerIntervall = 1;
  } else{
    antallDagerPerIntervall = 5;
  }

  const breddePerDag = widthPercentage / maxDager;

  antallDagerHeadings.push(<div key={0}>{0}</div>);
  for(let i = antallDagerPerIntervall; i <= maxDager; i += antallDagerPerIntervall){
    antallDagerHeadings.push(<div key={i} style={{width: `${breddePerDag * antallDagerPerIntervall}%`, textAlign: 'right'}}> {i} </div>);
  }

  return <>
    <div className={styles.antallDager}>{ antallDagerHeadings }</div>
    <div className={styles.bakgrunnsBar} style={{width: `${widthPercentage}%`}}/>
    {antallDager > 0 && <div style={{width: `${antallDager >= maxDager ? widthPercentage : antallDager * breddePerDag}%`}} className={styles.antallDagerBar} />}
  </>;
};

export default AntallDagerBarVisning;