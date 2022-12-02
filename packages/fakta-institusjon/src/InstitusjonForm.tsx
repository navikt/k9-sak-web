import { Period } from '@navikt/k9-period-utils';
import { Box, Margin, DetailView, LabelledContent, Form } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';
import { Calender } from '@navikt/ds-icons';

import React from 'react';
import { InstitusjonVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import { required } from '@fpsak-frontend/utils';
import { Formik } from 'formik';
import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { Button } from '@navikt/ds-react';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  GODKJENT_INSTITUSJON = 'GODKJENT_INSTITUSJON',
}

enum RadioOptions {
  JA = 'ja',
  NEI = 'nei',
}

interface VurderingAvBeredskapsperioderFormProps {
  vurdering: InstitusjonVurderingMedPerioder;
  avbrytRedigering: () => void;
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

interface FormState {
  [fieldname.BEGRUNNELSE]: string;
  [fieldname.GODKJENT_INSTITUSJON]: string;
}

const InstitusjonForm = ({
  vurdering,
  avbrytRedigering,
  readOnly,
  løsAksjonspunkt,
}: VurderingAvBeredskapsperioderFormProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const godkjentInstitusjonInitialValue = () => {
    if ([Vurderingsresultat.GODKJENT_AUTOMATISK, Vurderingsresultat.GODKJENT_MANUELT].includes(vurdering.resultat)) {
      return RadioOptions.JA;
    }
    if (
      [Vurderingsresultat.IKKE_GODKJENT_AUTOMATISK, Vurderingsresultat.IKKE_GODKJENT_MANUELT].includes(
        vurdering.resultat,
      )
    ) {
      return RadioOptions.NEI;
    }
    return null;
  };

  const initialValues = {
    [fieldname.BEGRUNNELSE]: vurdering.begrunnelse || '',
    [fieldname.GODKJENT_INSTITUSJON]: godkjentInstitusjonInitialValue(),
  };

  const mapValuesTilAksjonspunktPayload = (values: FormState) => ({
    godkjent: values[fieldname.GODKJENT_INSTITUSJON] === 'ja',
    begrunnelse: values[fieldname.BEGRUNNELSE],
    journalpostId: vurdering.journalpostId,
  });
  return (
    <DetailView title="Vurdering av institusjon">
      <Formik
        initialValues={initialValues}
        onSubmit={values => løsAksjonspunkt(mapValuesTilAksjonspunktPayload(values))}
      >
        {({ handleSubmit }) => (
          <>
            <div>
              <Calender /> <span>{vurdering.perioder.map(periode => periode.prettifyPeriod())}</span>
            </div>
            <Box marginTop={Margin.xLarge}>
              <LabelledContent
                label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
                content={vurdering.institusjon}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <TextAreaFormik
                label="Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd."
                name={fieldname.BEGRUNNELSE}
                validate={[required]}
                readOnly={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <RadioGroupFormik
                legend="Er det behov for beredskap?"
                options={[
                  { value: RadioOptions.JA, label: 'Ja' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                name={fieldname.GODKJENT_INSTITUSJON}
                disabled={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <Button
                size="small"
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  setIsSubmitting(true);
                  handleSubmit();
                }}
              >
                Bekreft og fortsett
              </Button>
              <Button
                size="small"
                variant="secondary"
                type="button"
                disabled={isSubmitting}
                onClick={avbrytRedigering}
                style={{ marginLeft: '1rem' }}
              >
                Avbryt redigering
              </Button>
            </Box>
          </>
        )}
      </Formik>
    </DetailView>
  );
};

export default InstitusjonForm;
