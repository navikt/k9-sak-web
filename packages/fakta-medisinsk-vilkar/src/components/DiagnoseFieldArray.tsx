import { SelectField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import React, { useEffect } from 'react';
import { IntlShape } from 'react-intl';
import { FieldArrayFieldsProps } from 'redux-form';

interface Fields {
  fom: string;
  tom: string;
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
      fields.push({ fom: '', tom: '' });
    }
  }, []);

  if (!hasDiagnose) {
    return null;
  }
  return (
    <PeriodFieldArray
      fields={fields}
      // emptyPeriodTemplate={{
      //   fom: '',
      //   tom: '',
      // }}
      shouldShowAddButton
      readOnly={readOnly}
      textCode="MedisinskVilkarForm.LeggTilDiagnose"
    >
      {(fieldId, index, getRemoveButton) => (
        <FlexRow key={fieldId} wrap>
          <FlexColumn>
            <SelectField
              readOnly={readOnly}
              name={`diagnoseFieldArray_${fieldId}`}
              label=""
              validate={[required]}
              placeholder={intl.formatMessage({ id: 'MedisinskVilkarForm.DiagnoseArray' })}
              selectValues={[
                <option value="lol" key="lol">
                  {/* <FormattedMessage id="MedisinskVilkarForm.F-90" /> */}
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
    </PeriodFieldArray>
  );
};

export default DiagnoseFieldArray;
