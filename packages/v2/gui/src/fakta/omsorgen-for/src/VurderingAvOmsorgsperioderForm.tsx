import type { k9_sak_kontrakt_omsorg_OmsorgenForDto as OmsorgenForDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { type k9_sak_typer_Periode as Periode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { FormWithButtons } from '@k9-sak-web/gui/shared/formWithButtons/FormWithButtons.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Alert, BodyShort, Box, Radio, Tag } from '@navikt/ds-react';
import { RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useState, type JSX } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { PeriodpickerList } from '../../../shared/periodPickerList/PeriodpickerList';
import Relasjon from './types/Relasjon';
import Vurderingsresultat from './types/Vurderingsresultat';
import type { VurderingSubmitValues } from './types/VurderingSubmitValues';
import getPeriodDifference from './util/getPeriodDifference';
import { prettifyPeriode } from './util/utils';
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

const finnResterendePerioder = (perioderFraForm: Periode[], periodeTilVurdering?: Periode) => {
  const formatertePerioderFraForm = perioderFraForm.map(periode => ({
    fom: periode.fom,
    tom: periode.tom,
  }));
  const resterendePerioder =
    formatertePerioderFraForm.length > 0 && periodeTilVurdering
      ? getPeriodDifference([periodeTilVurdering], formatertePerioderFraForm)
      : [];

  return resterendePerioder;
};

interface VurderingAvOmsorgsperioderFormProps {
  omsorgsperiode: OmsorgenForDto;
  onAvbryt?: () => void;
  fosterbarn: string[];
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: string[]) => Promise<void>;
  sakstype?: FagsakYtelsesType;
  readOnly: boolean;
}

interface VurderingAvOmsorgsperioderFormState {
  [FieldName.BEGRUNNELSE]: string;
  [FieldName.PERIODER]: Periode[];
  [FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE]: RadioOptions | undefined;
}

const VurderingAvOmsorgsperioderForm = ({
  omsorgsperiode,
  onAvbryt,
  fosterbarn,
  onFinished,
  sakstype,
  readOnly,
}: VurderingAvOmsorgsperioderFormProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const erOMP = sakstype === fagsakYtelsesType.OMSORGSPENGER;
  const erOLP = sakstype === fagsakYtelsesType.OPPLÆRINGSPENGER;
  const intl = useIntl();
  const formMethods = useForm({
    defaultValues: {
      [FieldName.PERIODER]: omsorgsperiode.periode ? [omsorgsperiode.periode] : [],
      [FieldName.BEGRUNNELSE]: omsorgsperiode.begrunnelse || '',
      [FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE]: undefined,
    },
  });

  const handleSubmit = async (formState: VurderingAvOmsorgsperioderFormState) => {
    const { begrunnelse, perioder, harSøkerOmsorgenForIPeriode } = formState;
    setIsSubmitting(true);
    let vurdertePerioder: VurderingSubmitValues[];
    const fosterbarnForOmsorgspenger = erOMP ? fosterbarn : undefined;
    if (harSøkerOmsorgenForIPeriode === RadioOptions.DELER) {
      vurdertePerioder = perioder.map(periode => ({
        periode,
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
    try {
      await onFinished(vurdertePerioder, fosterbarnForOmsorgspenger);
    } finally {
      setIsSubmitting(false);
    }
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
                  <div className="flex gap-2 items-center">
                    <BodyShort size="small">{omsorgsperiode.relasjon}</BodyShort>
                    <Tag size="small" variant="info">
                      Fra søknad
                    </Tag>
                  </div>
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
            submitButtonDisabled={isSubmitting}
          >
            <Box.New marginBlock="8 0">
              <RhfTextarea
                name={FieldName.BEGRUNNELSE}
                validate={[required]}
                disabled={readOnly}
                control={formMethods.control}
                label={
                  <>
                    {intl.formatMessage({ id: 'vurdering.hjemmel' })}{' '}
                    <Lovreferanse>{intl.formatMessage({ id: 'vurdering.paragraf' })}</Lovreferanse>
                    {erOMP && <p>{intl.formatMessage({ id: 'vurdering.hjemmel.hjelpetekst' })}</p>}
                  </>
                }
              />
            </Box.New>
            <Box.New marginBlock="8 0">
              <RhfRadioGroup
                control={formMethods.control}
                label={intl.formatMessage({ id: 'vurdering.harOmsorgenFor' })}
                name={FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE}
                validate={[required]}
                disabled={readOnly}
              >
                {radios.map(radio => (
                  <Radio value={radio.value} key={radio.value}>
                    {radio.label}
                  </Radio>
                ))}
              </RhfRadioGroup>
            </Box.New>
            {harSøkerOmsorgenFor === RadioOptions.DELER && (
              <Box.New marginBlock="8 0">
                <PeriodpickerList
                  name={FieldName.PERIODER}
                  legend="I hvilke perioder har søker omsorgen for barnet?"
                  readOnly={readOnly}
                  fromDate={omsorgsperiode.periode?.fom}
                  toDate={omsorgsperiode.periode?.tom}
                  // fromDatepickerProps={{
                  //   label: 'Fra',
                  //   ariaLabel: 'Fra',
                  //   limitations: {
                  //     minDate: omsorgsperiode.periode?.fom,
                  //     maxDate: omsorgsperiode.periode?.tom,
                  //   },
                  // }}
                  // toDatepickerProps={{
                  //   label: 'Til',
                  //   ariaLabel: 'Til',
                  //   limitations: {
                  //     minDate: omsorgsperiode.periode?.fom,
                  //     maxDate: omsorgsperiode.periode?.tom,
                  //   },
                  // }}
                  // defaultValues={[{ fom: omsorgsperiode.periode.fom, tom: omsorgsperiode.periode.tom }]}
                  // renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) =>
                  //   numberOfItems > 1 ? (
                  //     <DeleteButton
                  //       onClick={() => {
                  //         fieldArrayMethods.remove(index);
                  //       }}
                  //     />
                  //   ) : (
                  //     <></>
                  //   )
                  // }
                  // renderAfterFieldArray={fieldArrayMethods => (
                  //   <Box.New marginBlock="6 0">
                  //     <AddButton
                  //       label="Legg til periode"
                  //       onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                  //       id="leggTilPeriodeKnapp"
                  //     />
                  //   </Box.New>
                  // )}
                  // validators={{
                  //   overlaps: (valgtPeriode: Period) => {
                  //     const andreValgtePerioder = formMethods
                  //       .getValues()
                  //       .perioder.filter(
                  //         (periodWrapper: { period: Partial<Period> }) => periodWrapper.period !== valgtPeriode,
                  //       )
                  //       .map(({ period }: { period: Partial<Period> }) => new Period(period.fom, period.tom));
                  //     const { fom, tom } = valgtPeriode;
                  //     const valgtPeriodePeriod = new Period(fom, tom);
                  //     if (valgtPeriodePeriod.overlapsWithSomePeriodInList(andreValgtePerioder)) {
                  //       return 'Omsorgsperiodene kan ikke overlappe';
                  //     }
                  //     return null;
                  //   },
                  // }}
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
                        {prettifyPeriode(periode)}
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
