import { PeriodpickerField } from '@fpsak-frontend/form';
import { PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { dateRangesNotOverlapping, hasValidDate, required } from '@fpsak-frontend/utils';
import ExpandablePanel from '@navikt/nap-expandable-panel';
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
  erInnlagt: boolean;
}

const InnlagtBarnPeriodeFieldArray = ({ readOnly, fields, erInnlagt }: InnlagtBarnPeriodeFieldArrayProps) => {
  useEffect(() => {
    if (fields.length === 0) {
      fields.push({ fom: '', tom: '' });
    }
  }, []);

  if (!erInnlagt) {
    return null;
  }
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
          <ExpandablePanel
            isOpen
            renderHeader={() => <b>Oppgi periode hvor barnet er innlagt på sykehus</b>}
            onClick={() => console.log(123)}
          >
            <PeriodpickerField
              names={[`${fieldId}.fom`, `${fieldId}.tom`]}
              validate={[required, hasValidDate, dateRangesNotOverlapping]}
              defaultValue={null}
              readOnly={readOnly}
              label={index === 0 ? { id: 'MedisinskVilkarForm.Periode' } : ''}
              hideLabel
            />
            {getRemoveButton()}
          </ExpandablePanel>
        )}
      </PeriodFieldArray>
    </div>
  );
};

export default InnlagtBarnPeriodeFieldArray;
