import React, { useContext, useEffect } from 'react';
import { Box, Margin, DetailView, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { TextAreaFormik } from '@fpsak-frontend/form';
import { useIntl } from 'react-intl';
import { Calender } from '@navikt/ds-icons';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import * as yup from 'yup';

import {
  FaktaOpplaeringContext,
  FaktaOpplaeringContextTypes,
} from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { required } from '@fpsak-frontend/utils';
import { Field, FieldArray, Formik } from 'formik';
import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { Button, Label, Alert, ErrorMessage } from '@navikt/ds-react';
import { getPeriodDifference, Period } from '@navikt/k9-period-utils';
import DeleteButton from '../components/delete-button/DeleteButton';
import AddButton from '../components/add-button/AddButton';
import RangeDatepicker from '../components/rangeDatepicker/RangeDatepicker';
import DokumenterIVurderingen from '../components/DokumenterIVurderingen';

enum fieldname {
  BEGRUNNELSE = 'BEGRUNNELSE',
  GODKJENT_OPPLAERING = 'GODKJENT_OPPLAERING',
  PERIODER = 'PERIODER',
  DOKUMENTER = 'DOKUMENTER',
}

enum RadioOptions {
  JA = 'ja',
  DELVIS = 'delvis',
  NEI = 'nei',
}

const schema = yup.object().shape({
  [fieldname.DOKUMENTER]: yup
    .array()
    .of(yup.string())
    .min(1, 'Du må ha brukt ett eller flere dokumenter i vurderingen')
    .required(),
  [fieldname.PERIODER]: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      periode: yup
        .object()
        .shape({
          fom: yup.string().required().label('Fra'),
          tom: yup.string().required().label('Til'),
        })
        .test(
          'overlapp',
          ({ value }: { value: Period }) => `${value.prettifyPeriod()} overlapper med en annen periode`,
          // @ts-ignore
          (periode: Period, testParams) => {
            // @ts-ignore
            const [, , values] = testParams.from;
            const andrePerioder = values.value[fieldname.PERIODER]
              .filter(v => v.periode !== periode)
              .map(v => v.periode) as Period[];
            return !periode.overlapsWithSomePeriodInList(andrePerioder);
          },
        ),
    }),
  ),
});

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
  const { readOnly, løsAksjonspunktGjennomgåOpplæring, sykdomDokumenter } =
    useContext<FaktaOpplaeringContextTypes>(FaktaOpplaeringContext);
  const intl = useIntl();

  useEffect(
    () => () => {
      avbrytRedigering();
    },
    [vurdering],
  );

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

  const finnResterendePerioder = (perioderFraForm: Period[], periodeTilVurdering: Period): Period[] => {
    const resterendePerioder =
      perioderFraForm.length > 0 && getPeriodDifference([periodeTilVurdering], perioderFraForm as Period[]);

    return resterendePerioder;
  };

  const initialValues = {
    [fieldname.BEGRUNNELSE]: vurdering.begrunnelse || '',
    [fieldname.GODKJENT_OPPLAERING]: godkjentGjennomgaaOpplaeringInitialValue(),
    [fieldname.PERIODER]: [{ id: v4(), periode: vurdering.opplæring }],
    [fieldname.DOKUMENTER]: vurdering.tilknyttedeDokumenter || [],
  };

  const mapValuesTilAksjonspunktPayload = (values: FormState) => {
    const perioderSomSkalAvslås = finnResterendePerioder(
      values[fieldname.PERIODER].map(v => v.periode),
      vurdering.opplæring,
    ).map(periode => ({
      tilknyttedeDokumenter: values[fieldname.DOKUMENTER],
      gjennomførtOpplæring: false,
      begrunnelse: values[fieldname.BEGRUNNELSE],
      periode,
    }));
    return values[fieldname.PERIODER]
      .map(obj => obj.periode)
      .map(periode => ({
        tilknyttedeDokumenter: values[fieldname.DOKUMENTER],
        gjennomførtOpplæring:
          values[fieldname.GODKJENT_OPPLAERING] === RadioOptions.JA ||
          values[fieldname.GODKJENT_OPPLAERING] === RadioOptions.DELVIS,
        begrunnelse: values[fieldname.BEGRUNNELSE],
        periode,
      }))
      .concat(perioderSomSkalAvslås);
  };
  return (
    <DetailView title="Vurdering av opplæring">
      <Formik
        initialValues={initialValues}
        onSubmit={values => løsAksjonspunktGjennomgåOpplæring(mapValuesTilAksjonspunktPayload(values))}
        validationSchema={schema}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue, setFieldTouched, errors }) => (
          <>
            <div>
              <Calender onResize={undefined} onResizeCapture={undefined} />{' '}
              <span>{vurdering.opplæring.prettifyPeriod()}</span>
            </div>
            <Box marginTop={Margin.xLarge}>
              <Field name={fieldname.DOKUMENTER}>
                {({
                  field, // { name, value, onChange, onBlur }
                  meta,
                }) => (
                  <DokumenterIVurderingen
                    dokumenter={sykdomDokumenter}
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
                label={intl.formatMessage({ id: 'opplaering.vurdering.label' })}
                name={fieldname.BEGRUNNELSE}
                validate={[required]}
                readOnly={readOnly}
              />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <RadioGroupFormik
                legend={intl.formatMessage({ id: 'opplaering.gjennomfoertOpplaering.label' })}
                options={[
                  { value: RadioOptions.JA, label: 'Ja' },
                  { value: RadioOptions.DELVIS, label: 'Ja, i deler av perioden' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                onChange={v => {
                  if (v === RadioOptions.JA || RadioOptions.NEI) {
                    setFieldValue(fieldname.PERIODER, initialValues[fieldname.PERIODER]);
                  }
                  setFieldValue(fieldname.GODKJENT_OPPLAERING, v);
                }}
                validate={[required]}
                name={fieldname.GODKJENT_OPPLAERING}
                disabled={readOnly}
              />
            </Box>
            {values[fieldname.GODKJENT_OPPLAERING] === RadioOptions.DELVIS && (
              <Box marginTop={Margin.xLarge}>
                <Label size="small">{intl.formatMessage({ id: 'opplaering.perioder.label' })}</Label>
                <FieldArray
                  name={fieldname.PERIODER}
                  render={arrayHelpers => (
                    <>
                      {values[fieldname.PERIODER].map((periode, index, array) => (
                        <>
                          <div key={periode.id} style={{ display: 'flex' }}>
                            <RangeDatepicker
                              name={`${fieldname.PERIODER}.${index}.periode`}
                              defaultSelected={{
                                from: values[`${fieldname.PERIODER}`][index]?.periode?.fom
                                  ? new Date(values[`${fieldname.PERIODER}`][index]?.periode?.fom)
                                  : undefined,
                                to: values[`${fieldname.PERIODER}`][index]?.periode?.tom
                                  ? new Date(values[`${fieldname.PERIODER}`][index]?.periode?.tom)
                                  : undefined,
                              }}
                              placeholder="dd.mm.åååå"
                              fromDate={new Date(vurdering.opplæring.fom)}
                              toDate={new Date(vurdering.opplæring.tom)}
                              onRangeChange={(dateRange: { from?: Date; to?: Date }) => {
                                arrayHelpers.replace(index, {
                                  id: periode.id,
                                  periode: new Period(
                                    dateRange?.from ? dayjs(dateRange?.from).format('YYYY-MM-DD') : '',
                                    dateRange?.to ? dayjs(dateRange?.to).format('YYYY-MM-DD') : '',
                                  ),
                                });
                              }}
                            />
                            {array.length > 1 && <DeleteButton onClick={() => arrayHelpers.remove(index)} />}
                          </div>
                          <div>
                            {
                              // @ts-ignore
                              typeof errors[fieldname.PERIODER]?.[index]?.periode === 'string' && (
                                // @ts-ignore
                                <ErrorMessage size="small">{errors[fieldname.PERIODER]?.[index]?.periode}</ErrorMessage>
                              )
                            }
                          </div>
                        </>
                      ))}
                      <AddButton
                        onClick={() => {
                          arrayHelpers.push({
                            id: v4(),
                            periode: new Period('', ''),
                          });
                        }}
                        label="Legg til ny periode"
                      />
                    </>
                  )}
                />
              </Box>
            )}
            {finnResterendePerioder(
              values[fieldname.PERIODER].map(v => v.periode),
              vurdering.opplæring,
            ).length > 0 && (
              <Box marginTop={Margin.xLarge}>
                <Alert variant="info">
                  <LabelledContent
                    label={intl.formatMessage({ id: 'opplaering.resterendePerioder.label' })}
                    content={finnResterendePerioder(
                      values[fieldname.PERIODER].map(v => v.periode),
                      vurdering.opplæring,
                    ).map(periode => (
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

export default GjennomgaaOpplaeringForm;
