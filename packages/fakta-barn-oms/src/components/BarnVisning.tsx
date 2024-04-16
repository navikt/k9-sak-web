import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import { Box } from '@navikt/ds-react';
import moment from 'moment';
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
  <Box
    background="surface-default"
    padding="4"
    borderWidth="1"
    borderColor="border-subtle"
    borderRadius="medium"
    className={styles.barnInput}
  >
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
  </Box>
);

export default BarnVisning;
