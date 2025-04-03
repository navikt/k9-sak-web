import { TextAreaFormik } from '@fpsak-frontend/form';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { Calender } from '@navikt/ds-icons';
import dayjs from 'dayjs';
import { useContext, useEffect, type JSX } from 'react';
import { useIntl } from 'react-intl';
import { v4 } from 'uuid';
import * as yup from 'yup';

import RadioGroupFormik from '@fpsak-frontend/form/src/RadioGroupFormik';
import { getPeriodDifference, Period, required } from '@fpsak-frontend/utils';
import {
  FaktaOpplaeringContext,
  FaktaOpplaeringContextTypes,
} from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Alert, Box, Button, ErrorMessage, Label } from '@navikt/ds-react';
import { Field, FieldArray, Formik } from 'formik';
import AddButton from '../components/add-button/AddButton';
import DeleteButton from '../components/delete-button/DeleteButton';
import DokumenterIVurderingen from '../components/DokumenterIVurderingen';
import RangeDatepicker from '../components/rangeDatepicker/RangeDatepicker';

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
          (periode: Period, testParams) => {
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
  const { readOnly, løsAksjonspunktGjennomgåOpplæring, opplaeringDokumenter } =
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
              <Calender /> <span>{vurdering.opplæring.prettifyPeriod()}</span>
            </div>
            <Box marginBlock="8 0">
              <Field name={fieldname.DOKUMENTER}>
                {({
                  field, // { name, value, onChange, onBlur }
                  meta,
                }) => (
                  <DokumenterIVurderingen
                    dokumenter={opplaeringDokumenter}
                    valgteDokumenter={field.value}
                    error={meta.touched && meta.error}
                    onChange={async value => {
                      await setFieldValue(field.name, value);
                    }}
                    onBlur={() => setFieldTouched(field.name, true)}
                  />
                )}
              </Field>
            </Box>
            <Box marginBlock="8 0">
              <TextAreaFormik
                label={intl.formatMessage({ id: 'opplaering.vurdering.label' })}
                name={fieldname.BEGRUNNELSE}
                validate={[required]}
                readOnly={readOnly}
              />
            </Box>
            <Box marginBlock="8 0">
              <RadioGroupFormik
                legend={intl.formatMessage({ id: 'opplaering.gjennomfoertOpplaering.label' })}
                options={[
                  { value: RadioOptions.JA, label: 'Ja' },
                  { value: RadioOptions.DELVIS, label: 'Ja, i deler av perioden' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                onChange={async v => {
                  if (v === RadioOptions.JA || RadioOptions.NEI) {
                    await setFieldValue(fieldname.PERIODER, initialValues[fieldname.PERIODER]);
                  }
                  await setFieldValue(fieldname.GODKJENT_OPPLAERING, v);
                }}
                validate={[required]}
                name={fieldname.GODKJENT_OPPLAERING}
                disabled={readOnly}
              />
            </Box>
            {values[fieldname.GODKJENT_OPPLAERING] === RadioOptions.DELVIS && (
              <Box marginBlock="8 0">
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
                              mode="range"
                            />
                            {array.length > 1 && <DeleteButton onClick={() => arrayHelpers.remove(index)} />}
                          </div>
                          <div>
                            {
                              // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
                              typeof errors[fieldname.PERIODER]?.[index]?.periode === 'string' && (
                                // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
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
              <Box marginBlock="8 0">
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
            <Box marginBlock="8 0">
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
