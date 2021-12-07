import React, { useEffect } from "react";
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { useFormikContext } from 'formik';

import { Feiloppsummering, FeiloppsummeringFeil } from "nav-frontend-skjema";
import { OverstyrInputForBeregningDto } from "../types/OverstyrInputForBeregningDto";

interface Props {
    utledFirmaNavn: (firmaIdent: string) => string;
}

/**
 * Summerer opp feilene fra overstyr beregning skjemaet via Formik context
 */
const OverstyrBeregningFeiloppsummering = ({ utledFirmaNavn, intl }: Props & WrappedComponentProps) => {
    const { values, errors, touched } = useFormikContext<OverstyrInputForBeregningDto>();
    const [feil, setFeil] = React.useState<FeiloppsummeringFeil[]>([]);

    /** 
     * sjekk alle berørte felt med feil og legg til en feil til feiloppsummeringen for hver
     */
    useEffect(() => {
        const nyeFeil: FeiloppsummeringFeil[] = [];

        if (errors.begrunnelse && touched.begrunnelse) {
            nyeFeil.push({
                skjemaelementId: `begrunnelse`,
                feilmelding: `${intl.formatMessage({ id: 'OverstyrInputForm.BegrunnelseErPåkrevd' })}`
            });
        }

        if (Array.isArray(errors.perioder)) {
            errors.perioder.forEach((periode, periodeIndex) => {
                if (Array.isArray(periode.aktivitetliste)) {
                    periode.aktivitetliste.forEach((aktivitetFeil, aktivitetIndex) => {

                        if (
                            touched
                            && touched.perioder
                            && touched.perioder[periodeIndex]
                            && touched.perioder[periodeIndex].aktivitetliste
                            && touched.perioder[periodeIndex].aktivitetliste[aktivitetIndex]
                        ) {
                            const touchedAktivitet = touched?.perioder[periodeIndex].aktivitetliste[aktivitetIndex];
                            const { arbeidsgiverAktørId, arbeidsgiverOrgnr } = values.perioder[periodeIndex].aktivitetliste[aktivitetIndex];
                            const firmaNavnet = utledFirmaNavn((arbeidsgiverAktørId) || arbeidsgiverOrgnr)
                            const skjemaelementIdPrefix = `perioder-${periodeIndex}-aktivitetliste-${aktivitetIndex}`;

                            if (touched.perioder && touchedAktivitet.inntektPrAar && aktivitetFeil.inntektPrAar) {
                                nyeFeil.push({
                                    skjemaelementId: `${skjemaelementIdPrefix}-inntekt`,
                                    feilmelding: `${intl.formatMessage({ id: 'OverstyrInputForm.MåOppgiInntektFor' })} ${firmaNavnet}`
                                });
                            }

                            if (touched.perioder && touchedAktivitet.refusjonPrAar && aktivitetFeil.refusjonPrAar) {
                                nyeFeil.push({
                                    skjemaelementId: `${skjemaelementIdPrefix}-refusjon`,
                                    feilmelding: `${intl.formatMessage({ id: 'OverstyrInputForm.MåOppgiRefusjonFor' })} ${firmaNavnet}`
                                });
                            }

                        }
                    });

                }
            });
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