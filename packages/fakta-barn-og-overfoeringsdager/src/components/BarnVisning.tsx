import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { visningsdato, isValidDate } from '@fpsak-frontend/utils';
import Panel from 'nav-frontend-paneler';
import styles from './barnInput.less';
import Barn from '../types/Barn';

interface BarnInputProps {
  barnet: Barn;
  index: number;
}

export const formaterDato = dato => (isValidDate(dato) ? visningsdato(dato) : '-');

const BarnVisning: FunctionComponent<BarnInputProps> = ({ barnet, index }) => {
  const { aleneomsorg, kroniskSykdom, fødselsnummer } = barnet;

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
            {kroniskSykdom && <Normaltekst>{formaterDato(kroniskSykdom.fom)}</Normaltekst>}
            {aleneomsorg && <Normaltekst>{formaterDato(aleneomsorg.fom)}</Normaltekst>}
          </div>
          <div>
            <Element>
              <FormattedMessage id="FaktaRammevedtak.Barn.TOM" />
            </Element>
            {kroniskSykdom && <Normaltekst>{formaterDato(kroniskSykdom.tom)}</Normaltekst>}
            {aleneomsorg && <Normaltekst>{formaterDato(aleneomsorg.tom)}</Normaltekst>}
          </div>
        </div>
      )}
    </Panel>
  );
};

export default BarnVisning;
