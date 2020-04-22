import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import { CheckboxField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import { Flatknapp } from 'nav-frontend-knapper';
import styles from './barnInput.less';

interface BarnInputProps {
  fjernBarn?: VoidFunction;
  namePrefix: string;
}

const BarnInput: FunctionComponent<BarnInputProps> = ({ namePrefix, fjernBarn }) => {
  return (
    <Ekspanderbartpanel tittel={<FormattedMessage id="FaktaRammevedtak.Barn" />} apen className={styles.barnInput}>
      <FlexRow wrap={false} spaceBetween>
        <FlexRow autoFlex childrenMargin>
          <CheckboxField
            name={`${namePrefix}.erKroniskSykt`}
            label={<FormattedMessage id="FaktaRammevedtak.Barn.KroniskSykt" />}
          />
          <CheckboxField
            name={`${namePrefix}.aleneomsorg`}
            label={<FormattedMessage id="FaktaRammevedtak.Barn.Aleneomsorg" />}
          />
        </FlexRow>
        {fjernBarn && (
          <Flatknapp mini kompakt onClick={fjernBarn} htmlType="button">
            <FormattedMessage id="FaktaRammevedtak.Barn.Fjern" />
          </Flatknapp>
        )}
      </FlexRow>
    </Ekspanderbartpanel>
  );
};

export default BarnInput;
