import { SelectField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, SelectFieldArray } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import React, { useEffect } from 'react';
import { IntlShape } from 'react-intl';
import { FieldArrayFieldsProps } from 'redux-form';

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
                <option value="lol" key="lol">
                  {intl.formatMessage({ id: 'MedisinskVilkarForm.F-90' })}
                </option>,
                <option value="hei" key="hei">
                  test
                </option>,
                // <option
                //   value={tilretteleggingType.DELVIS_TILRETTELEGGING}
                //   key={tilretteleggingType.DELVIS_TILRETTELEGGING}
                // >
                //   {intl.formatMessage({ id: 'TilretteleggingFieldArray.RedusertArbeid' })}
                // </option>,
                // <option
                //   value={tilretteleggingType.INGEN_TILRETTELEGGING}
                //   key={tilretteleggingType.INGEN_TILRETTELEGGING}
                // >
                //   {intl.formatMessage({ id: 'TilretteleggingFieldArray.KanIkkeGjennomfores' })}
                // </option>,
              ]}
            />
          </FlexColumn>
          <FlexColumn>{getRemoveButton()}</FlexColumn>
        </FlexRow>
      )}
    </SelectFieldArray>
  );
};

export default DiagnoseFieldArray;
