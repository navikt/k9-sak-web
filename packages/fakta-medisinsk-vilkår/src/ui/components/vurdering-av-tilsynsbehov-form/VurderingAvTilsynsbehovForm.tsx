import { CheckboxGroupRHF, PeriodpickerListRHF, TextAreaRHF, YesOrNoQuestionRHF } from '@fpsak-frontend/form';
import { Period, isSameOrBefore } from '@fpsak-frontend/utils';
import { FormWithButtons } from '@k9-sak-web/gui/shared/formWithButtons/FormWithButtons.js';
import { hasValidText } from '@k9-sak-web/gui/utils/validation/validators.js';
import { PersonIcon } from '@navikt/aksel-icons';
import { Close } from '@navikt/ds-icons';
import { Alert, Box, Button, Checkbox, CheckboxGroup, Label, Link, Tooltip } from '@navikt/ds-react';
import React, { useState, type JSX } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import { finnBenyttedeDokumenter } from '../../../util/dokumentUtils';
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
import StjerneIkon from '../vurdering-av-form/StjerneIkon';
import styles from '../vurdering-av-form/vurderingForm.module.css';
import VurderingDokumentfilter from '../vurdering-dokumentfilter/VurderingDokumentfilter';
import vurderingDokumentfilterOptions from '../vurdering-dokumentfilter/vurderingDokumentfilterOptions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export enum FieldName {
  VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE = 'vurderingAvKontinuerligTilsynOgPleie',
  HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE = 'harBehovForKontinuerligTilsynOgPleie',
  MANGLER_LEGEERKLÆRING = 'manglerLegeerklæring',
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

  const perioder = (formState[FieldName.PERIODER] ?? []).map(
    periodeWrapper => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom),
  );
  const begrunnelse = formState[FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE];

  if (formState[FieldName.MANGLER_LEGEERKLÆRING]) {
    return {
      manglerLegeerklæring: true,
      resultat: undefined,
      perioder,
      tekst: undefined,
      dokumenter: undefined,
    };
  }

  return {
    resultat,
    perioder,
    tekst: begrunnelse,
    dokumenter: finnBenyttedeDokumenter(formState[FieldName.DOKUMENTER], alleDokumenter),
  };
};

export interface VurderingAvTilsynsbehovFormState {
  [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]?: string;
  [FieldName.MANGLER_LEGEERKLÆRING]?: boolean;
  [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]?: boolean;
  [FieldName.PERIODER]?: Period[];
  [FieldName.DOKUMENTER]: string[];
}

