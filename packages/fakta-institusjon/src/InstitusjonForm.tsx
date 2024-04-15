import { TextAreaFormik } from '@fpsak-frontend/form';
import { Calender } from '@navikt/ds-icons';
import { Box, DetailView, LabelledContent, Margin } from '@navikt/ft-plattform-komponenter';

import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { required } from '@fpsak-frontend/utils';
import { InstitusjonVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import { Button } from '@navikt/ds-react';
import { Formik } from 'formik';
import React from 'react';

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
  erRedigering: boolean;
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
  erRedigering,
}: VurderingAvBeredskapsperioderFormProps): JSX.Element => {
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
        {({ handleSubmit, isSubmitting }) => (
          <>
            {vurdering.perioder.map(periode => (
              <div key={periode.prettifyPeriod()}>
                <Calender /> <span>{periode.prettifyPeriod()}</span>
              </div>
            ))}
            <Box marginTop={Margin.xLarge}>
              <LabelledContent
                label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
                content={vurdering.institusjon}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <TextAreaFormik
                // eslint-disable-next-line max-len
                label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
                name={fieldname.BEGRUNNELSE}
                validate={[required]}
                readOnly={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <RadioGroupFormik
                legend="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?"
                options={[
                  { value: RadioOptions.JA, label: 'Ja' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                validate={[required]}
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

export default InstitusjonForm;
