import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import moment from 'moment';
import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import styles from './barnVisning.less';
import BarnRammevedtakVisning from './BarnRammevedtakVisning';
import BarnInformasjonVisning from './BarnInformasjonVisning';

interface BarnInputProps {
  barnet: KombinertBarnOgRammevedtak;
  index: number;
}

const beregnAntallÅr = fodselsdato => {
  const dato = `20${fodselsdato.substr(4, 2)}-${fodselsdato.substr(2, 2)}-${fodselsdato.substr(0, 2)}`;
  return moment().diff(dato, 'years').toString();
};

const BarnVisning: FunctionComponent<BarnInputProps> = ({ barnet, index }) => (
  <Panel border className={styles.barnInput}>
    <div className={styles.header}>
      <h4>
        <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
      </h4>
      <span className={styles.italic}>
        {barnet.personIdent} ({beregnAntallÅr(barnet.personIdent)} år)
      </span>
    </div>

    {barnet.barnRelevantIBehandling && <BarnInformasjonVisning barnet={barnet} />}
    {barnet.rammevedtak && <BarnRammevedtakVisning barnet={barnet} />}
  </Panel>
);

export default BarnVisning;
