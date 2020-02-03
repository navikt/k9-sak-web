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
  type: string;
}

const hasValue = (value: string | number) => value !== undefined && value !== null && value !== '';

export const ReadOnlyField = ({ label, input, isEdited, type }: ReadOnlyFieldProps): JSX.Element => {
  if (!hasValue(input.value)) {
    return null;
  }

  return (
    <div className={styles.readOnlyContainer}>
      <Label input={label} readOnly />
      <div className={type === 'textarea' ? styles.textarea : ''}>
        <Normaltekst className={styles.readOnlyContent}>
          {input.value}
          {isEdited && <EditedIcon />}
        </Normaltekst>
      </div>
    </div>
  );
};

ReadOnlyField.defaultProps = {
  label: undefined,
  isEdited: false,
  type: undefined,
};

export default ReadOnlyField;
