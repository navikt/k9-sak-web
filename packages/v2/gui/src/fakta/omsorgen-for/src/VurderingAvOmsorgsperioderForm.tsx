import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Resultat } from '@k9-sak-web/backend/k9sak/kodeverk/sykdom/Resultat.js';
import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { FormWithButtons } from '@k9-sak-web/gui/shared/formWithButtons/FormWithButtons.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Period } from '@k9-sak-web/gui/utils/Period.js';
import { Alert, BodyShort, Box, Radio, Tag } from '@navikt/ds-react';
import { RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useState, type JSX } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { PeriodpickerList } from '../../../shared/periodPickerList/PeriodpickerList';
import Relasjon from './types/Relasjon';
import type { VurderingSubmitValues } from './types/VurderingSubmitValues';
import getPeriodDifference from './util/getPeriodDifference.js';
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
  const resterendePerioder = periodeTilVurdering
    ? getPeriodDifference([periodeTilVurdering], formatertePerioderFraForm)
    : [];

  return resterendePerioder;
};

interface VurderingAvOmsorgsperioderFormProps {
  omsorgsperiode: OmsorgenForDto;
  onAvbryt?: () => void;
  onFinished: (vurdering: VurderingSubmitValues[]) => Promise<void>;
  sakstype?: FagsakYtelsesType;
  readOnly: boolean;
}

interface VurderingAvOmsorgsperioderFormState {
  [FieldName.BEGRUNNELSE]: string;
  [FieldName.PERIODER]: Periode[];
  [FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE]: RadioOptions | undefined;
}

const lagVurdertePerioder = (
  { begrunnelse, perioder, harSøkerOmsorgenForIPeriode }: VurderingAvOmsorgsperioderFormState,
  omsorgsperiode: OmsorgenForDto,
): VurderingSubmitValues[] => {
  if (harSøkerOmsorgenForIPeriode === RadioOptions.DELER) {
    const perioderMedOmsorg = perioder.map(periode => ({
      periode,
      resultat: Resultat.OPPFYLT,
      begrunnelse,
    }));
    const perioderUtenOmsorg = finnResterendePerioder(perioder, omsorgsperiode.periode).map(periode => ({
      periode,
      resultat: Resultat.IKKE_OPPFYLT,
      begrunnelse,
    }));

    return [...perioderMedOmsorg, ...perioderUtenOmsorg];
  }

  return [
    {
      periode: omsorgsperiode.periode,
      resultat: harSøkerOmsorgenForIPeriode === RadioOptions.HELE ? Resultat.OPPFYLT : Resultat.IKKE_OPPFYLT,
      begrunnelse,
    },
  ];
};

const VurderingAvOmsorgsperioderForm = ({
  omsorgsperiode,
  onAvbryt,
  onFinished,
  sakstype,
  readOnly,
}: VurderingAvOmsorgsperioderFormProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const erOMP = sakstype === fagsakYtelsesType.OMSORGSPENGER;
  const erOLP = sakstype === fagsakYtelsesType.OPPLÆRINGSPENGER;
  const hjemmel = erOMP ? 'Vurder om søker har omsorg for barn etter' : 'Vurder om søker har omsorgen for barnet etter';
  const paragraf = erOMP ? '§ 9-5' : erOLP ? '§ 9-14' : '§ 9-10, første ledd';
  const spørsmål = erOMP
    ? 'Er vilkåret oppfylt for denne perioden?'
    : 'Har søker omsorgen for barnet i denne perioden?';
  const formMethods = useForm({
    defaultValues: {
      [FieldName.PERIODER]: omsorgsperiode.periode ? [omsorgsperiode.periode] : [],
      [FieldName.BEGRUNNELSE]: omsorgsperiode.begrunnelse || '',
      [FieldName.HAR_SØKER_OMSORGEN_FOR_I_PERIODE]: undefined,
    },
  });

  const handleSubmit = async (formState: VurderingAvOmsorgsperioderFormState) => {
    setIsSubmitting(true);
    try {
      await onFinished(lagVurdertePerioder(formState, omsorgsperiode));
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
            <Box marginBlock="space-8 space-0">
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
            </Box>
          )}
          {skalViseRelasjonsbeskrivelse && (
            <Box marginBlock="space-8 space-0">
              <LabelledContent
                label="Beskrivelse fra søker"
                content={<BodyShort size="small">{omsorgsperiode.relasjonsbeskrivelse}</BodyShort>}
              />
            </Box>
          )}
          <FormWithButtons
            onSubmit={formMethods.handleSubmit(handleSubmit)}
            buttonLabel="Bekreft og fortsett"
            onAvbryt={onAvbryt}
            shouldShowSubmitButton={!readOnly}
            smallButtons
            submitButtonDisabled={isSubmitting}
          >
            <Box marginBlock="space-8 space-0">
              <RhfTextarea
                name={FieldName.BEGRUNNELSE}
                validate={[required]}
                disabled={readOnly}
                control={formMethods.control}
                label={
                  <>
                    {hjemmel} <Lovreferanse>{paragraf}</Lovreferanse>
                    {erOMP && (
                      <p>
                        Hvis søker ikke oppfyller vilkåret etter § 9-5, så skal vilkåret likevel settes oppfylt dersom
                        søker kan ha fått fordelt eller overført dager etter § 9-6, femte og sjette ledd
                      </p>
                    )}
                  </>
                }
              />
            </Box>
            <Box marginBlock="space-8 space-0">
              <RhfRadioGroup
                control={formMethods.control}
                legend={spørsmål}
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
            </Box>
            {harSøkerOmsorgenFor === RadioOptions.DELER && (
              <Box marginBlock="space-8 space-0">
                <PeriodpickerList
                  name={FieldName.PERIODER}
                  legend="I hvilke perioder har søker omsorgen for barnet?"
                  readOnly={readOnly}
                  fromDate={omsorgsperiode.periode?.fom}
                  toDate={omsorgsperiode.periode?.tom}
                />
              </Box>
            )}
            {resterendePerioder.length > 0 && (
              <Box marginBlock="space-8 space-0">
                <Alert size="small" variant="info">
                  <LabelledContent
                    label="Resterende perioder har søkeren ikke omsorgen for barnet:"
                    content={resterendePerioder.map(periode => (
                      <p key={`${periode.fom}-${periode.tom}`} className={styles.resterendePeriode}>
                        {new Period(periode.fom, periode.tom).prettifyPeriod()}
                      </p>
                    ))}
                  />
                </Alert>
              </Box>
            )}
          </FormWithButtons>
        </FormProvider>
      </DetailView>
    </div>
  );
};

export default VurderingAvOmsorgsperioderForm;
