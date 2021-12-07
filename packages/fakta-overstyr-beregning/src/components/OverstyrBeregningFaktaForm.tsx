import React from "react";
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

import { Table, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Knapp } from "nav-frontend-knapper";
import { Textarea } from "nav-frontend-skjema";
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import styles from './OverstyrBeregningFaktaForm.less';
import OverstyrBeregningFeiloppsummering from "./OverstyrBeregningFeiloppsummering";
import { OverstyrInputBeregningDto } from "../types/OverstyrInputBeregningDto";
import { formaterDatoString } from "./utils";
import { OverstyrInputForBeregningDto } from "../types/OverstyrInputForBeregningDto";
import OverstyrBeregningAktivitetForm from "./OverstyrBeregningAktivitetForm";

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
        perioder: Yup.array().of(periodeSchema),
    });

    /**
     * @param firmaIdent Kan være enten orgnr eller aktørId
     * @returns utledet firmanavn fra arbeidsgiverOpplysningerPerId
     */
    const utledFirmaNavn = (firmaIdent: string) => {
        const firma = Object.values(arbeidsgiverOpplysningerPerId).find((arbeidsgiver => arbeidsgiver.identifikator === firmaIdent));
        return (firma) ? firma.navn : intl.formatMessage({ id: 'OverstyrInputForm.UkjentFirma' });
    }

    const utledBegrunnelse = () => aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT).begrunnelse || ''

    /**
     * Formik liker ikke null i value feltene, null verdier kan forekomme fra backend. 
     * "Oversetter" null verdier i skjemafeltene til undefined
     */
    const initialValues: OverstyrInputForBeregningDto = {
        kode: aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT,
        begrunnelse: utledBegrunnelse(),
        perioder: [{
            ...overstyrInputBeregning, aktivitetliste: overstyrInputBeregning.aktivitetliste.map((aktivitet) => ({
                ...aktivitet,
                "inntektPrAar": aktivitet.inntektPrAar || undefined,
                "refusjonPrAar": aktivitet.refusjonPrAar || undefined,
            }))
        }],
    }

    const erDeaktivert = (isValid) => readOnly || !submittable || !isValid;

    return (
        <div className={styles.container}>
            <VerticalSpacer thirtyTwoPx />
            <Formik
                initialValues={initialValues}
                onSubmit={values => {
                    submitCallback([values]);
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
                        <FieldArray name="perioder">
                            {() =>
                                <>
                                    {values.perioder.map((periode, periodeIndex) => {
                                        const { skjaeringstidspunkt, aktivitetliste } = periode;
                                        return <>
                                            <EtikettInfo className="skjaeringstidspunkt">
                                                Skjæringstidspunkt: {formaterDatoString(skjaeringstidspunkt)}
                                            </EtikettInfo>
                                            <FieldArray name={`perioder[${periodeIndex}].aktivitetliste`} >
                                                {() =>
                                                    <Table stripet headerTextCodes={[
                                                        "OverstyrInputForm.FirmaHeader",
                                                        "OverstyrInputForm.InntektPrAar",
                                                        'OverstyrInputForm.RefusjonPrAar'
                                                    ]}>
                                                        {aktivitetliste.length > 0 && aktivitetliste.map((aktivitet, aktivitetIndex) => {
                                                            const { arbeidsgiverAktørId, arbeidsgiverOrgnr } = aktivitet;
                                                            const firmaNavn = utledFirmaNavn((arbeidsgiverAktørId) || arbeidsgiverOrgnr);
                                                            return (
                                                                <OverstyrBeregningAktivitetForm
                                                                    key=""
                                                                    periodeIndex={periodeIndex}
                                                                    aktivitetIndex={aktivitetIndex}
                                                                    firmaNavn={firmaNavn} />
                                                            )
                                                        }
                                                        )}
                                                    </Table>
                                                }
                                            </FieldArray>
                                        </>
                                    })}
                                </>
                            }
                        </FieldArray>
                        <VerticalSpacer sixteenPx />
                        <Field name="begrunnelse">
                            {({ field, meta }) => <Textarea
                                id="begrunnelse"
                                label="Begrunnelse"
                                placeholder={intl.formatMessage({ id: 'OverstyrInputForm.Begrunnelse' })}
                                feil={meta.touched && meta.error ? meta.error : false}
                                value={field.value}
                                {...field} />}
                        </Field>
                        <VerticalSpacer sixteenPx />
                        <OverstyrBeregningFeiloppsummering utledFirmaNavn={utledFirmaNavn} />
                        <VerticalSpacer sixteenPx />
                        <Knapp disabled={erDeaktivert(isValid)} autoDisableVedSpinner type="hoved" htmlType="submit">
                            <FormattedMessage id="OverstyrInputForm.LagreAksjonspunkt" />
                        </Knapp>
                    </Form>
                }
            </Formik>
        </div >
    );
}

export default injectIntl(OverstyrBeregningFaktaForm);