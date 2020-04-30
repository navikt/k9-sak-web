import React, { FunctionComponent, useState } from 'react';
import { InputField } from '@fpsak-frontend/form/index';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import LeggTilKnapp from '@fpsak-frontend/shared-components/src/LeggTilKnapp';
import Overføring, { Overføringsretning, OverføringsretningEnum, Overføringstype } from '../types/Overføring';
import { typeTilTekstIdMap } from './OverføringsdagerPanel';
import styles from './overføringsrader.less';
import Pil from './Pil';

interface RedigerOverføringsraderProps {
  type: Overføringstype;
  retning: Overføringsretning;
  // readOnly: boolean;
  // rediger: VoidFunction;
}

const RedigerOverføringsrader: FunctionComponent<WrappedFieldArrayProps<Overføring> & RedigerOverføringsraderProps> = ({
  fields,
  type,
  retning,
}) => {
  const [redigerer, setRedigerer] = useState<boolean>(false);
  const leggTilRad = () =>
    fields.push({
      kilde: 'lagtTilAvSaksbehandler',
    });

  return (
    <div>
      <div className={styles.rad}>
        <div className={styles.col15}>
          <Element>
            <FormattedMessage id={fields.length > 0 ? typeTilTekstIdMap[type] : 'FaktaRammevedtak.IngenOverføringer'} />
          </Element>
        </div>
        <div className={styles.col15} />
        <div className={styles.col15}>
          <Element>
            <FormattedMessage id="todo" />
          </Element>
        </div>
      </div>
      {fields.map(field => (
        // TODO: Mulig field som key kan gi feil?
        <div key={field} className={styles.rad}>
          <span className={styles.col15}>
            <InputField name={`${field}.antallDager`} readOnly={!redigerer} label={null} type="number" />
            <span>
              <FormattedMessage id="FaktaRammevedtak.Overføringsdager.Dager" />
              <FormattedMessage
                id={
                  retning === OverføringsretningEnum.INN
                    ? 'FaktaRammevedtak.Overføringsdager.Inn'
                    : 'FaktaRammevedtak.Overføringsdager.Ut'
                }
              />
            </span>
          </span>
          <span className={styles.col15}>
            <Pil retning={retning} />
          </span>
          <InputField name={`${field}.mottakerAvsenderFnr`} readOnly={!redigerer} />
        </div>
      ))}
      {!redigerer && <LeggTilKnapp onClick={() => setRedigerer(true)} tekstId="FaktaRammevedtak.Overføring.Rediger" />}
      {redigerer && <LeggTilKnapp onClick={leggTilRad} tekstId="FaktaRammevedtak.Overføring.LeggTil" />}
    </div>
  );
};

export default RedigerOverføringsrader;
