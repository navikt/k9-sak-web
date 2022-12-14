import React, { useContext } from 'react';
import { Box, Margin, DetailView, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';
import { PeriodpickerList } from '@navikt/k9-form-utils';
import { Calender } from '@navikt/ds-icons';

import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { required } from '@fpsak-frontend/utils';
import { Formik } from 'formik';
import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { Button } from '@navikt/ds-react';
import { Period } from '@navikt/k9-period-utils';
import DeleteButton from './delete-button/DeleteButton';
import AddButton from './add-button/AddButton';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  GODKJENT_OPPLAERING = 'GODKJENT_OPPLAERING',
  PERIODER = 'PERIODER',
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
        {({ handleSubmit, isSubmitting, values }) => (
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
                  { value: RadioOptions.DELVIS, label: 'Ja, i deler av perioden' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                validate={[required]}
                name={fieldname.GODKJENT_OPPLAERING}
                disabled={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <RadioGroupFormik
                legend="I hvilken periode er det opplæring?"
                options={[
                  { value: RadioOptions.JA, label: 'Ja' },
                  { value: RadioOptions.DELVIS, label: 'Ja, i deler av perioden' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                validate={[required]}
                name={fieldname.GODKJENT_OPPLAERING}
                disabled={readOnly}
              />
            </Box>
            {values[fieldname.GODKJENT_OPPLAERING] === RadioOptions.DELVIS && <Box marginTop={Margin.xLarge} />}
            {/*             {perioderUtenBehovForNattevåk.length > 0 && (
              <Box marginTop={Margin.xLarge}>
                <AlertStripeInfo>
                  <LabelledContent
                    label="Resterende perioder har søkeren ikke behov for nattevåk:"
                    content={perioderUtenBehovForNattevåk.map(periode => (
                      <p key={`${periode.fom}-${periode.tom}`} style={{ margin: 0 }}>
                        {periode.prettifyPeriod()}
                      </p>
                    ))}
                  />
                </AlertStripeInfo>
              </Box>
            )} */}
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
