import React, { useContext } from 'react';
import { Period } from '@navikt/k9-period-utils';
import { Box, Margin, DetailView, LabelledContent, Form } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';
import { Calender } from '@navikt/ds-icons';

import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { required } from '@fpsak-frontend/utils';
import { Formik } from 'formik';
import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { Button } from '@navikt/ds-react';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  GODKJENT_OPPLAERING = 'GODKJENT_OPPLAERING',
}

enum RadioOptions {
  JA = 'ja',
  DELVIS = 'delvis',
  NEI = 'nei',
}

interface OwnProps {
  vurdering: GjennomgaaOpplaeringVurdering;
  avbrytRedigering: () => void;
  erRedigering: boolean;
}

interface FormState {
  [fieldname.BEGRUNNELSE]: string;
  [fieldname.GODKJENT_OPPLAERING]: string;
}

const GjennomgaaOpplaeringForm = ({ vurdering, avbrytRedigering, erRedigering }: OwnProps): JSX.Element => {
  const { readOnly, løsAksjonspunktGjennomgåOpplæring } = useContext(FaktaOpplaeringContext);
  const godkjentGjennomgaaOpplaeringInitialValue = () => {
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
    [fieldname.GODKJENT_OPPLAERING]: godkjentGjennomgaaOpplaeringInitialValue(),
  };

  const mapValuesTilAksjonspunktPayload = (values: FormState) => ({
    godkjent: values[fieldname.GODKJENT_OPPLAERING] === 'ja',
    begrunnelse: values[fieldname.BEGRUNNELSE],
  });
  return (
    <DetailView title="Vurdering av opplæring">
      <Formik
        initialValues={initialValues}
        onSubmit={values => løsAksjonspunktGjennomgåOpplæring(mapValuesTilAksjonspunktPayload(values))}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
            <div>
              <Calender /> <span>{vurdering.opplæring.prettifyPeriod()}</span>
            </div>
            <Box marginTop={Margin.xLarge}>
              <TextAreaFormik
                // eslint-disable-next-line max-len
                label="Gjør en vurdering av om det er opplæring i perioden som følge av § 9-14."
                name={fieldname.BEGRUNNELSE}
                validate={[required]}
                readOnly={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <RadioGroupFormik
                legend="Er det opplæring i perioden?"
                options={[
                  { value: RadioOptions.JA, label: 'Ja' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                validate={[required]}
                name={fieldname.GODKJENT_OPPLAERING}
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

export default GjennomgaaOpplaeringForm;
