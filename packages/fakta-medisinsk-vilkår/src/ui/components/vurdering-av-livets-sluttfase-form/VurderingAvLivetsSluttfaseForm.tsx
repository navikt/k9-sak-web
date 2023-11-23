import { Close } from '@navikt/ds-icons';
import { Alert, Label, Link } from '@navikt/ds-react';
import { Box, ContentWithTooltip, Form, Margin, OnePersonOutlineGray } from '@navikt/ft-plattform-komponenter';
import { CheckboxGroupRHF, PeriodpickerListRHF, RadioGroupPanelRHF, TextAreaRHF } from '@fpsak-frontend/form';
import { Period } from '@fpsak-frontend/utils';
import React, { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import {
  finnHullIPerioder,
  finnMaksavgrensningerForPerioder,
  slåSammenSammenhengendePerioder,
} from '../../../util/periodUtils';
import { lagSluttfaseVurdering } from '../../../util/vurderingUtils';
import ContainerContext from '../../context/ContainerContext';
import { fomDatoErFørTomDato, harBruktDokumentasjon, required } from '../../form/validators';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import StjerneIkon from '../vurdering-av-form/StjerneIkon';
import styles from '../vurdering-av-form/vurderingForm.css';
import VurderingDokumentfilter from '../vurdering-dokumentfilter/VurderingDokumentfilter';
import vurderingDokumentfilterOptions from '../vurdering-dokumentfilter/vurderingDokumentfilterOptions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export enum FieldName {
  VURDERING_AV_LIVETS_SLUTTFASE = 'vurderingAvLivetsSluttfase',
  ER_I_LIVETS_SLUTTFASE = 'erILivetsSluttfase',
  SPLITT_PERIODE_DATO = 'splittPeriodeDato',
  DOKUMENTER = 'dokumenter',
  PERIODER = 'perioder',
}

export interface VurderingAvLivetsSluttfaseFormState {
  [FieldName.VURDERING_AV_LIVETS_SLUTTFASE]?: string;
  [FieldName.ER_I_LIVETS_SLUTTFASE]?: Vurderingsresultat;
  [FieldName.SPLITT_PERIODE_DATO]?: string;
  [FieldName.DOKUMENTER]: string[];
  [FieldName.PERIODER]?: Period[];
}

interface VurderingAvLivetsSluttfaseFormProps {
  defaultValues: VurderingAvLivetsSluttfaseFormState;
  resterendeVurderingsperioder?: Period[];
  perioderSomKanVurderes?: Period[];
  onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
  dokumenter: Dokument[];
  onAvbryt: () => void;
  isSubmitting: boolean;
}

