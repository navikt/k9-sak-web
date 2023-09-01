import { TextAreaField, behandlingFormValueSelector, isBehandlingFormDirty } from '@fpsak-frontend/form';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import React from 'react';
import { connect } from 'react-redux';

import aktivtArbeidsforholdHandling from '../../kodeverk/aktivtArbeidsforholdHandling';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';
import styles from './arbeidsforholdBegrunnelse.css';

interface PureOwnProps {
  readOnly: boolean;
  formName: string;
  behandlingId: number;
  behandlingVersjon: number;
}

interface MappedOwnProps {
  isDirty: boolean;
  harBegrunnelse: boolean;
  skalAvslaaYtelse: boolean;
}

/**
 * ArbeidsforholdBegrunnelse er ansvarlig for å vise begrunnelsesfeltet.
 */
export const ArbeidsforholdBegrunnelse = ({
  readOnly,
  formName,
  isDirty,
  harBegrunnelse,
  skalAvslaaYtelse,
  behandlingId,
  behandlingVersjon,
}: PureOwnProps & MappedOwnProps) => (
  <div className={styles.container}>
    <BehandlingFormFieldCleaner
      formName={formName}
      fieldNames={['begrunnelse']}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    >
      {(isDirty || harBegrunnelse) && !skalAvslaaYtelse && (
        <TextAreaField
          name="begrunnelse"
          label={{ id: 'PersonArbeidsforholdDetailForm.Begrunnelse' }}
          validate={[required, minLength(3), maxLength(400), hasValidText]}
          maxLength={400}
          readOnly={readOnly}
        />
      )}
    </BehandlingFormFieldCleaner>
  </div>
);

const mapStateToProps = (state: any, initialProps: PureOwnProps): MappedOwnProps => {
  const { formName, behandlingId, behandlingVersjon } = initialProps;
  const aktivtArbeidsforholdHandlingValue = behandlingFormValueSelector(
    formName,
    behandlingId,
    behandlingVersjon,
  )(state, 'aktivtArbeidsforholdHandlingField');
  return {
    isDirty: isBehandlingFormDirty(formName, behandlingId, behandlingVersjon)(state),
    harBegrunnelse: !!behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'begrunnelse'),
    skalAvslaaYtelse: aktivtArbeidsforholdHandlingValue === aktivtArbeidsforholdHandling.AVSLA_YTELSE,
  };
};

export default connect(mapStateToProps)(ArbeidsforholdBegrunnelse);
