import React, { useEffect } from "react";
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { useFormikContext } from 'formik';

import { Feiloppsummering, FeiloppsummeringFeil } from "nav-frontend-skjema";
import { FirmaNavnMapping, FormikValues } from "./OverstyrBeregningFaktaForm";

interface ownProps {
    firmaNavn: FirmaNavnMapping[]
}

/**
 * Summerer opp feilene fra overstyr beregning skjemaet via Formik context
 */
const OverstyrBeregningFeiloppsummering = ({ firmaNavn, intl }: ownProps & WrappedComponentProps) => {
    const { values, errors, touched } = useFormikContext<FormikValues>();
    const [feil, setFeil] = React.useState<FeiloppsummeringFeil[]>([]);

    /**
     * sjekk alle berorrte felt med feil og legg til en feil til feiloppsummeringen for hver
     */
    useEffect(() => {
        const nyeFeil: FeiloppsummeringFeil[] = [];
        if (Array.isArray(errors.arbeidsgivere)) {
            errors.arbeidsgivere.forEach((arbeidsgiverFeil: any, index: number) => {
                if (arbeidsgiverFeil) { // Kan bli undefined etter en feil er "løst"

                    // Firmanavn fra firmanavnmappingen
                    const firmaNavnet = firmaNavn.find(firma => firma.firmaIdent === values.arbeidsgivere[index].firmaIdent)?.firmaNavn;

                    if (touched.arbeidsgivere && touched.arbeidsgivere[index]) {

                        // Legg til feil om inntekt feltet er berørt, og feltet har en feil
                        if (touched.arbeidsgivere[index].inntekt && arbeidsgiverFeil.inntekt) {
                            nyeFeil.push({
                                skjemaelementId: `arbeidsgivere-${index}-inntekt-id`,
                                feilmelding: `${intl.formatMessage({ id: 'OverstyrInputForm.MåOppgiInntektFor' })} ${firmaNavnet}`
                            });
                        }

                        // Legg til feil om refusjon feltet er berørt, og feltet har en feil
                        if (touched.arbeidsgivere[index].refusjon && arbeidsgiverFeil.refusjon) {
                            nyeFeil.push({
                                skjemaelementId: `arbeidsgivere-${index}-refusjon-id`,
                                feilmelding: `${intl.formatMessage({ id: 'OverstyrInputForm.MåOppgiRefusjonFor' })} ${firmaNavnet}`
                            });
                        }
                    }
                }
            })
        }
        setFeil(nyeFeil);
    }, [errors, touched])

    /**
     * Returner feiloppsummering hvis det finnes feil
     */
    return (feil.length > 0) ? <Feiloppsummering
        tittel={intl.formatMessage({ id: 'OverstyrInputForm.Feiloppsummering' })}
        feil={feil}
    /> : null;
}

export default injectIntl(OverstyrBeregningFeiloppsummering);