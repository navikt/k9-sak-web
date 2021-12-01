import React from "react";
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { format, sub } from 'date-fns';
import { TableColumn, TableRow, Table, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Knapp } from "nav-frontend-knapper";
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Input } from "nav-frontend-skjema";
import { EtikettInfo } from 'nav-frontend-etiketter';
import styles from './OverstyrBeregningFaktaForm.less';

interface Props {
    behandlingId?: number;
};

/**
 * Får inn skjæringstidspunkt, kommer fra bakenden
 */
const skjaeringsTidspunkt = sub(new Date(), { years: 2 });

/**
 * Denne skal sikkert hete noe annet, og ligge i en annen fil/type
 */
interface Arbeidsgiver {
    firmaIdent: string;
    inntekt: string;
    refusjon: string;
}

/**
 * Definerer strukturen på dataene som skal sendes til aksjonspunktet, og representerer 
 * strukturen i skjemaet 
 */
interface FormikValues {
    arbeidsgivere: Arbeidsgiver[];
}

/**
 * OverstyrBeregningFaktaIndex
 */
const OverstyrBeregningFaktaForm = ({ behandlingId, intl }: Props & WrappedComponentProps) => {

    const arbeidsgiverSchema = Yup.object().shape({
        firmaIdent: Yup.string().required(),
        inntekt: Yup.number()
            .typeError(intl.formatMessage({ id: 'OverstyrInputForm.InntektFeltTypeFeil' }))
            .required(intl.formatMessage({ id: 'OverstyrInputForm.InntektFeltPakrevdFeil' })),
        refusjon: Yup.number()
            .typeError(intl.formatMessage({ id: 'OverstyrInputForm.RefusjonFeltTypeFeil' }))
            .required(intl.formatMessage({ id: 'OverstyrInputForm.RefusjonFeltPakrevdFeil' })),
    });

    const validationSchema = Yup.object().shape({ arbeidsgivere: Yup.array().of(arbeidsgiverSchema) });

    const firmaNavn = [
        { firmaIdent: '123ident', firmaNavn: 'Firma 1' },
        { firmaIdent: '321ident', firmaNavn: 'Firma 2' },
        { firmaIdent: '231ident', firmaNavn: 'Firma 3' },
    ];

    /**
     * Replikerer datastrukturen som skal sendes til aksjonspunktet
     */
    const iniitialValues: FormikValues = {
        arbeidsgivere: [
            {
                firmaIdent: '123ident',
                inntekt: null,
                refusjon: null,
            },
            {
                firmaIdent: '321ident',
                inntekt: null,
                refusjon: null,
            },
            {
                firmaIdent: '231ident',
                inntekt: null,
                refusjon: null,
            },
        ]
    };

    return (
        <div className={styles.container}>

            <header>
                <EtikettInfo className="skjaeringstidspunkt">
                    Skjæringstidspunkt: {format(skjaeringsTidspunkt, "dd-MM-yyyy HH:mm")}
                </EtikettInfo>
            </header>

            <VerticalSpacer thirtyTwoPx />
            <Formik
                initialValues={iniitialValues}
                onSubmit={values => {
                    /**
                     * håndter innsending her ... fullføre aksjonspunktet
                     */
                    console.log(JSON.stringify(values, null, 2));
                }}
                validationSchema={validationSchema}
                validateOnBlur
                validateOnChange
                validateOnMount
            >
                {({ values, isValid }) => {
                    // console.log( FormikErrors<Arbeidsgiver>);
                    console.log("values", values);
                    return <Form>
                        <FieldArray name="arbeidsgivere">
                            {() => (
                                <Table stripet headerTextCodes={["Firma", "Inntekt", "Refusjon"]}>
                                    {values.arbeidsgivere.length > 0 && values.arbeidsgivere.map((arbeidsgiver, index) => (
                                        <TableRow>
                                            <TableColumn>
                                                {firmaNavn.find(firma => firma.firmaIdent === arbeidsgiver.firmaIdent)?.firmaNavn}
                                            </TableColumn>
                                            <TableColumn>
                                                <Field name={`arbeidsgivere.${index}.inntekt`}>
                                                    {({ field, meta }) => <Input
                                                        type="number"
                                                        placeholder="Inntekt"
                                                        feil={meta.touched && meta.error ? meta.error : false}
                                                        {...field}
                                                    />}
                                                </Field>
                                            </TableColumn>
                                            <TableColumn>
                                                <Field name={`arbeidsgivere.${index}.refusjon`}>
                                                    {({ field, meta }) => <Input
                                                        type="number"
                                                        placeholder="Refusjon"
                                                        feil={meta.touched && meta.error ? meta.error : false}
                                                        {...field} />}
                                                </Field>
                                            </TableColumn>
                                        </TableRow>
                                    ))}
                                </Table>
                            )}
                        </FieldArray>
                        <VerticalSpacer sixteenPx />
                        <Knapp disabled={!isValid} autoDisableVedSpinner type="hoved" htmlType="submit">Lagre aksjonspunkt</Knapp>
                    </Form>
                }}
            </Formik>
        </div >
    );
}

export default injectIntl(OverstyrBeregningFaktaForm);