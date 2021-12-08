import React from "react";
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { Field } from "formik";
import { Input } from "nav-frontend-skjema";
import styles from './OverstyrBeregningFaktaForm.less';

interface Props {
    key: string;
    periodeIndex: number;
    aktivitetIndex: number;
    firmaNavn: string;
}

const OverstyrBeregningAktivitetForm: React.FC<Props & WrappedComponentProps> = ({
    key,
    periodeIndex,
    aktivitetIndex,
    firmaNavn,
    intl
}) => (
    <TableRow key={key}>
        <TableColumn>
            <span className={styles.firmaNavn}>
                {firmaNavn}
            </span>
        </TableColumn>
        <TableColumn>
            <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.inntektPrAar`}>
                {({ field, meta }) => <Input
                    id={`perioder-${periodeIndex}-aktivitetliste-${aktivitetIndex}-inntekt`}
                    type="number"
                    placeholder={intl.formatMessage({ id: 'OverstyrInputForm.InntektPrAar' })}
                    feil={meta.touched && meta.error ? meta.error : false}
                    value={field.value}
                    {...field}
                />}
            </Field>
        </TableColumn>
        <TableColumn>
            <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.refusjonPrAar`}>
                {({ field, meta }) => <Input
                    id={`perioder-${periodeIndex}-aktivitetliste-${aktivitetIndex}-refusjon`}
                    type="number"
                    placeholder={intl.formatMessage({ id: 'OverstyrInputForm.RefusjonPrAar' })}
                    feil={meta.touched && meta.error ? meta.error : false}
                    value={field.value}
                    {...field} />}
            </Field>
        </TableColumn>
    </TableRow>
)

export default injectIntl(OverstyrBeregningAktivitetForm);


