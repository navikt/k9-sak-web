import React, { useContext } from 'react';
import { Box, Margin, DetailView, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';
import { useIntl } from 'react-intl';
import { Calender } from '@navikt/ds-icons';
import { v4 } from 'uuid';
import dayjs from 'dayjs';

import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { Vurderingsresultat } from '@k9-sak-web/types';
import { required } from '@fpsak-frontend/utils';
import { FieldArray, Formik } from 'formik';
import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { Button, Label, Alert } from '@navikt/ds-react';
import { getPeriodDifference, Period } from '@navikt/k9-period-utils';
import DeleteButton from '../components/delete-button/DeleteButton';
import { ReisetidVurdering } from './ReisetidTypes';
import AddButton from '../components/add-button/AddButton';
import RangeDatepicker from '../components/rangeDatepicker/RangeDatepicker';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  PERIODE = 'PERIODE',
}

enum RadioOptions {
  JA = 'ja',
  DELVIS = 'delvis',
  NEI = 'nei',
}

interface OwnProps {
  vurdering: ReisetidVurdering;
  avbrytRedigering: () => void;
  erRedigering: boolean;
}

interface FormState {
  [fieldname.BEGRUNNELSE]: string;
  [fieldname.PERIODE]: Period;
}

const ReisetidForm = ({ vurdering, avbrytRedigering, erRedigering }: OwnProps): JSX.Element => {
  const { readOnly, løsAksjonspunktReisetid } = useContext(FaktaOpplaeringContext);
  const intl = useIntl();

  const initialValues = {
    [fieldname.BEGRUNNELSE]: vurdering.begrunnelse || '',
    [fieldname.PERIODE]: vurdering.periode,
  };

  const mapValuesTilAksjonspunktPayload = (values: FormState) => {
    const periodeSomSkalAvslås = {
      godkjent: false,
      begrunnelse: values[fieldname.BEGRUNNELSE],
      periode: getPeriodDifference([vurdering.periode], [values[fieldname.PERIODE]]),
    };

    const periodeSomSkalGodkjennes = {
      godkjent: true,
      begrunnelse: values[fieldname.BEGRUNNELSE],
      periode: values[fieldname.PERIODE],
    };

    if (values[fieldname.PERIODE].covers(vurdering.periode)) {
      return [periodeSomSkalGodkjennes];
    }

    return [periodeSomSkalAvslås, periodeSomSkalGodkjennes];
  };

  return (
    <DetailView title="Vurdering av opplæring">
      <Formik
        initialValues={initialValues}
        onSubmit={values => løsAksjonspunktReisetid(mapValuesTilAksjonspunktPayload(values))}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          <>
            <div>
              <Label>{`${intl.formatMessage({
                id: 'reisetid.beskrivelseFraSoeker',
              })} ${vurdering.periode.prettifyPeriod()}`}</Label>
            </div>
            <Box marginTop={Margin.xLarge}>
              {vurdering.til ? (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.foersteDag' })}
                  content={vurdering.opplæringPeriode.fom}
                />
              ) : (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.sisteDag' })}
                  content={vurdering.opplæringPeriode.tom}
                />
              )}
            </Box>
            <Box marginTop={Margin.xLarge}>
              {vurdering.til ? (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.avreisedato' })}
                  content={vurdering.periode.fom}
                />
              ) : (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.hjemkomstdato' })}
                  content={vurdering.periode.tom}
                />
              )}
            </Box>
            <RangeDatepicker
              name={fieldname.PERIODE}
              placeholder="dd.mm.åååå"
              defaultSelected={{
                from: new Date(values[fieldname.PERIODE].fom),
                to: new Date(values[fieldname.PERIODE].tom),
              }}
              fromDate={new Date(vurdering.periode.fom)}
              toDate={new Date(vurdering.periode.tom)}
              onRangeChange={(dateRange: { from?: Date; to?: Date }) => {
                setFieldValue(
                  fieldname.PERIODE,
                  new Period(
                    dayjs(dateRange?.from).format('YYYY-MM-DD') || '',
                    dayjs(dateRange?.to).format('YYYY-MM-DD') || '',
                  ),
                );
              }}
            />
            <Box marginTop={Margin.xLarge}>
              <TextAreaFormik
                label={intl.formatMessage({ id: 'reisetid.begrunnelse' })}
                name={fieldname.BEGRUNNELSE}
                validate={[required]}
                readOnly={readOnly}
              />
            </Box>
            {getPeriodDifference([vurdering.periode], [values[fieldname.PERIODE]]).length > 0 && (
              <Box marginTop={Margin.xLarge}>
                <Alert variant="info">
                  <LabelledContent
                    label={intl.formatMessage({ id: 'opplaering.resterendePerioder.label' })}
                    content={getPeriodDifference([vurdering.periode], [values[fieldname.PERIODE]]).map(periode => (
                      <p key={`${periode.fom}-${periode.tom}`} style={{ margin: 0 }}>
                        {periode.prettifyPeriod()}
                      </p>
                    ))}
                  />
                </Alert>
              </Box>
            )}
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

export default ReisetidForm;
