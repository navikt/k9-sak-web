import React, { FunctionComponent } from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import BarnInput from './BarnInput';
import styles from './alleBarn.less';

interface AlleBarnProps {
  readOnly?: boolean;
}

const AlleBarn: FunctionComponent<WrappedFieldArrayProps & AlleBarnProps> = ({ fields, readOnly }) => {
  return (
    <>
      {fields.map((field, index) => (
        <BarnInput
          namePrefix={field}
          key={field}
          visning={
            <FlexRow childrenMargin>
              <span>
                <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
              </span>
              <span className={styles.italic}>
                <FormattedMessage id="FaktaRammevedtak.BarnAutomatisk" />
              </span>
            </FlexRow>
          }
          readOnly={readOnly}
        />
      ))}
    </>
  );
};

export default AlleBarn;
