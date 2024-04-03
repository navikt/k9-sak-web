import { EditedIcon } from '@fpsak-frontend/shared-components';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import Label from './Label';
import LabelType from './LabelType';
import styles from './readOnlyField.module.css';

export interface ReadOnlyFieldProps {
  label?: LabelType;
  input?: { value: string | number };
  isEdited?: boolean;
  type?: string;
  renderReadOnlyValue?: (value: any) => any;
  field?: { value: string | number };
}

const hasValue = (value: string | number) => value !== undefined && value !== null && value !== '';

export const ReadOnlyField = ({
  label,
  input,
  isEdited,
  type,
  field,
  renderReadOnlyValue,
}: ReadOnlyFieldProps): JSX.Element => {
  const value = input?.value || field?.value;
  if (!hasValue(value)) {
    return null;
  }

  return (
    <div className={styles.readOnlyContainer}>
      <Label input={label} readOnly />
      <div className={type === 'textarea' ? styles.textarea : ''}>
        <BodyShort size="small" className={styles.readOnlyContent}>
          {renderReadOnlyValue ? renderReadOnlyValue(value) : value}
          {isEdited && <EditedIcon />}
        </BodyShort>
      </div>
    </div>
  );
};

ReadOnlyField.defaultProps = {
  label: undefined,
  isEdited: false,
};

export default ReadOnlyField;