const VurderingAvLivetsSluttfaseForm = ({
  defaultValues,
  resterendeVurderingsperioder,
  perioderSomKanVurderes,
  onSubmit,
  dokumenter,
  onAvbryt,
  isSubmitting,
}: VurderingAvLivetsSluttfaseFormProps): JSX.Element => {
  const { readOnly } = React.useContext(ContainerContext);
  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
  });
  const [visAlleDokumenter, setVisAlleDokumenter] = useState(false);
  const [dokumentFilter, setDokumentFilter] = useState([]);

  const sammenhengendeSøknadsperioder = slåSammenSammenhengendePerioder(perioderSomKanVurderes);

  const avgrensningerForSøknadsperiode = React.useMemo(
    () => finnMaksavgrensningerForPerioder(perioderSomKanVurderes),
    [perioderSomKanVurderes],
  );

  const hullISøknadsperiodene = React.useMemo(
    () => finnHullIPerioder(perioderSomKanVurderes).map(period => period.asInternationalPeriod()),
    [perioderSomKanVurderes],
  );

  const updateDokumentFilter = valgtFilter => {
    if (dokumentFilter.includes(valgtFilter)) {
      if (dokumentFilter.length === 1) {
        setVisAlleDokumenter(false);
      }
      setDokumentFilter(dokumentFilter.filter(v => v !== valgtFilter));
    } else {
      setDokumentFilter(dokumentFilter.concat([valgtFilter]));
      setVisAlleDokumenter(true);
    }
  };

  const perioderSomBlirVurdert: any[] = useWatch({ control: formMethods.control, name: FieldName.PERIODER });

  const harVurdertAlleDagerSomSkalVurderes = React.useMemo(() => {
    const dagerSomSkalVurderes = (resterendeVurderingsperioder || []).flatMap(p => p.asListOfDays());
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

  const getDokumenterSomSkalVises = () => {
    const filtrerteDokumenter = dokumenter.filter(dokument => {
      if (!dokumentFilter.length) {
        return true;
      }
      return dokumentFilter.some(filter => dokument[filter] === true);
    });

    return filtrerteDokumenter.filter((dokument, index) => {
      if (dokumentFilter.length === 0) {
        if (dokumenter.length < 6) {
          return true;
        }
        if (!visAlleDokumenter && index > 4) {
          return false;
        }
      }
      return true;
    });
  };

  const visFlereDokumenterKnapp = () => {
    if (dokumentFilter.length > 0) {
      return false;
    }
    if (dokumenter.length < 6) {
      return false;
    }
    return true;
  };

  const lagNySluttfaseVurdering = (formState: VurderingAvLivetsSluttfaseFormState) => {
    onSubmit(lagSluttfaseVurdering(formState, dokumenter));
  };

  return (
    <DetailViewVurdering title="Vurdering av livets sluttfase" perioder={defaultValues.perioder}>
      <div id="modal" />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...formMethods}>
        <Form
          buttonLabel="Bekreft"
          onSubmit={formMethods.handleSubmit(lagNySluttfaseVurdering)}
          onAvbryt={onAvbryt}
          submitButtonDisabled={isSubmitting}
          cancelButtonDisabled={isSubmitting}
          shouldShowSubmitButton={!readOnly}
        >
          {dokumenter?.length > 0 && (
            <Box marginTop={Margin.large}>
              <Label size="small" aria-hidden="true">
                Hvilke dokumenter er brukt i vurderingen av livets sluttfase?
              </Label>
              <div className={styles.filterContainer}>
                <VurderingDokumentfilter text="Filter" filters={dokumentFilter} onFilterChange={updateDokumentFilter} />
              </div>
              {dokumentFilter.length > 0 && (
                <div className={styles.filterKnappContainer}>
                  {dokumentFilter.map(filter => {
                    const { label } = vurderingDokumentfilterOptions.find(option => option.attributtNavn === filter);
                    return (
                      <button
                        onClick={() => updateDokumentFilter(filter)}
                        className={styles.fjernFilterKnapp}
                        type="button"
                      >
                        {label}
                        <Close />
                      </button>
                    );
                  })}
                </div>
              )}
              <div className={styles.checkboxGroupWrapper}>
                <CheckboxGroupRHF
                  question="Hvilke dokumenter er brukt i vurderingen av livets sluttfase?"
                  name={FieldName.DOKUMENTER}
                  checkboxes={getDokumenterSomSkalVises().map(dokument => ({
                    value: dokument.id,
                    label: (
                      <DokumentLink
                        dokument={dokument}
                        etikett={
                          <div className={styles.dokumentEtiketter}>
                            {dokument.annenPartErKilde && (
                              <ContentWithTooltip tooltipText="Dokument fra annen part" tooltipDirectionRight>
                                <OnePersonOutlineGray />
                              </ContentWithTooltip>
                            )}
                            {dokument.bruktTilMinstEnVurdering && (
                              <ContentWithTooltip
                                tooltipText="Dokumentet er brukt i en annen vurdering"
                                tooltipDirectionRight
                              >
                                <StjerneIkon />
                              </ContentWithTooltip>
                            )}
                          </div>
                        }
                      />
                    ),
                  }))}
                  validators={{
                    harBruktDokumentasjon,
                  }}
                  disabled={readOnly}
                />
              </div>
              {visFlereDokumenterKnapp() && (
                <button
                  className={styles.visDokumenterKnapp}
                  onClick={() => setVisAlleDokumenter(!visAlleDokumenter)}
                  type="button"
                >
                  {visAlleDokumenter ? `Vis færre dokumenter` : `Vis alle dokumenter (${dokumenter.length})`}
                </button>
              )}
            </Box>
          )}
          <Box marginTop={Margin.xLarge}>
            <TextAreaRHF
              id="begrunnelsesfelt"
              disabled={readOnly}
              textareaClass={styles.begrunnelsesfelt}
              name={FieldName.VURDERING_AV_LIVETS_SLUTTFASE}
              label={
                <>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <b>
                    Gjør en vurdering av om den pleietrengende er i livets sluttfase i perioden det søkes for, jamfør
                    folketrygdens § 9.13
                  </b>
                  <p className={styles.begrunnelsesfelt__labeltekst}>
                    Du skal ta utgangspunkt i{' '}
                    <Link href="https://lovdata.no/nav/folketrygdloven/kap9" target="_blank">
                      lovteksten
                    </Link>{' '}
                    og{' '}
                    <Link
                      href="https://lovdata.no/nav/rundskriv/r09-00#ref/lov/1997-02-28-19/%C2%A79-13"
                      target="_blank"
                    >
                      rundskrivet
                    </Link>{' '}
                    når du skriver vurderingen.
                  </p>
                  <br />
                </>
              }
              validators={{ required }}
            />
          </Box>
          <Box marginTop={Margin.xLarge}>
            <RadioGroupPanelRHF
              question="Er den pleietrengende i livets sluttfase?"
              name={FieldName.ER_I_LIVETS_SLUTTFASE}
              radios={[
                { value: Vurderingsresultat.OPPFYLT, label: 'Ja' },
                { value: Vurderingsresultat.IKKE_OPPFYLT, label: 'Nei' },
              ]}
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
                inngårISammenhengendeSøknadsperiode: (value: Period) => {
                  const isOk = sammenhengendeSøknadsperioder.some(sammenhengendeSøknadsperiode =>
                    sammenhengendeSøknadsperiode.covers(value),
                  );

                  if (!isOk) {
                    return 'Perioden som vurderes må være innenfor en eller flere sammenhengede søknadsperioder';
                  }

                  return true;
                },
                fomDatoErFørTomDato,
              }}
              fromDatepickerProps={{
                label: 'Fra',
                ariaLabel: 'fra',
                limitations: {
                  minDate: avgrensningerForSøknadsperiode?.fom,
                  maxDate: avgrensningerForSøknadsperiode?.tom,
                  invalidDateRanges: hullISøknadsperiodene,
                },
              }}
              toDatepickerProps={{
                label: 'Til',
                ariaLabel: 'til',
                limitations: {
                  minDate: avgrensningerForSøknadsperiode?.fom,
                  maxDate: avgrensningerForSøknadsperiode?.tom,
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

export default VurderingAvLivetsSluttfaseForm;
