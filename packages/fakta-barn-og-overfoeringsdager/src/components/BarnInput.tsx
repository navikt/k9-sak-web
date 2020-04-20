import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import { CheckboxField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import Barn from '../types/Barn';
import styles from './barnInput.less';

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
          name={`${namePrefix}.erFosterbarn`}
          label={<FormattedMessage id="FaktaRammevedtak.Barn.Fosterbarn" />}
        />
        <CheckboxField
          name={`${namePrefix}.midlertidigAleneomsorg`}
          label={<FormattedMessage id="FaktaRammevedtak.Barn.MidlertidigAleneomsorg" />}
        />
        <CheckboxField
          name={`${namePrefix}.deltBosted`}
          label={<FormattedMessage id="FaktaRammevedtak.Barn.DeltBosted" />}
        />
      </FlexRow>
    </Ekspanderbartpanel>
  );
};

export default BarnInput;
