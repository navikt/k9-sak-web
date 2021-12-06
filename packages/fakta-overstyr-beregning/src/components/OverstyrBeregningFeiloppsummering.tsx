import React, { useEffect } from "react";
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { useFormikContext } from 'formik';

import { Feiloppsummering, FeiloppsummeringFeil } from "nav-frontend-skjema";
import { OverstyrInputBeregningDto } from "../types/OverstyrInputBeregningDto";

interface ownProps {
    utledFirmaNavn: (firmaIdent: string) => string;
}

/**
 * Summerer opp feilene fra overstyr beregning skjemaet via Formik context
 */
const OverstyrBeregningFeiloppsummering = ({ utledFirmaNavn, intl }: ownProps & WrappedComponentProps) => {
    const { values, errors, touched } = useFormikContext<OverstyrInputBeregningDto>();
    const [feil, setFeil] = React.useState<FeiloppsummeringFeil[]>([]);

    console.log("values", values);
    console.log("errors", errors);
    /** 
     * sjekk alle berorrte felt med feil og legg til en feil til feiloppsummeringen for hver
     */
    useEffect(() => {
        const nyeFeil: FeiloppsummeringFeil[] = [];
        if (Array.isArray(errors.aktivitetliste)) {
            errors.aktivitetliste.forEach((aktivitetsFeil: any, index: number) => {
                if (aktivitetsFeil) { // Kan bli undefined etter en feil er "løst"

                    // Firmanavn fra firmanavnmappingen
                    const firmaNavnet = "tester";// utledFirmaNavn((arbeidsgiverAktørId) || arbeidsgiverOrgnr)

                    if (touched.aktivitetliste && touched.aktivitetliste[index]) {

                        // Legg til feil om inntekt feltet er berørt, og feltet har en feil
                        if (touched.aktivitetliste[index].inntektPrAar && aktivitetsFeil.inntektPrAar) {
                            nyeFeil.push({
                                skjemaelementId: `aktivitetliste-${index}-inntekt-pr-ar-id`,
                                feilmelding: `${intl.formatMessage({ id: 'OverstyrInputForm.MåOppgiInntektFor' })} ${firmaNavnet}`
                            });
                        }

                        // Legg til feil om refusjon feltet er berørt, og feltet har en feil
                        if (touched.aktivitetliste[index].refusjonPrAar && aktivitetsFeil.refusjonPrAar) {
                            nyeFeil.push({
                                skjemaelementId: `aktivitetliste-${index}-refusjon-pr-ar-id`,
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