import { EditedIcon } from '@fpsak-frontend/shared-components';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import Label from './Label';
import LabelType from './LabelType';
import styles from './readOnlyField.less';

interface ReadOnlyFieldProps {
  label?: LabelType;
  input: { value: string | number };
  isEdited?: boolean;
}

const hasValue = (value: string | number) => value !== undefined && value !== null && value !== '';

export const ReadOnlyField = ({ label, input, isEdited }: ReadOnlyFieldProps): JSX.Element => {
  if (!hasValue(input.value)) {
    return null;
  }
  return (
    <div className={styles.readOnlyContainer}>
      <Label input={label} readOnly />
      <Normaltekst className={styles.readOnlyContent}>
        {input.value}
        {isEdited && <EditedIcon />}
      </Normaltekst>
    </div>
  );
};

ReadOnlyField.defaultProps = {
  label: undefined,
  isEdited: false,
};

export default ReadOnlyField;
