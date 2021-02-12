import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import styles from './deltBosted.less';
import Barn from '../../types/Barn';
import formaterDato from '../utils';

interface BarnInputProps {
  barnet: Barn;
  index: number;
}

const DeltBosted: FunctionComponent<BarnInputProps> = ({ barnet, index }) => {
  const { deltBosted, fødselsnummer } = barnet;

  return (
    <Panel border className={styles.barnInput}>
      <div className={styles.header}>
        <h4>
          <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
        </h4>
        <span className={styles.italic}>{fødselsnummer}</span>
      </div>
      <div className={styles.rammevedtak}>
        <div>
          <Element>
            <FormattedMessage id="FaktaRammevedtak.Barn.Rammevedtak" />
          </Element>
          <Normaltekst>
            <FormattedMessage id="FaktaRammevedtak.Barn.DeltBosted" />
          </Normaltekst>
        </div>
        <div>
          <Element>
            <FormattedMessage id="FaktaRammevedtak.Barn.FOM" />
          </Element>
          <Normaltekst>{formaterDato(deltBosted.fom)}</Normaltekst>
        </div>
        <div>
          <Element>
            <FormattedMessage id="FaktaRammevedtak.Barn.TOM" />
          </Element>
          deltBosted && <Normaltekst>{formaterDato(deltBosted.tom)}</Normaltekst>
        </div>
      </div>
    </Panel>
  );
};

export default DeltBosted;
