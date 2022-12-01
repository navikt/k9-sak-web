import { Period } from '@navikt/k9-period-utils';
import { Box, Margin, DetailView, LabelledContent, Form } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';

import React from 'react';
import { InstitusjonVurderingMedPeriode, Vurderingsresultat } from '@k9-sak-web/types';
import { required } from '@fpsak-frontend/utils';
import { Formik } from 'formik';
import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  GODKJENT_INSTITUSJON = 'GODKJENT_INSTITUSJON',
}

enum RadioOptions {
  JA = 'ja',
  NEI = 'nei',
}

interface VurderingAvBeredskapsperioderFormProps {
  vurdering: InstitusjonVurderingMedPeriode;
  onCancelClick: () => void;
  readOnly: boolean;
}

interface FormState {
  [fieldname.BEGRUNNELSE]: string;
  [fieldname.GODKJENT_INSTITUSJON]: string;
}

const InstitusjonForm = ({
  vurdering,
  onCancelClick,
  readOnly,
}: VurderingAvBeredskapsperioderFormProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const godkjentInstitusjonInitialValue = () => {
    if (vurdering.resultat === Vurderingsresultat.OPPFYLT) {
      return RadioOptions.JA;
    }
    if (vurdering.resultat === Vurderingsresultat.IKKE_OPPFYLT) {
      return RadioOptions.NEI;
    }
    return null;
  };

  const initialValues = {
    [fieldname.BEGRUNNELSE]: vurdering.begrunnelse || '',
    [fieldname.GODKJENT_INSTITUSJON]: godkjentInstitusjonInitialValue(),
  };
  return (
    <DetailView title="Vurdering av beredskap">
      <Formik initialValues={initialValues} onSubmit={values => console.log(values)}>
        <Box marginTop={Margin.xLarge}>
          <TextAreaFormik
            label="Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd."
            name={fieldname.BEGRUNNELSE}
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
      </Formik>
    </DetailView>
  );
};

export default InstitusjonForm;
