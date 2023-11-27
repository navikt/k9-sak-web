import { Alert, Link } from '@navikt/ds-react';
import { Box, ContentWithTooltip, Form, Margin, OnePersonOutlineGray } from '@navikt/ft-plattform-komponenter';
import { CheckboxGroupRHF, PeriodpickerListRHF, TextAreaRHF, YesOrNoQuestionRHF } from '@fpsak-frontend/form';
import { Period } from '@fpsak-frontend/utils';
import React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import {
  finnHullIPerioder,
  finnMaksavgrensningerForPerioder,
  slåSammenSammenhengendePerioder,
} from '../../../util/periodUtils';
import ContainerContext from '../../context/ContainerContext';
import { fomDatoErFørTomDato, harBruktDokumentasjon, required } from '../../form/validators';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import styles from '../vurdering-av-form/vurderingForm.css';
import { finnBenyttedeDokumenter } from '../../../util/dokumentUtils';
import Vurderingsresultat from '../../../types/Vurderingsresultat';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export enum FieldName {
  VURDERING_AV_TO_OMSORGSPERSONER = 'vurderingAvToOmsorgspersoner',
  HAR_BEHOV_FOR_TO_OMSORGSPERSONER = 'harBehovForToOmsorgspersoner',
  PERIODER = 'perioder',
  DOKUMENTER = 'dokumenter',
}

const lagToOmsorgspersonerVurdering = (
  formState: VurderingAvToOmsorgspersonerFormState,
  alleDokumenter: Dokument[],
): Partial<Vurderingsversjon> => {
  const resultat = formState[FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]
    ? Vurderingsresultat.OPPFYLT
    : Vurderingsresultat.IKKE_OPPFYLT;
  const perioder = formState[FieldName.PERIODER].map(
    periodeWrapper => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom),
  );
  const begrunnelse = formState[FieldName.VURDERING_AV_TO_OMSORGSPERSONER];

  return {
    resultat,
    perioder,
    tekst: begrunnelse,
    dokumenter: finnBenyttedeDokumenter(formState[FieldName.DOKUMENTER], alleDokumenter),
  };
};

export interface VurderingAvToOmsorgspersonerFormState {
  [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]?: string;
  [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]?: boolean;
  [FieldName.PERIODER]?: Period[];
  [FieldName.DOKUMENTER]: string[];
}

interface VurderingAvToOmsorgspersonerFormProps {
  defaultValues: VurderingAvToOmsorgspersonerFormState;
  onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
  resterendeVurderingsperioder?: Period[];
  perioderSomKanVurderes?: Period[];
  dokumenter: Dokument[];
  onAvbryt: () => void;
  isSubmitting: boolean;
}

