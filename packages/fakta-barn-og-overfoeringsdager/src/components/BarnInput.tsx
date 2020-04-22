import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import { CheckboxField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import styles from './barnInput.less';
import { Barn } from '../types/Barn';

interface BarnInputProps {
  barn: Barn;
  namePrefix: string;
}

const BarnInput: FunctionComponent<BarnInputProps> = ({ namePrefix }) => {
  return (
    <Ekspanderbartpanel tittel={<FormattedMessage id="FaktaRammevedtak.Barn" />} apen className={styles.barnInput}>
      <FlexRow wrap={false} childrenMargin>
        <CheckboxField
          name={`${namePrefix}.erKroniskSykt`}
          label={<FormattedMessage id="FaktaRammevedtak.Barn.KroniskSykt" />}
        />
        <CheckboxField
          name={`${namePrefix}.aleneomsorg`}
          label={<FormattedMessage id="FaktaRammevedtak.Barn.Aleneomsorg" />}
        />
      </FlexRow>
    </Ekspanderbartpanel>
  );
};

export default BarnInput;
