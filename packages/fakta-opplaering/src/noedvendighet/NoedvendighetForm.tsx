import { Box, Margin, DetailView } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';
import { Calender } from '@navikt/ds-icons';

import React, { useContext, useEffect } from 'react';
import { NoedvendighetVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { required } from '@fpsak-frontend/utils';
import { Field, Formik } from 'formik';
import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { Button } from '@navikt/ds-react';
import {
  FaktaOpplaeringContext,
  FaktaOpplaeringContextTypes,
} from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import { useIntl } from 'react-intl';
import DokumenterIVurderingen from '../components/DokumenterIVurderingen';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  NOEDVENDIG_OPPLAERING = 'NOEDVENDIG_OPPLAERING',
  DOKUMENTER = 'DOKUMENTER',
}

enum RadioOptions {
  JA = 'ja',
  NEI = 'nei',
}

interface VurderingAvBeredskapsperioderFormProps {
  vurdering: NoedvendighetVurdering;
  avbrytRedigering: () => void;
  erRedigering: boolean;
}

interface FormState {
  [fieldname.BEGRUNNELSE]: string;
  [fieldname.NOEDVENDIG_OPPLAERING]: string;
  [fieldname.DOKUMENTER]: string[];
}

const NoedvendighetForm = ({
  vurdering,
  avbrytRedigering,
  erRedigering,
}: VurderingAvBeredskapsperioderFormProps): JSX.Element => {
  const { readOnly, løsAksjonspunktNødvendighet, opplaeringDokumenter } =
    useContext<FaktaOpplaeringContextTypes>(FaktaOpplaeringContext);
  const intl = useIntl();

  useEffect(
    () => () => {
      avbrytRedigering();
    },
    [],
  );

  const godkjentNoedvendighetInitialValue = () => {
    if ([Vurderingsresultat.GODKJENT].includes(vurdering.resultat)) {
      return RadioOptions.JA;
    }
    if ([Vurderingsresultat.IKKE_GODKJENT].includes(vurdering.resultat)) {
      return RadioOptions.NEI;
    }
    return null;
  };

  const initialValues = {
    [fieldname.BEGRUNNELSE]: vurdering.begrunnelse || '',
    [fieldname.NOEDVENDIG_OPPLAERING]: godkjentNoedvendighetInitialValue(),
    [fieldname.DOKUMENTER]: vurdering.tilknyttedeDokumenter || [],
  };

  const mapValuesTilAksjonspunktPayload = (values: FormState) => ({
    nødvendigOpplæring: values[fieldname.NOEDVENDIG_OPPLAERING] === 'ja',
    begrunnelse: values[fieldname.BEGRUNNELSE],
    journalpostId: vurdering.journalpostId,
    tilknyttedeDokumenter: values[fieldname.DOKUMENTER],
  });
  return (
    <DetailView title="Vurdering av nødvendighet">
      <Formik
        initialValues={initialValues}
        onSubmit={values => løsAksjonspunktNødvendighet(mapValuesTilAksjonspunktPayload(values))}
      >
        {({ handleSubmit, isSubmitting, setFieldValue, setFieldTouched }) => (
          <>
            {vurdering.perioder.map(periode => (
              <div key={periode.prettifyPeriod()}>
                <Calender onResize={undefined} onResizeCapture={undefined} /> <span>{periode.prettifyPeriod()}</span>
              </div>
            ))}
            <Box marginTop={Margin.xLarge}>
              <Field name={fieldname.DOKUMENTER}>
                {({ field, meta }) => (
                  <DokumenterIVurderingen
                    dokumenter={opplaeringDokumenter}
                    valgteDokumenter={field.value}
                    error={meta.touched && meta.error}
                    onChange={value => {
                      setFieldValue(field.name, value);
                    }}
                    onBlur={() => setFieldTouched(field.name, true)}
                  />
                )}
              </Field>
            </Box>
            <Box marginTop={Margin.xLarge}>
              <TextAreaFormik
                // eslint-disable-next-line max-len
                label={intl.formatMessage({ id: 'noedvendighet.vurdering.label' })}
                name={fieldname.BEGRUNNELSE}
                validate={[required]}
                readOnly={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <RadioGroupFormik
                legend={intl.formatMessage({ id: 'noedvendighet.noedvendigOpplaering.label' })}
                options={[
                  { value: RadioOptions.JA, label: 'Ja' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                validate={[required]}
                name={fieldname.NOEDVENDIG_OPPLAERING}
                disabled={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <Button
                size="small"
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Bekreft og fortsett
              </Button>
              {erRedigering && (
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
              )}
            </Box>
          </>
        )}
      </Formik>
    </DetailView>
  );
};

export default NoedvendighetForm;
