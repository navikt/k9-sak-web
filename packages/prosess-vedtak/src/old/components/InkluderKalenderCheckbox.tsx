import React, { useEffect } from 'react';
import { Field } from 'formik';
import { IntlShape } from 'react-intl';

import { Checkbox } from '@navikt/ds-react';

import { fieldnames } from '../../konstanter';

type OwnProps = {
  intl: IntlShape;
  setFieldValue: (name: string, value: boolean) => void;
  skalBrukeOverstyrendeFritekstBrev: boolean;
  disabled: boolean;
};
const InkluderKalenderCheckbox = ({
  intl,
  setFieldValue,
  skalBrukeOverstyrendeFritekstBrev,
  disabled,
}: OwnProps): JSX.Element | null => {
  useEffect(() => () => setFieldValue(fieldnames.IKLUDER_KALENDER_VED_OVERSTYRING, false), []);

  if (!skalBrukeOverstyrendeFritekstBrev) {
    return null;
  }

  return (
    <Field name={fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING}>
      {({ field }) => (
        <Checkbox
          onChange={() => setFieldValue(field.name, !field.value)}
          checked={field.value}
          disabled={disabled}
          size="small"
        >
          {intl.formatMessage({ id: 'VedtakForm.InkluderKalenderVedOverstyring' })}
        </Checkbox>
      )}
    </Field>
  );
};

export default InkluderKalenderCheckbox;
