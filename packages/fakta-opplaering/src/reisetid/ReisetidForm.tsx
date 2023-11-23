import React, { useContext, useEffect } from 'react';
import { Box, Margin, DetailView, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import dayjs from 'dayjs';

import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';

import { getPeriodDifference, Period, DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { Formik } from 'formik';
import { Button, Alert } from '@navikt/ds-react';
import { ReisetidVurdering } from './ReisetidTypes';
import RangeDatepicker from '../components/rangeDatepicker/RangeDatepicker';
import FraSoeknad from './FraSoeknad';
import BeskrivelseFraSoeker from './BeskrivelseFraSoeker';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  PERIODE = 'PERIODE',
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

const reisetidSchema = yup.object().shape({
  [fieldname.PERIODE]: yup.object().shape({
    fom: yup.string().required().label('Fra'),
    tom: yup.string().required().label('Til'),
  }),
});

const ReisetidForm = ({ vurdering, avbrytRedigering, erRedigering }: OwnProps): JSX.Element => {
  const { readOnly, løsAksjonspunktReisetid } = useContext(FaktaOpplaeringContext);
  const intl = useIntl();

  useEffect(
    () => () => {
      avbrytRedigering();
    },
    [vurdering],
  );

  const initialValues = {
    [fieldname.BEGRUNNELSE]: vurdering.begrunnelse || '',
    [fieldname.PERIODE]: vurdering.periode,
  };

  const mapValuesTilAksjonspunktPayload = (values: FormState) => {
    const periodeSomSkalAvslås = {
      godkjent: false,
      begrunnelse: values[fieldname.BEGRUNNELSE],
      periode: getPeriodDifference([vurdering.periode], [values[fieldname.PERIODE]])[0],
    };

    const periodeSomSkalGodkjennes = {
      godkjent: true,
      begrunnelse: values[fieldname.BEGRUNNELSE],
      periode: values[fieldname.PERIODE],
    };

    if (values[fieldname.PERIODE].covers(vurdering.periode)) {
      return { reisetid: [periodeSomSkalGodkjennes] };
    }

    return { reisetid: [periodeSomSkalAvslås, periodeSomSkalGodkjennes] };
  };

  return (
    <DetailView title="Vurdering av reisetid">
      <Formik
        initialValues={initialValues}
        onSubmit={values => løsAksjonspunktReisetid(mapValuesTilAksjonspunktPayload(values))}
        validationSchema={reisetidSchema}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          <>
            <BeskrivelseFraSoeker vurdering={vurdering} />
            <Box marginTop={Margin.xLarge}>
              {vurdering.til ? (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.foersteDag' })}
                  content={
                    <FraSoeknad>
                      {dayjs(vurdering.perioderFraSoeknad.opplæringPeriode.fom).format(DDMMYYYY_DATE_FORMAT)}
                    </FraSoeknad>
                  }
                />
              ) : (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.sisteDag' })}
                  content={
                    <FraSoeknad>
                      {dayjs(vurdering.perioderFraSoeknad.opplæringPeriode.tom).format(DDMMYYYY_DATE_FORMAT)}
                    </FraSoeknad>
                  }
                />
              )}
            </Box>
            <Box marginTop={Margin.xLarge}>
              {vurdering.til ? (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.avreisedato' })}
                  content={
                    <FraSoeknad>
                      {dayjs(vurdering.perioderFraSoeknad.reisetidTil.fom).format(DDMMYYYY_DATE_FORMAT)}
                    </FraSoeknad>
                  }
                />
              ) : (
                <LabelledContent
                  label={intl.formatMessage({ id: 'reisetid.hjemkomstdato' })}
                  content={
                    <FraSoeknad>
                      {dayjs(vurdering.perioderFraSoeknad.reisetidHjem.tom).format(DDMMYYYY_DATE_FORMAT)}
                    </FraSoeknad>
                  }
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
                    dateRange?.from ? dayjs(dateRange?.from).format('YYYY-MM-DD') : '',
                    dateRange?.to ? dayjs(dateRange?.to).format('YYYY-MM-DD') : '',
                  ),
                  false,
                );
              }}
              mode="range"
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
