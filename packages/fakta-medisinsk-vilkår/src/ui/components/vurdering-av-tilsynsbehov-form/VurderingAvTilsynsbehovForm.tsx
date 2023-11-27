import { Close } from '@navikt/ds-icons';
import { Alert, Label, Link } from '@navikt/ds-react';
import { Box, ContentWithTooltip, Form, Margin, OnePersonOutlineGray } from '@navikt/ft-plattform-komponenter';
import { isSameOrBefore, Period } from '@fpsak-frontend/utils';
import { CheckboxGroupRHF, PeriodpickerListRHF, TextAreaRHF, YesOrNoQuestionRHF } from '@fpsak-frontend/form';
import React, { useState } from 'react';
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
import VurderingDokumentfilter from '../vurdering-dokumentfilter/VurderingDokumentfilter';
import vurderingDokumentfilterOptions from '../vurdering-dokumentfilter/vurderingDokumentfilterOptions';
import StjerneIkon from '../vurdering-av-form/StjerneIkon';
import styles from '../vurdering-av-form/vurderingForm.css';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import { finnBenyttedeDokumenter } from '../../../util/dokumentUtils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export enum FieldName {
  VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE = 'vurderingAvKontinuerligTilsynOgPleie',
  HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE = 'harBehovForKontinuerligTilsynOgPleie',
  PERIODER = 'perioder',
  DOKUMENTER = 'dokumenter',
}

const lagTilsynsbehovVurdering = (
  formState: VurderingAvTilsynsbehovFormState,
  alleDokumenter: Dokument[],
): Partial<Vurderingsversjon> => {
  const resultat = formState[FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]
    ? Vurderingsresultat.OPPFYLT
    : Vurderingsresultat.IKKE_OPPFYLT;

  const perioder = formState[FieldName.PERIODER].map(
    periodeWrapper => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom),
  );
  const begrunnelse = formState[FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE];

  return {
    resultat,
    perioder,
    tekst: begrunnelse,
    dokumenter: finnBenyttedeDokumenter(formState[FieldName.DOKUMENTER], alleDokumenter),
  };
};

export interface VurderingAvTilsynsbehovFormState {
  [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]?: string;
  [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]?: boolean;
  [FieldName.PERIODER]?: Period[];
  [FieldName.DOKUMENTER]: string[];
}

interface VurderingAvTilsynsbehovFormProps {
  defaultValues: VurderingAvTilsynsbehovFormState;
  onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
  resterendeVurderingsperioder?: Period[];
  perioderSomKanVurderes?: Period[];
  dokumenter: Dokument[];
  onAvbryt: () => void;
  isSubmitting: boolean;
  harPerioderDerPleietrengendeErOver18år?: boolean;
  barnetsAttenårsdag?: string;
}

const VurderingAvTilsynsbehovForm = ({
  defaultValues,
  onSubmit,
  resterendeVurderingsperioder,
  perioderSomKanVurderes,
  dokumenter,
  onAvbryt,
  isSubmitting,
  harPerioderDerPleietrengendeErOver18år,
  barnetsAttenårsdag,
}: VurderingAvTilsynsbehovFormProps): JSX.Element => {
  const { readOnly } = React.useContext(ContainerContext);
  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
  });
  const [visAlleDokumenter, setVisAlleDokumenter] = useState(false);
  const [dokumentFilter, setDokumentFilter] = useState([]);

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

  const perioderSomBlirVurdert: Period[] = useWatch({ control: formMethods.control, name: FieldName.PERIODER });
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

  const visLovparagrafForPleietrengendeOver18år = React.useMemo(
    () =>
      harPerioderDerPleietrengendeErOver18år &&
      perioderSomBlirVurdert.some(periode => {
        if ((periode as AnyType).period) {
          return isSameOrBefore(barnetsAttenårsdag, (periode as AnyType).period.fom);
        }
        return isSameOrBefore(barnetsAttenårsdag, periode.fom);
      }),
    [perioderSomBlirVurdert],
  );

  const hullISøknadsperiodene = React.useMemo(
    () => finnHullIPerioder(perioderSomKanVurderes).map(period => period.asInternationalPeriod()),
    [perioderSomKanVurderes],
  );

  const avgrensningerForSøknadsperiode = React.useMemo(
    () => finnMaksavgrensningerForPerioder(perioderSomKanVurderes),
    [perioderSomKanVurderes],
  );

  const lagNyTilsynsvurdering = (formState: VurderingAvTilsynsbehovFormState) => {
    onSubmit(lagTilsynsbehovVurdering(formState, dokumenter));
  };

  const sammenhengendeSøknadsperioder = slåSammenSammenhengendePerioder(perioderSomKanVurderes);

  return (
    <DetailViewVurdering title="Vurdering av tilsyn og pleie" perioder={defaultValues[FieldName.PERIODER]}>
      <div id="modal" />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...formMethods}>
        <Form
          buttonLabel="Bekreft"
          onSubmit={formMethods.handleSubmit(lagNyTilsynsvurdering)}
          onAvbryt={onAvbryt}
          submitButtonDisabled={isSubmitting}
          cancelButtonDisabled={isSubmitting}
          shouldShowSubmitButton={!readOnly}
        >
          {dokumenter?.length > 0 && (
            <Box marginTop={Margin.large}>
              <Label size="small" aria-hidden="true">
                Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?
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
                  question="Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?"
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
              name={FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE}
              label={
                <>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <b>
                    {visLovparagrafForPleietrengendeOver18år
                      ? `Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
                                        av sykdommen etter § 9-10, tredje ledd.`
                      : `Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
                                        av sykdommen etter § 9-10, første ledd.`}
                  </b>
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
                    <li>Om det er årsakssammenheng mellom sykdom og pleiebehov</li>
                    <li>Om behovet er kontinuerlig og ikke situasjonsbestemt</li>
                  </ul>
                </>
              }
              validators={{ required }}
            />
          </Box>
          <Box marginTop={Margin.xLarge}>
            <YesOrNoQuestionRHF
              question="Er det behov for tilsyn og pleie?"
              name={FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
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

export default VurderingAvTilsynsbehovForm;
