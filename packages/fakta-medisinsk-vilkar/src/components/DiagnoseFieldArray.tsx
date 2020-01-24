import { SelectField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, SelectFieldArray } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import React, { useEffect } from 'react';
import { IntlShape } from 'react-intl';
import { FieldArrayFieldsProps } from 'redux-form';
import styles from './medisinskVilkar.less';

interface Fields {
  value: string;
}

interface DiagnoseFieldArrayProps {
  readOnly: boolean;
  fields: FieldArrayFieldsProps<Fields>;
  intl: IntlShape;
  hasDiagnose: boolean;
}

const DiagnoseFieldArray = ({ readOnly, fields, intl, hasDiagnose }: DiagnoseFieldArrayProps) => {
  useEffect(() => {
    if (fields.length === 0) {
      fields.push({ value: '' });
    }
  }, []);

  if (!hasDiagnose) {
    return null;
  }
  return (
    <div className={styles.pickerContainer}>
      <SelectFieldArray
        fields={fields}
        shouldShowAddButton
        readOnly={readOnly}
        textCode="MedisinskVilkarForm.LeggTilDiagnose"
      >
        {(fieldId, index, getRemoveButton) => (
          <FlexRow key={fieldId} wrap>
            <FlexColumn>
              <SelectField
                readOnly={readOnly}
                name={`${fieldId}.value`}
                label=""
                validate={[required]}
                placeholder={intl.formatMessage({ id: 'MedisinskVilkarForm.DiagnoseArray' })}
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
            <FlexColumn>{getRemoveButton()}</FlexColumn>
          </FlexRow>
        )}
      </SelectFieldArray>
    </div>
  );
};

export default DiagnoseFieldArray;
