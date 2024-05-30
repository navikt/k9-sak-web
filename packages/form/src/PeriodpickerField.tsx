import { Periodpicker } from '@fpsak-frontend/shared-components';
import { ACCEPTED_DATE_INPUT_FORMATS, DDMMYYYY_DATE_FORMAT, haystack, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import moment from 'moment';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { Fields } from 'redux-form';
import Label from './Label';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';

interface PeriodpickerFieldProps {
  names: string[];
  label?: LabelType;
  readOnly?: boolean;
  hideLabel?: boolean;
  format?: (value: string) => string;
  parse?: (value: string) => string;
  renderIfMissingDateOnReadOnly?: boolean;
  validate?: ((value: string) => boolean | undefined | { id: string }[])[] | ((value: string) => boolean | undefined);
  dataId?: string;
  renderUpwards?: boolean;
  ariaLabel?: string;
  disabledDays?: {
    before: Date;
    after: Date;
  };
}

const formatError = (intl: IntlShape, otherProps: any, names: string[]) => {
  const getField1 = haystack(otherProps, names[0]);
  const meta1 = getField1.meta;

  if (meta1.submitFailed && meta1.error) {
    // @ts-ignore
    return intl.formatMessage(...meta1.error);
  }
  const getField2 = haystack(otherProps, names[1]);
  const meta2 = getField2.meta;
  if (meta2.submitFailed && meta2.error) {
    // @ts-ignore
    return intl.formatMessage(...meta2.error);
  }
  return undefined;
};

const hasValue = (value: string) => value !== undefined && value !== null && value !== '';

// eslint-disable-next-line react/prop-types
const renderReadOnly =
  () =>
  ({ names, renderIfMissingDateOnReadOnly, ...otherProps }: Partial<PeriodpickerFieldProps>) => {
    const getFomDate = haystack(otherProps, names[0]);
    const getTomDate = haystack(otherProps, names[1]);
    const fomDate = getFomDate.input.value;
    const tomDate = getTomDate.input.value;
    if (hasValue(fomDate) && hasValue(tomDate)) {
      return <ReadOnlyField input={{ value: `${fomDate} - ${tomDate}` }} {...otherProps} />;
    }
    if (renderIfMissingDateOnReadOnly) {
      if (hasValue(fomDate) && !hasValue(tomDate)) {
        return <ReadOnlyField input={{ value: `${fomDate} - ` }} {...otherProps} />;
      }
      if (!hasValue(fomDate) && hasValue(tomDate)) {
        return <ReadOnlyField input={{ value: ` - ${tomDate}` }} {...otherProps} />;
      }
    }
    return null;
  };

const renderPeriodpicker = (hideLabel?: boolean) =>
  injectIntl(
    ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      intl,
      label,
      names,
      ...otherProps
    }: {
      intl: IntlShape;
      label: LabelType;
      names: string[];
    }) => {
      const fieldProps = {
        id: `${names[0]}-${names[1]}`,
        feil: formatError(intl, otherProps, names),
        label: <Label input={label} readOnly={false} />,
        names,
      };
      // @ts-ignore TODO Fiks
      return <Periodpicker {...fieldProps} {...otherProps} hideLabel={hideLabel} />;
    },
  );

const isoToDdMmYyyy = (string: string) => {
  const parsedDate = moment(string, ISO_DATE_FORMAT, true);
  return parsedDate.isValid() ? parsedDate.format(DDMMYYYY_DATE_FORMAT) : string;
};

const acceptedFormatToIso = (value: string): string => {
  const validDate = ACCEPTED_DATE_INPUT_FORMATS.map(format => moment(value, format, true)).find(parsedDate =>
    parsedDate.isValid(),
  );

  return validDate ? validDate.format(ISO_DATE_FORMAT) : value;
};

const formatValue = (format: (value: string) => string) => (value: string) => isoToDdMmYyyy(format(value));
const parseValue = (parse: (value: string) => string) => (value: string) => parse(acceptedFormatToIso(value));

const PeriodpickerField = ({
  names,
  label = '',
  readOnly = false,
  format = value => value,
  parse = value => value,
  hideLabel,
  renderIfMissingDateOnReadOnly = false,
  ...otherProps
}: PeriodpickerFieldProps) => (
  <Fields
    names={names}
    component={readOnly ? renderReadOnly() : renderPeriodpicker(hideLabel)}
    label={label}
    {...otherProps}
    format={formatValue(format)}
    parse={parseValue(parse)}
    readOnly={readOnly}
    renderIfMissingDateOnReadOnly={renderIfMissingDateOnReadOnly}
  />
);

export default PeriodpickerField;
