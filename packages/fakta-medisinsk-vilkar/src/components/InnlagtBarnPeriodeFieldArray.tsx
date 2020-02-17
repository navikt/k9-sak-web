import { PeriodpickerField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { dateRangesNotOverlapping, hasValidDate, required } from '@fpsak-frontend/utils';
import { Periode } from '@k9-frontend/types/src/medisinsk-vilkår/MedisinskVilkår';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FieldArrayFieldsProps } from 'redux-form';
import styles from './medisinskVilkar.less';

interface Fields {
  fom: string;
  tom: string;
}

interface InnlagtBarnPeriodeFieldArrayProps {
  readOnly: boolean;
  fields: FieldArrayFieldsProps<Fields>;
  periodeTilVurdering: Periode;
}

const InnlagtBarnPeriodeFieldArray = ({ readOnly, fields, periodeTilVurdering }: InnlagtBarnPeriodeFieldArrayProps) => {
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
        fieldGroupClassName={styles.fieldGroup}
      >
        {(fieldId, index, getRemoveButton) => (
          <FlexRow wrap>
            <FlexColumn>
              <PeriodpickerField
                names={[`${fieldId}.fom`, `${fieldId}.tom`]}
                validate={[required, hasValidDate, dateRangesNotOverlapping]}
                defaultValue={null}
                readOnly={readOnly}
                label={index === 0 ? { id: 'MedisinskVilkarForm.Periode' } : ''}
                hideLabel
                disabledDays={{
                  before: moment(periodeTilVurdering.fom).toDate(),
                  after: moment(periodeTilVurdering.tom).toDate(),
                }}
              />
            </FlexColumn>
            <FlexColumn>{getRemoveButton()}</FlexColumn>
          </FlexRow>
        )}
      </PeriodFieldArray>
    </div>
  );
};

export default InnlagtBarnPeriodeFieldArray;
