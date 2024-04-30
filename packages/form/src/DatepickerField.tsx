import { Datepicker } from '@fpsak-frontend/shared-components';
import { ACCEPTED_DATE_INPUT_FORMATS, DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import moment from 'moment';
import React from 'react';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';

interface DatepickerFieldProps {
  name: string;
  label: LabelType;
  readOnly?: boolean;
  format?: (value: string) => string;
  parse?: (value: string) => string;
  isEdited?: boolean;
  validate?: (
    | ((text: any) => ({ id: string; length?: undefined } | { length: any; id?: undefined })[])
    | ((text: any) => ({ id?: string; limit?: any } | { limit: any; id?: string })[])
    | ((value: any) => { id: string }[])
    | ((text: any) => ({ id: string; text?: undefined } | { text: any; id?: undefined })[])
  )[];
  disabledDays?: {
    before: Date;
    after: Date;
  };
  dataId?: string;
  hideLabel?: boolean;
}

const isoToDdMmYyyy = (string: string): string => {
  const parsedDate = moment(string, ISO_DATE_FORMAT, true);
  if (parsedDate.isValid()) {
    return parsedDate.format(DDMMYYYY_DATE_FORMAT);
  }
  return string;
};

const acceptedFormatToIso = (string: string): string => {
  const validDate = ACCEPTED_DATE_INPUT_FORMATS.map(format => moment(string, format, true)).find(parsedDate =>
    parsedDate.isValid(),
  );
  if (validDate) {
    return validDate.format(ISO_DATE_FORMAT);
  }
  return string;
};

export const RenderDatepickerField = renderNavField(Datepicker);

const DatepickerField = ({ name, label, readOnly, format, parse, isEdited, ...otherProps }: DatepickerFieldProps) => (
  <Field
    name={name}
    component={readOnly ? ReadOnlyField : RenderDatepickerField}
    label={label}
    {...otherProps}
    format={value => isoToDdMmYyyy(format(value))}
    parse={value => parse(acceptedFormatToIso(value))}
    readOnly={readOnly}
    readOnlyHideEmpty
    isEdited={isEdited}
  />
);

DatepickerField.defaultProps = {
  readOnly: false,
  isEdited: false,
  format: value => value,
  parse: value => value,
};

export default DatepickerField;
