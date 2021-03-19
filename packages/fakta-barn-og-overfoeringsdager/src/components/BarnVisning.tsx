import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import { v4 as uuidv4 } from 'uuid';
import styles from './barnVisning.less';
import Barn from '../types/Barn';
import formaterDato from './utils';

interface BarnInputProps {
  barnet: Barn;
  index: number;
}

const BarnVisning: FunctionComponent<BarnInputProps> = ({ barnet, index }) => {
  const { aleneomsorg, kroniskSykdom, fosterbarn, utenlandskBarn, fødselsnummer } = barnet;
  return (
    <Panel border className={styles.barnInput}>
      <div className={styles.header}>
        <h4>
          <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
        </h4>
        <span className={styles.italic}>{fødselsnummer}</span>
      </div>
      {(aleneomsorg || kroniskSykdom || fosterbarn || utenlandskBarn) && (
        <div className={styles.rammevedtak}>
          <div>
            <Element>
              <FormattedMessage id="FaktaRammevedtak.Barn.Rammevedtak" />
            </Element>
            {kroniskSykdom &&
              kroniskSykdom.map(() => (
                <div key={uuidv4()}>
                  <Normaltekst>
                    <FormattedMessage id="FaktaRammevedtak.Barn.UtvidetRett" />
                  </Normaltekst>
                </div>
              ))}
            {aleneomsorg && (
              <Normaltekst>
                <FormattedMessage id="FaktaRammevedtak.Barn.Aleneomsorg" />
              </Normaltekst>
            )}
            {fosterbarn && (
              <Normaltekst>
                <FormattedMessage id="FaktaRammevedtak.Barn.Fosterbarn" />
              </Normaltekst>
            )}
            {utenlandskBarn && (
              <Normaltekst>
                <FormattedMessage id="FaktaRammevedtak.Barn.UtenlandskBarn" />
              </Normaltekst>
            )}
          </div>
          <div>
            <Element>
              <FormattedMessage id="FaktaRammevedtak.Barn.FOM" />
            </Element>
            {kroniskSykdom &&
              kroniskSykdom.map(ks => (
                <div key={uuidv4()}>
                  <Normaltekst>{formaterDato(ks.fom)}</Normaltekst>
                </div>
              ))}
            {aleneomsorg && <Normaltekst>{formaterDato(aleneomsorg.fom)}</Normaltekst>}
            {fosterbarn && <Normaltekst>{formaterDato(fosterbarn.fom)}</Normaltekst>}
            {utenlandskBarn && <Normaltekst>{formaterDato(utenlandskBarn.fom)}</Normaltekst>}
          </div>
          <div>
            <Element>
              <FormattedMessage id="FaktaRammevedtak.Barn.TOM" />
            </Element>
            {kroniskSykdom &&
              kroniskSykdom.map(ks => (
                <div key={uuidv4()}>
                  <Normaltekst>{formaterDato(ks.tom)}</Normaltekst>
                </div>
              ))}
            {aleneomsorg && <Normaltekst>{formaterDato(aleneomsorg.tom)}</Normaltekst>}
            {fosterbarn && <Normaltekst>{formaterDato(fosterbarn.tom)}</Normaltekst>}
            {utenlandskBarn && <Normaltekst>{formaterDato(utenlandskBarn.tom)}</Normaltekst>}
          </div>
        </div>
      )}
    </Panel>
  );
};

export default BarnVisning;
