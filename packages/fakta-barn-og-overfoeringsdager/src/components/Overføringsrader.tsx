import React, { FunctionComponent } from 'react';
import { InputField } from '@fpsak-frontend/form/index';
import { WrappedFieldArrayProps } from 'redux-form';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Overføringsretning, OverføringsretningEnum, Overføringstype } from '../types/Overføring';
import { typeTilTekstIdMap } from './OverføringsdagerPanel';
import styles from './overføringsrader.less';

interface OverføringsraderProps {
  type: Overføringstype;
  retning: Overføringsretning;
}

const Overføringsrader: FunctionComponent<WrappedFieldArrayProps & OverføringsraderProps> = ({
  fields,
  type,
  retning,
}) => {
  return (
    <div className={styles.kolonne}>
      <Element>
        <FormattedMessage id={fields.length > 0 ? typeTilTekstIdMap[type] : 'FaktaRammevedtak.IngenOverføringer'} />
      </Element>
      {fields.map(field => (
        <span>
          <InputField name={`${field}.antallDager`} readOnly label={null} type="number" />
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
      ))}
    </div>
  );
};

export default Overføringsrader;
