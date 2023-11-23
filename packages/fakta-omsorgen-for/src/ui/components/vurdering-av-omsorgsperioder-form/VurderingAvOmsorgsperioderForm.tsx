import React from 'react';
import { useIntl } from 'react-intl';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { getPeriodDifference, Period } from '@fpsak-frontend/utils';
import { Box, Margin, DetailView, Form, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { PeriodpickerListRHF, RadioGroupPanelRHF, TextAreaRHF } from '@fpsak-frontend/form';
import { Label } from '@navikt/ds-react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

import Omsorgsperiode from '../../../types/Omsorgsperiode';
import Relasjon from '../../../types/Relasjon';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import ContainerContext from '../../context/ContainerContext';
import { required } from '../../form/validators/index';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import styles from './vurderingAvOmsorgsperioderForm.css';
import Ytelsestype from '../../../types/Ytelsestype';

export enum FieldName {
  BEGRUNNELSE = 'begrunnelse',
  HAR_SØKER_OMSORGEN_FOR_I_PERIODE = 'harSøkerOmsorgenForIPeriode',
  PERIODER = 'perioder',
}

enum RadioOptions {
  HELE = 'hele',
  DELER = 'deler',
  NEI = 'nei',
}

interface FormPeriod {
  period: Period;
}

const finnResterendePerioder = (perioderFraForm: FormPeriod[], periodeTilVurdering: Period) => {
  const formatertePerioderFraForm = perioderFraForm.map(periode => new Period(periode.period.fom, periode.period.tom));
  const resterendePerioder =
    formatertePerioderFraForm.length > 0 && getPeriodDifference([periodeTilVurdering], formatertePerioderFraForm);

  return resterendePerioder;
};

interface VurderingAvOmsorgsperioderFormProps {
  omsorgsperiode: Omsorgsperiode;
  onAvbryt: () => void;
  fosterbarn: string[];
}

interface VurderingAvOmsorgsperioderFormState {
  [FieldName.BEGRUNNELSE]: string;
  [FieldName.PERIODER]: FormPeriod[];
  [FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE]: RadioOptions;
}

const VurderingAvOmsorgsperioderForm = ({
  omsorgsperiode,
  onAvbryt,
  fosterbarn,
}: VurderingAvOmsorgsperioderFormProps): JSX.Element => {
  const { onFinished, readOnly, sakstype } = React.useContext(ContainerContext);
  const erOMP = sakstype === Ytelsestype.OMP;
  const intl = useIntl();
  const formMethods = useForm({
    defaultValues: {
      [FieldName.PERIODER]: [{ period: omsorgsperiode.periode }],
      [FieldName.BEGRUNNELSE]: omsorgsperiode.begrunnelse || '',
      [FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE]: undefined,
    },
  });

  const handleSubmit = (formState: VurderingAvOmsorgsperioderFormState) => {
    const { begrunnelse, perioder, harSøkerOmsorgenForIPeriode } = formState;

    let vurdertePerioder;
    const fosterbarnForOmsorgspenger = erOMP ? fosterbarn : undefined;
    if (harSøkerOmsorgenForIPeriode === RadioOptions.DELER) {
      vurdertePerioder = perioder.map(({ period }) => ({
        periode: period,
        resultat: Vurderingsresultat.OPPFYLT,
        begrunnelse,
      }));

      const resterendePerioder = finnResterendePerioder(perioder, omsorgsperiode.periode);
      const perioderUtenOmsorg = resterendePerioder.map(periode => ({
        periode,
        resultat: Vurderingsresultat.IKKE_OPPFYLT,
        begrunnelse,
      }));
      vurdertePerioder = vurdertePerioder.concat(perioderUtenOmsorg);
    } else {
      vurdertePerioder = [
        {
          periode: omsorgsperiode.periode,
          resultat:
            harSøkerOmsorgenForIPeriode === RadioOptions.HELE
              ? Vurderingsresultat.OPPFYLT
              : Vurderingsresultat.IKKE_OPPFYLT,
          begrunnelse,
        },
      ];
    }
    onFinished(vurdertePerioder, fosterbarnForOmsorgspenger);
  };

  const perioder = useWatch({ control: formMethods.control, name: FieldName.PERIODER });
  const harSøkerOmsorgenFor = useWatch({
    control: formMethods.control,
    name: FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE,
  });
  const resterendePerioder = finnResterendePerioder(perioder, omsorgsperiode.periode);
  const skalViseRelasjonsbeskrivelse =
    omsorgsperiode.relasjon?.toUpperCase() === Relasjon.ANNET.toUpperCase() && omsorgsperiode.relasjonsbeskrivelse;

  return (
    <div className={styles.vurderingAvOmsorgsperioderForm}>
      <DetailView title={erOMP ? 'Vurdering' : 'Vurdering av omsorg'}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...formMethods}>
          {omsorgsperiode.relasjon && (
            <Box marginTop={Margin.xLarge}>
              <LabelledContent label="Oppgitt relasjon i søknaden" content={omsorgsperiode.relasjon} />
            </Box>
          )}
          {skalViseRelasjonsbeskrivelse && (
            <Box marginTop={Margin.xLarge}>
              <LabelledContent label="Beskrivelse fra søker" content={omsorgsperiode.relasjonsbeskrivelse} />
            </Box>
          )}
          <Form
            onSubmit={formMethods.handleSubmit(handleSubmit)}
            buttonLabel="Bekreft og fortsett"
            onAvbryt={onAvbryt}
            shouldShowSubmitButton={!readOnly}
          >
            <Box marginTop={Margin.xLarge}>
              <Label htmlFor={FieldName.BEGRUNNELSE}>{intl.formatMessage({ id: 'vurdering.hjemmel' })}</Label>
              {erOMP && <p>{intl.formatMessage({ id: 'vurdering.hjemmel.hjelpetekst' })}</p>}
              <TextAreaRHF name={FieldName.BEGRUNNELSE} validators={{ required }} disabled={readOnly} />
            </Box>
            <Box marginTop={Margin.xLarge}>
              <RadioGroupPanelRHF
                question={intl.formatMessage({ id: 'vurdering.harOmsorgenFor' })}
                radios={[
                  { value: RadioOptions.HELE, label: 'Ja' },
                  { value: RadioOptions.DELER, label: 'Ja, i deler av perioden' },
                  { value: RadioOptions.NEI, label: 'Nei' },
                ]}
                name={FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE}
                validators={{ required }}
                disabled={readOnly}
              />
            </Box>
            {harSøkerOmsorgenFor === RadioOptions.DELER && (
              <Box marginTop={Margin.xLarge}>
                <PeriodpickerListRHF
                  name={FieldName.PERIODER}
                  legend="I hvilke perioder har søker omsorgen for barnet?"
                  disabled={readOnly}
                  fromDatepickerProps={{
                    label: 'Fra',
                    ariaLabel: 'Fra',
                    limitations: {
                      minDate: omsorgsperiode.periode.fom,
                      maxDate: omsorgsperiode.periode.tom,
                    },
                  }}
                  toDatepickerProps={{
                    label: 'Til',
                    ariaLabel: 'Til',
                    limitations: {
                      minDate: omsorgsperiode.periode.fom,
                      maxDate: omsorgsperiode.periode.tom,
                    },
                  }}
                  defaultValues={[new Period(omsorgsperiode.periode.fom, omsorgsperiode.periode.tom)]}
                  renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) =>
                    numberOfItems > 1 && (
                      <DeleteButton
                        onClick={() => {
                          fieldArrayMethods.remove(index);
                        }}
                      />
                    )
                  }
                  renderAfterFieldArray={fieldArrayMethods => (
                    <Box marginTop={Margin.large}>
                      <AddButton
                        label="Legg til periode"
                        onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                        id="leggTilPeriodeKnapp"
                      />
                    </Box>
                  )}
                  validators={{
                    overlaps: (valgtPeriode: Period) => {
                      const andreValgtePerioder = formMethods
                        .getValues()
                        .perioder.filter(
                          (periodWrapper: { period: Partial<Period> }) => periodWrapper.period !== valgtPeriode,
                        )
                        .map(({ period }: { period: Partial<Period> }) => new Period(period.fom, period.tom));
                      const { fom, tom } = valgtPeriode;
                      const valgtPeriodePeriod = new Period(fom, tom);
                      if (valgtPeriodePeriod.overlapsWithSomePeriodInList(andreValgtePerioder)) {
                        return 'Omsorgsperiodene kan ikke overlappe';
                      }
                      return null;
                    },
                  }}
                />
              </Box>
            )}
            {resterendePerioder.length > 0 && (
              <Box marginTop={Margin.xLarge}>
                <AlertStripeInfo>
                  <LabelledContent
                    label="Resterende perioder har søkeren ikke omsorgen for barnet:"
                    content={resterendePerioder.map(periode => (
                      <p key={`${periode.fom}-${periode.tom}`} style={{ margin: 0 }}>
                        {periode.prettifyPeriod()}
                      </p>
                    ))}
                  />
                </AlertStripeInfo>
              </Box>
            )}
          </Form>
        </FormProvider>
      </DetailView>
    </div>
  );
};

export default VurderingAvOmsorgsperioderForm;
