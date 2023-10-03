import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import moment from 'moment';
import Panel from 'nav-frontend-paneler';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import BarnInformasjonVisning from './BarnInformasjonVisning';
import BarnRammevedtakVisning from './BarnRammevedtakVisning';
import styles from './barnVisning.module.css';

interface BarnInputProps {
  barnet: KombinertBarnOgRammevedtak;
  index: number;
}

const beregnAntallÅr = fodselsdato => moment().diff(fodselsdato, 'years').toString();

const BarnVisning = ({ barnet, index }: BarnInputProps) => (
  <Panel border className={styles.barnInput}>
    <div className={styles.header}>
      <h4>
        <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
      </h4>
      <span className={styles.italic}>
        {barnet.personIdent} ({beregnAntallÅr(barnet.barnRelevantIBehandling.fødselsdato)} år)
      </span>
    </div>

    {barnet.barnRelevantIBehandling && <BarnInformasjonVisning barnet={barnet} />}
    {barnet.rammevedtak && <BarnRammevedtakVisning barnet={barnet} />}
  </Panel>
);

export default BarnVisning;
