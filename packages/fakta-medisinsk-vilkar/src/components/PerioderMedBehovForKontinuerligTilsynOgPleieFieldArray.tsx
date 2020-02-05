import React, { useEffect } from 'react';
import { PeriodFieldArray, FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';
import { PeriodpickerField } from '@fpsak-frontend/form';
import { required, hasValidDate, dateRangesNotOverlapping } from '@fpsak-frontend/utils';
import { FieldArrayFieldsProps } from 'redux-form';
import styles from './medisinskVilkar.less';

interface Fields {
  fom: string;
  tom: string;
}

interface PerioderMedBehovForKontinuerligTilsynOgPleieFieldArrayProps {
  readOnly: boolean;
  fields: FieldArrayFieldsProps<Fields>;
}

const PerioderMedBehovForKontinuerligTilsynOgPleieFieldArray = ({
  readOnly,
  fields,
}: PerioderMedBehovForKontinuerligTilsynOgPleieFieldArrayProps) => {
  useEffect(() => {
    if (fields.length === 0) {
      fields.push({ fom: '', tom: '' });
    }
  }, []);

  return (
    <div className={styles.pickerContainer}>
      <PeriodFieldArray
        fields={fields}
        emptyPeriodTemplate={{
          fom: '',
          tom: '',
        }}
        shouldShowAddButton
        readOnly={readOnly}
      >
        {(fieldId, index, getRemoveButton) => (
          <FlexRow key={fieldId} wrap>
            <FlexColumn>
              <PeriodpickerField
                names={[`${fieldId}.fom`, `${fieldId}.tom`]}
                validate={[required, hasValidDate, dateRangesNotOverlapping]}
                defaultValue={null}
                readOnly={readOnly}
                label={index === 0 ? { id: 'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder' } : ''}
              />
            </FlexColumn>
            <FlexColumn>{getRemoveButton()}</FlexColumn>
          </FlexRow>
        )}
      </PeriodFieldArray>
    </div>
  );
};

export default PerioderMedBehovForKontinuerligTilsynOgPleieFieldArray;
