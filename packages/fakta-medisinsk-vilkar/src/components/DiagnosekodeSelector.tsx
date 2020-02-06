import { SelectField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';

const DiagnosekodeSelector = ({ readOnly }) => {
  const intl = useIntl();
  return (
    <FlexRow wrap>
      <FlexColumn>
        <SelectField
          readOnly={readOnly}
          name="diagnosekode"
          label=""
          validate={[required]}
          placeholder={intl.formatMessage({ id: 'MedisinskVilkarForm.DiagnosekodeSelector' })}
          selectValues={[
            <option value="f90" key="f90">
              {intl.formatMessage({ id: 'MedisinskVilkarForm.F-90' })}
            </option>,
            <option value="test" key="test">
              test
            </option>,
          ]}
        />
      </FlexColumn>
    </FlexRow>
  );
};

export default DiagnosekodeSelector;
