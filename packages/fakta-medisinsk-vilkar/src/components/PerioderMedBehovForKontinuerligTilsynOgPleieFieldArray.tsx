import { PeriodpickerField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { dateRangesNotOverlapping, hasValidDate, required } from '@fpsak-frontend/utils';
import React, { useEffect } from 'react';
import { FieldArrayFieldsProps } from 'redux-form';
import BehovForEnEllerToOmsorgspersonerFields from './BehovForEnEllerToOmsorgspersonerFields';
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
          <div className={styles.periodeContainer}>
            <FlexRow key={fieldId} wrap>
              <FlexColumn>
                <PeriodpickerField
                  names={[`${fieldId}.fom`, `${fieldId}.tom`]}
                  validate={[required, hasValidDate, dateRangesNotOverlapping]}
                  defaultValue={null}
                  readOnly={readOnly}
                  label={{ id: 'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder' }}
                />
              </FlexColumn>
              <FlexColumn>{getRemoveButton()}</FlexColumn>
            </FlexRow>
            <FlexRow>
              <FlexColumn>
                <BehovForEnEllerToOmsorgspersonerFields readOnly={false} fieldId={fieldId} />
              </FlexColumn>
            </FlexRow>
          </div>
        )}
      </PeriodFieldArray>
    </div>
  );
};

export default PerioderMedBehovForKontinuerligTilsynOgPleieFieldArray;
