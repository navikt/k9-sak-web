import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import { BodyShort, Label } from '@navikt/ds-react';
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
        <Label size="small" as="p">
          <FormattedMessage id="FaktaRammevedtak.Barn.Rammevedtak" />
        </Label>
        {kroniskSykdom &&
          kroniskSykdom.map(() => (
            <div key={uuidv4()}>
              <BodyShort size="small">
                <FormattedMessage id="FaktaRammevedtak.Barn.UtvidetRett" />
              </BodyShort>
            </div>
          ))}
        {aleneomsorg && (
          <BodyShort size="small">
            <FormattedMessage id="FaktaRammevedtak.Barn.Aleneomsorg" />
          </BodyShort>
        )}
        {fosterbarn && (
          <BodyShort size="small">
            <FormattedMessage id="FaktaRammevedtak.Barn.Fosterbarn" />
          </BodyShort>
        )}
        {utenlandskBarn && (
          <BodyShort size="small">
            <FormattedMessage id="FaktaRammevedtak.Barn.UtenlandskBarn" />
          </BodyShort>
        )}
        {deltBosted && (
          <BodyShort size="small">
            <FormattedMessage id="FaktaRammevedtak.Barn.DeltBosted" />
          </BodyShort>
        )}
      </div>
      <div>
        <Label size="small" as="p">
          <FormattedMessage id="FaktaRammevedtak.Barn.FOM" />
        </Label>
        {kroniskSykdom &&
          kroniskSykdom.map(ks => (
            <div key={uuidv4()}>
              <BodyShort size="small">{formaterDato(ks.fom)}</BodyShort>
            </div>
          ))}
        {aleneomsorg && <BodyShort size="small">{formaterDato(aleneomsorg.fom)}</BodyShort>}
        {fosterbarn && <BodyShort size="small">{formaterDato(fosterbarn.fom)}</BodyShort>}
        {utenlandskBarn && <BodyShort size="small">{formaterDato(utenlandskBarn.fom)}</BodyShort>}
        {deltBosted && <BodyShort size="small">{formaterDato(deltBosted.fom)}</BodyShort>}
      </div>
      <div>
        <Label size="small" as="p">
          <FormattedMessage id="FaktaRammevedtak.Barn.TOM" />
        </Label>
        {kroniskSykdom &&
          kroniskSykdom.map(ks => (
            <div key={uuidv4()}>
              <BodyShort size="small">{formaterDato(ks.tom)}</BodyShort>
            </div>
          ))}
        {aleneomsorg && !aleneomsorg.tom.includes('9999') && (
          <BodyShort size="small">{formaterDato(aleneomsorg.tom)}</BodyShort>
        )}
        {fosterbarn && <BodyShort size="small">{formaterDato(fosterbarn.tom)}</BodyShort>}
        {utenlandskBarn && <BodyShort size="small">{formaterDato(utenlandskBarn.tom)}</BodyShort>}
        {deltBosted && <BodyShort size="small">{formaterDato(deltBosted.tom)}</BodyShort>}
      </div>
    </div>
  );
};

export default BarnRammevedtakVisning;
