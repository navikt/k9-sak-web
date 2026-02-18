import { type JSX } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { PeriodpickerListRHF, RadioGroupPanelRHF, TextAreaRHF } from '@fpsak-frontend/form';
import { Period, getPeriodDifference } from '@fpsak-frontend/utils';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Alert, BodyShort, Box, HStack, Label, Tag } from '@navikt/ds-react';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FormWithButtons } from '@k9-sak-web/gui/shared/formWithButtons/FormWithButtons.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import Omsorgsperiode from '../../../types/Omsorgsperiode';
import Relasjon from '../../../types/Relasjon';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import { useOmsorgenForContext } from '../../context/ContainerContext';
import { required } from '../../form/validators/index';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import styles from './vurderingAvOmsorgsperioderForm.module.css';

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
  onAvbryt?: () => void;
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
  const { onFinished, readOnly, sakstype } = useOmsorgenForContext();
  const erOMP = sakstype === fagsakYtelsesType.OMSORGSPENGER;
  const erOLP = sakstype === fagsakYtelsesType.OPPLÆRINGSPENGER;
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

  const radios = [
    { value: RadioOptions.HELE, label: 'Ja' },
    { value: RadioOptions.DELER, label: 'Ja, i deler av perioden' },
    { value: RadioOptions.NEI, label: 'Nei' },
  ].filter(radio => (erOLP && radio.value === RadioOptions.DELER ? false : true));

  return (
    <div className={styles.vurderingAvOmsorgsperioderForm}>
      <DetailView title={erOMP ? 'Vurdering' : 'Vurdering av omsorg'} border>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...formMethods}>
          {omsorgsperiode.relasjon && (
            <Box.New marginBlock="8 0">
              <LabelledContent
                label="Hvilken relasjon har søker til barnet?"
                content={
                  <HStack align="center" gap="space-8">
                    <BodyShort size="small">{omsorgsperiode.relasjon}</BodyShort>
                    <Tag size="small" variant="info">
                      Fra søknad
                    </Tag>
                  </HStack>
                }
              />
            </Box.New>
          )}
          {skalViseRelasjonsbeskrivelse && (
            <Box.New marginBlock="8 0">
              <LabelledContent
                label="Beskrivelse fra søker"
                content={<BodyShort size="small">{omsorgsperiode.relasjonsbeskrivelse}</BodyShort>}
              />
            </Box.New>
          )}
          <FormWithButtons
            onSubmit={formMethods.handleSubmit(handleSubmit)}
            buttonLabel="Bekreft og fortsett"
            onAvbryt={onAvbryt}
            shouldShowSubmitButton={!readOnly}
            smallButtons
          >
            <Box.New marginBlock="8 0">
              <Label size="small" htmlFor={FieldName.BEGRUNNELSE}>
                {intl.formatMessage({ id: 'vurdering.hjemmel' })}{' '}
                <Lovreferanse>{intl.formatMessage({ id: 'vurdering.paragraf' })}</Lovreferanse>
              </Label>
              {erOMP && <p>{intl.formatMessage({ id: 'vurdering.hjemmel.hjelpetekst' })}</p>}
              <TextAreaRHF name={FieldName.BEGRUNNELSE} validators={{ required }} disabled={readOnly} />
            </Box.New>
            <Box.New marginBlock="8 0">
              <RadioGroupPanelRHF
                question={intl.formatMessage({ id: 'vurdering.harOmsorgenFor' })}
                radios={radios}
                name={FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE}
                validators={{ required }}
                disabled={readOnly}
              />
            </Box.New>
            {harSøkerOmsorgenFor === RadioOptions.DELER && (
              <Box.New marginBlock="8 0">
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
                    <Box.New marginBlock="6 0">
                      <AddButton
                        label="Legg til periode"
                        onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                        id="leggTilPeriodeKnapp"
                      />
                    </Box.New>
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
              </Box.New>
            )}
            {resterendePerioder.length > 0 && (
              <Box.New marginBlock="8 0">
                <Alert size="small" variant="info">
                  <LabelledContent
                    label="Resterende perioder har søkeren ikke omsorgen for barnet:"
                    content={resterendePerioder.map(periode => (
                      <p key={`${periode.fom}-${periode.tom}`} style={{ margin: 0 }}>
                        {periode.prettifyPeriod()}
                      </p>
                    ))}
                  />
                </Alert>
              </Box.New>
            )}
          </FormWithButtons>
        </FormProvider>
      </DetailView>
    </div>
  );
};

export default VurderingAvOmsorgsperioderForm;
