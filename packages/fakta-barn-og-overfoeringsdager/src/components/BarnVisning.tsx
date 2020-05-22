import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import styles from './barnInput.less';
import Barn from '../types/Barn';

interface BarnInputProps {
  barnet: Barn;
  index: number;
}

const BarnVisning: FunctionComponent<BarnInputProps> = ({ barnet, index }) => {
  const { aleneomsorg, kroniskSykdom, fødselsnummer } = barnet;
  // const aleneomsorgLabelId = `${fødselsnummer}-aleneomsorg`;
  // const kroniskSykLabelId = `${fødselsnummer}-kroniskSyk`;

  return (
    <Panel border className={styles.barnInput}>
      <div className={styles.header}>
        <h4>
          <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
        </h4>
        <span className={styles.italic}>{fødselsnummer}</span>
      </div>
      {(aleneomsorg || kroniskSykdom) && (
        <div className={styles.rammevedtak}>
          <div>
            <Element>
              <FormattedMessage id="FaktaRammevedtak.Barn.Rammevedtak" />
            </Element>
            {kroniskSykdom && (
              <Normaltekst>
                <FormattedMessage id="FaktaRammevedtak.Barn.UtvidetRett" />
              </Normaltekst>
            )}
            {aleneomsorg && (
              <Normaltekst>
                <FormattedMessage id="FaktaRammevedtak.Barn.Aleneomsorg" />
              </Normaltekst>
            )}
          </div>
          <div>
            <Element>
              <FormattedMessage id="FaktaRammevedtak.Barn.FOM" />
            </Element>
            {kroniskSykdom && <Normaltekst>{kroniskSykdom.fom}</Normaltekst>}
            {aleneomsorg && <Normaltekst>{aleneomsorg.fom}</Normaltekst>}
          </div>
          <div>
            <Element>
              <FormattedMessage id="FaktaRammevedtak.Barn.TOM" />
            </Element>
            {kroniskSykdom && <Normaltekst>{kroniskSykdom.tom}</Normaltekst>}
            {aleneomsorg && <Normaltekst>{aleneomsorg.tom}</Normaltekst>}
          </div>
        </div>
      )}
    </Panel>
  );
};

export default BarnVisning;