interface VurderingAvTilsynsbehovFormProps {
  defaultValues: VurderingAvTilsynsbehovFormState;
  onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
  resterendeVurderingsperioder?: Period[];
  perioderSomKanVurderes: Period[];
  dokumenter: Dokument[];
  onAvbryt: () => void;
  isSubmitting: boolean;
  harPerioderDerPleietrengendeErOver18år?: boolean;
  barnetsAttenårsdag: string;
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
  const { readOnly, featureToggles } = React.useContext(ContainerContext);
  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
  });
  const [visAlleDokumenter, setVisAlleDokumenter] = useState(false);
  const [dokumentFilter, setDokumentFilter] = useState<string[]>([]);

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

  const perioderSomBlirVurdert: Period[] | undefined = useWatch({
    control: formMethods.control,
    name: FieldName.PERIODER,
  });
  const manglerLegeerklæring: boolean | undefined = useWatch({
    control: formMethods.control,
    name: FieldName.MANGLER_LEGEERKLÆRING,
  });
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
      (perioderSomBlirVurdert?.some(periode => {
        if ((periode as AnyType).period) {
          return isSameOrBefore(barnetsAttenårsdag, (periode as AnyType).period.fom);
        }
        return isSameOrBefore(barnetsAttenårsdag, periode.fom);
      }) ??
        false),
    [barnetsAttenårsdag, harPerioderDerPleietrengendeErOver18år, perioderSomBlirVurdert],
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
    <DetailViewVurdering title="Vurdering av tilsyn og pleie" perioder={defaultValues[FieldName.PERIODER] || []}>
      <div id="modal" />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...formMethods}>
        <FormWithButtons
          buttonLabel="Bekreft"
          onSubmit={formMethods.handleSubmit(lagNyTilsynsvurdering)}
          onAvbryt={onAvbryt}
          submitButtonDisabled={isSubmitting}
          cancelButtonDisabled={isSubmitting}
          shouldShowSubmitButton={!readOnly}
          smallButtons
        >
          {dokumenter?.length > 0 && (
            <Box.New marginBlock="6 0">
              <Label size="small" aria-hidden="true">
                Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?
              </Label>
              <div className={styles.filterContainer}>
                <VurderingDokumentfilter text="Filter" filters={dokumentFilter} onFilterChange={updateDokumentFilter} />
              </div>
              {dokumentFilter.length > 0 && (
                <div className={styles.filterKnappContainer}>
                  {dokumentFilter.map(filter => {
                    const option = vurderingDokumentfilterOptions.find(option => option.attributtNavn === filter);
                    const label = option ? option.label : filter;
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
                              <Tooltip content="Dokument fra annen part" placement="right">
                                <PersonIcon fontSize="1.5rem" />
                              </Tooltip>
                            )}
                            {dokument.bruktTilMinstEnVurdering && (
                              <Tooltip content="Dokumentet er brukt i en annen vurdering" placement="right">
                                <StjerneIkon />
                              </Tooltip>
                            )}
                          </div>
                        }
                      />
                    ),
                  }))}
                  validators={
                    manglerLegeerklæring
                      ? {}
                      : {
                          harBruktDokumentasjon,
                        }
                  }
                  disabled={readOnly}
                />
              </div>
              {visFlereDokumenterKnapp() && (
                <Button
                  className="mt-2"
                  onClick={() => setVisAlleDokumenter(!visAlleDokumenter)}
                  size="small"
                  type="button"
                  variant="secondary"
                >
                  {visAlleDokumenter ? `Vis færre dokumenter` : `Vis alle dokumenter (${dokumenter.length})`}
                </Button>
              )}
            </Box.New>
          )}
          {featureToggles?.BRUK_MANGLER_LEGEERKLÆRING_I_TILSYN_OG_PLEIE && (
            <Box.New marginBlock="8 0">
              <Controller
                name={FieldName.MANGLER_LEGEERKLÆRING}
                render={({ field }) => (
                  <CheckboxGroup legend="Mangler det legeerklæring for perioden?" size="small">
                    <Checkbox
                      onChange={e => {
                        field.onChange(e.target.checked ? true : false);
                      }}
                      checked={field.value === true}
                    >
                      Mangler riktig legeerklæring for perioden, jmf. §9-16
                    </Checkbox>
                  </CheckboxGroup>
                )}
              />
            </Box.New>
          )}

          <Box.New marginBlock="8 0">
            <TextAreaRHF
              id="begrunnelsesfelt"
              disabled={readOnly || manglerLegeerklæring}
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
              validators={manglerLegeerklæring ? {} : { required, hasValidText }}
            />
          </Box.New>
          <Box.New marginBlock="8 0">
            <YesOrNoQuestionRHF
              question="Er det behov for tilsyn og pleie?"
              name={FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
              validators={manglerLegeerklæring ? {} : { required }}
              disabled={readOnly || manglerLegeerklæring}
            />
          </Box.New>
          <Box.New marginBlock="8 0">
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
              renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => {
                if (numberOfItems > 1)
                  return (
                    <DeleteButton
                      onClick={() => {
                        fieldArrayMethods.remove(index);
                      }}
                    />
                  );
                return <></>;
              }}
              renderAfterFieldArray={fieldArrayMethods => (
                <Box.New marginBlock="6 0">
                  <AddButton
                    label="Legg til periode"
                    onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                    id="leggTilPeriodeKnapp"
                  />
                </Box.New>
              )}
            />
          </Box.New>
          {!harVurdertAlleDagerSomSkalVurderes && (
            <Box.New marginBlock="8 0">
              <Alert size="small" variant="info">
                Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har
                lagret denne.
              </Alert>
            </Box.New>
          )}
        </FormWithButtons>
      </FormProvider>
    </DetailViewVurdering>
  );
};

export default VurderingAvTilsynsbehovForm;
