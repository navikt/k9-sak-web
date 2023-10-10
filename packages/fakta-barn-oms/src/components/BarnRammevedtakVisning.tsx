import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import formaterDato from '../utils/formaterDato';
import styles from './barnVisning.module.css';

interface BarnInputProps {
  barnet: KombinertBarnOgRammevedtak;
}

const BarnRammevedtakVisning = ({ barnet }: BarnInputProps) => {
  const { aleneomsorg, kroniskSykdom, fosterbarn, utenlandskBarn, deltBosted } = barnet.rammevedtak;
  return (
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
        {deltBosted && (
          <Normaltekst>
            <FormattedMessage id="FaktaRammevedtak.Barn.DeltBosted" />
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
        {deltBosted && <Normaltekst>{formaterDato(deltBosted.fom)}</Normaltekst>}
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
        {aleneomsorg && !aleneomsorg.tom.includes('9999') && <Normaltekst>{formaterDato(aleneomsorg.tom)}</Normaltekst>}
        {fosterbarn && <Normaltekst>{formaterDato(fosterbarn.tom)}</Normaltekst>}
        {utenlandskBarn && <Normaltekst>{formaterDato(utenlandskBarn.tom)}</Normaltekst>}
        {deltBosted && <Normaltekst>{formaterDato(deltBosted.tom)}</Normaltekst>}
      </div>
    </div>
  );
};

export default BarnRammevedtakVisning;
