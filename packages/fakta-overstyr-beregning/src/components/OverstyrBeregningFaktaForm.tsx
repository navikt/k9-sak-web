import React from "react";
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

import { TableColumn, TableRow, Table, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Knapp } from "nav-frontend-knapper";
import { Input, Textarea } from "nav-frontend-skjema";
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId, SubmitCallback } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import styles from './OverstyrBeregningFaktaForm.less';
import OverstyrBeregningFeiloppsummering from "./OverstyrBeregningFeiloppsummering";
import { OverstyrInputBeregningDto } from "../types/OverstyrInputBeregningDto";
import { formaterDatoString } from "./utils";

interface Props {
    arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
    overstyrInputBeregning: OverstyrInputBeregningDto,
    submitCallback: (SubmitCallback) => void,
    readOnly: boolean,
    submittable: boolean,
    aksjonspunkter: Aksjonspunkt[],
};

/**
 * OverstyrBeregningFaktaIndex
 */
const OverstyrBeregningFaktaForm = ({
    overstyrInputBeregning,
    arbeidsgiverOpplysningerPerId,
    submitCallback,
    readOnly,
    submittable,
    aksjonspunkter,
    intl
}: Props & WrappedComponentProps) => {

    const aktivitetSchema = Yup.object().shape({
        arbiedsgiverAktørId: Yup.string(),
        arbeidsgiverOrgnr: Yup.string(),
        inntektPrAar: Yup.number()
            .typeError(intl.formatMessage({ id: 'OverstyrInputForm.InntektFeltTypeFeil' }))
            .required(intl.formatMessage({ id: 'OverstyrInputForm.InntektFeltPakrevdFeil' })),
        refusjonPrAar: Yup.number()
            .typeError(intl.formatMessage({ id: 'OverstyrInputForm.RefusjonFeltTypeFeil' }))
            .required(intl.formatMessage({ id: 'OverstyrInputForm.RefusjonFeltPakrevdFeil' })),
    });

    const periodeSchema = Yup.object().shape({
        skjaeringstudspunkt: Yup.string(),
        aktivitetliste: Yup.array().of(aktivitetSchema)
    });

    const validationSchema = Yup.object().shape({
        kode: Yup.string().required(),
        begrunnelse: Yup.string().required(intl.formatMessage({ id: 'OverstyrInputForm.BegrunnelseErPåkrevd' })),
        perioder: periodeSchema,
    });

    /**
     * @param firmaIdent Kan være enten orgnr eller aktørId
     * @returns utledet firmanavn fra arbeidsgiverOpplysningerPerId
     */
    const utledFirmaNavn = (firmaIdent: string) => {
        const firma = Object.values(arbeidsgiverOpplysningerPerId).find((arbeidsgiver => arbeidsgiver.identifikator === firmaIdent));
        return (firma) ? firma.navn : "Ukjent firmanavn";
    }

    const utledBegrunnelse = () => aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT).begrunnelse || ''

    const kanLagres = () => { }
    return (
        <div className={styles.container}>
            <VerticalSpacer thirtyTwoPx />
            <Formik
                initialValues={
                    {
                        kode: aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT,
                        begrunnelse: utledBegrunnelse(),
                        perioder: overstyrInputBeregning
                    }
                }
                onSubmit={values => {
                    const submitValues = {
                        kode: values.kode,
                        begrunnelse: values.begrunnelse,
                        perioder: [values.perioder]
                    };
                    submitCallback([submitValues]);
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify(values, null, 2));
                }}
                validationSchema={validationSchema}
                validateOnBlur
                validateOnChange
                validateOnMount
            >
                {({ values, isValid }) =>
                    <Form>
                        <EtikettInfo className="skjaeringstidspunkt">
                            Skjæringstidspunkt: {formaterDatoString(values.perioder.skjaeringstidspunkt)}
                        </EtikettInfo>
                        <FieldArray name="perioder.aktivitetliste">
                            {() => (
                                <Table stripet headerTextCodes={["Firma", "Inntekt pr. år", "Refusjon pr. år"]}>
                                    {values.perioder.aktivitetliste.length > 0 && values.perioder.aktivitetliste.map((aktivitet, index) => {
                                        const { arbeidsgiverAktørId, arbeidsgiverOrgnr } = aktivitet;
                                        return (
                                            <TableRow>
                                                <TableColumn>
                                                    <span className={styles.firmaNavn}>
                                                        {utledFirmaNavn((arbeidsgiverAktørId) || arbeidsgiverOrgnr)}
                                                    </span>
                                                </TableColumn>
                                                <TableColumn>
                                                    <Field name={`perioder.aktivitetliste.${index}.inntektPrAar`}>
                                                        {({ field, meta }) => <Input
                                                            id={`perioder-ktivitetliste-${index}-inntekt-pr-ar-id`}
                                                            type="number"
                                                            placeholder="Inntekt pr. år"
                                                            feil={meta.touched && meta.error ? meta.error : false}
                                                            {...field}
                                                        />}
                                                    </Field>
                                                </TableColumn>
                                                <TableColumn>
                                                    <Field name={`perioder.aktivitetliste.${index}.refusjonPrAar`}>
                                                        {({ field, meta }) => <Input
                                                            id={`perioder-aktivitetliste-${index}-refusjon-pr-ar-id`}
                                                            type="number"
                                                            placeholder="Refusjon pr. år"
                                                            feil={meta.touched && meta.error ? meta.error : false}
                                                            {...field} />}
                                                    </Field>
                                                </TableColumn>
                                            </TableRow>
                                        )
                                    }
                                    )}
                                </Table>
                            )}
                        </FieldArray>
                        <VerticalSpacer sixteenPx />
                        <Field name="begrunnelse">
                            {({ field, meta }) => <Textarea
                                id="begrunnelse"
                                label="Begrunnelse"
                                placeholder="Begrunnelse"
                                feil={meta.touched && meta.error ? meta.error : false}
                                {...field} />}
                        </Field>
                        <VerticalSpacer sixteenPx />
                        {/* <OverstyrBeregningFeiloppsummering utledFirmaNavn={utledFirmaNavn} /> */}
                        <VerticalSpacer sixteenPx />
                        <Knapp disabled={!isValid} autoDisableVedSpinner type="hoved" htmlType="submit">Lagre aksjonspunkt</Knapp>
                    </Form>
                }
            </Formik>
        </div >
    );
}

export default injectIntl(OverstyrBeregningFaktaForm);