const VurderingAvToOmsorgspersonerForm = ({
  defaultValues,
  onSubmit,
  resterendeVurderingsperioder,
  perioderSomKanVurderes,
  dokumenter,
  onAvbryt,
  isSubmitting,
}: VurderingAvToOmsorgspersonerFormProps): JSX.Element => {
  const { readOnly } = React.useContext(ContainerContext);

  const formMethods = useForm({
    defaultValues,
  });

  const perioderSomBlirVurdert: Period[] = useWatch({ control: formMethods.control, name: FieldName.PERIODER });

  const harVurdertAlleDagerSomSkalVurderes = React.useMemo(() => {
    const dagerSomSkalVurderes = (resterendeVurderingsperioder || []).flatMap(period => period.asListOfDays());
    const dagerSomBlirVurdert = (perioderSomBlirVurdert || [])
      .map(period => {
        if ((period as AnyType).period) {
          return (period as AnyType).period;
        }
        return period;
      })
      .flatMap(p => new Period(p.fom, p.tom).asListOfDays());
    return dagerSomSkalVurderes.every(dagSomSkalVurderes => dagerSomBlirVurdert.indexOf(dagSomSkalVurderes) > -1);
  }, [resterendeVurderingsperioder, perioderSomBlirVurdert]);

  const hullISøknadsperiodene = React.useMemo(
    () => finnHullIPerioder(perioderSomKanVurderes).map(period => period.asInternationalPeriod()),
    [perioderSomKanVurderes],
  );

  const avgrensningerForSøknadsperiode = React.useMemo(
    () => finnMaksavgrensningerForPerioder(perioderSomKanVurderes),
    [perioderSomKanVurderes],
  );

  const lagNyVurdering = (formState: VurderingAvToOmsorgspersonerFormState) => {
    onSubmit(lagToOmsorgspersonerVurdering(formState, dokumenter));
  };

  const sammenhengendePerioderMedTilsynsbehov = React.useMemo(
    () => slåSammenSammenhengendePerioder(perioderSomKanVurderes),
    [perioderSomKanVurderes],
  );

  return (
    <DetailViewVurdering title="Vurdering av to omsorgspersoner" perioder={defaultValues[FieldName.PERIODER]}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...formMethods}>
        <Form
          buttonLabel="Bekreft"
          onSubmit={formMethods.handleSubmit(lagNyVurdering)}
          onAvbryt={onAvbryt}
          submitButtonDisabled={isSubmitting}
          cancelButtonDisabled={isSubmitting}
          shouldShowSubmitButton={!readOnly}
        >
          {dokumenter?.length > 0 && (
            <Box marginTop={Margin.large}>
              <CheckboxGroupRHF
                question="Hvilke dokumenter er brukt i vurderingen av to omsorgspersoner?"
                name={FieldName.DOKUMENTER}
                checkboxes={dokumenter.map(dokument => ({
                  value: dokument.id,
                  label: (
                    <DokumentLink
                      dokument={dokument}
                      etikett={
                        dokument.annenPartErKilde && (
                          <ContentWithTooltip tooltipText="Dokument fra annen part" tooltipDirectionRight>
                            <OnePersonOutlineGray />
                          </ContentWithTooltip>
                        )
                      }
                    />
                  ),
                }))}
                validators={{
                  harBruktDokumentasjon,
                }}
                disabled={readOnly}
              />
            </Box>
          )}
          <Box marginTop={Margin.xLarge}>
            <TextAreaRHF
              textareaClass={styles.begrunnelsesfelt}
              name={FieldName.VURDERING_AV_TO_OMSORGSPERSONER}
              label={
                <>
                  <b>Gjør en vurdering av om det er behov for to omsorgspersoner samtidig etter § 9-10, andre ledd.</b>
                  <p className={styles.begrunnelsesfelt__labeltekst}>
                    Du skal ta utgangspunkt i{' '}
                    <Link href="https://lovdata.no/nav/folketrygdloven/kap9" target="_blank">
                      lovteksten
                    </Link>{' '}
                    og{' '}
                    <Link
                      href="https://lovdata.no/nav/rundskriv/r09-00#ref/lov/1997-02-28-19/%C2%A79-10"
                      target="_blank"
                    >
                      rundskrivet
                    </Link>{' '}
                    når du skriver vurderingen.
                  </p>
                  <p className={styles.begrunnelsesfelt__labeltekst}>Vurderingen skal beskrive:</p>
                  <ul className={styles.begrunnelsesfelt__liste}>
                    <li>Om tilsyn og pleie kan ivaretas av én person alene i hele eller deler av perioden.</li>
                  </ul>
                </>
              }
              validators={{ required }}
              disabled={readOnly}
              id="begrunnelsesfelt"
            />
          </Box>
          <Box marginTop={Margin.xLarge}>
            <YesOrNoQuestionRHF
              question="Er det behov for to omsorgspersoner samtidig?"
              name={FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER}
              validators={{ required }}
              disabled={readOnly}
            />
          </Box>
          <Box marginTop={Margin.xLarge}>
            <PeriodpickerListRHF
              legend="Oppgi perioder"
              name={FieldName.PERIODER}
              disabled={readOnly}
              defaultValues={defaultValues[FieldName.PERIODER] || []}
              validators={{
                required,
                inngårISammenhengendePeriodeMedTilsynsbehov: (value: Period) => {
                  const isOk = sammenhengendePerioderMedTilsynsbehov.some(sammenhengendeSøknadsperiode =>
                    sammenhengendeSøknadsperiode.covers(value),
                  );

                  if (!isOk) {
                    return 'Perioden som vurderes må være innenfor en eller flere sammenhengede perioder med behov for kontinuerlig tilsyn og pleie';
                  }

                  return true;
                },
                fomDatoErFørTomDato,
              }}
              fromDatepickerProps={{
                label: 'Fra',
                ariaLabel: 'fra',
                limitations: {
                  minDate: avgrensningerForSøknadsperiode?.fom || '',
                  maxDate: avgrensningerForSøknadsperiode?.tom || '',
                  invalidDateRanges: hullISøknadsperiodene,
                },
              }}
              toDatepickerProps={{
                label: 'Til',
                ariaLabel: 'til',
                limitations: {
                  minDate: avgrensningerForSøknadsperiode?.fom || '',
                  maxDate: avgrensningerForSøknadsperiode?.tom || '',
                  invalidDateRanges: hullISøknadsperiodene,
                },
              }}
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
            />
          </Box>
          {!harVurdertAlleDagerSomSkalVurderes && (
            <Box marginTop={Margin.xLarge}>
              <Alert size="small" variant="info">
                Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har
                lagret denne.
              </Alert>
            </Box>
          )}
        </Form>
      </FormProvider>
    </DetailViewVurdering>
  );
};

export default VurderingAvToOmsorgspersonerForm;
