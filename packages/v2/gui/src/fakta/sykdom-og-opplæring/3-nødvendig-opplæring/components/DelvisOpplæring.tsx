import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto,
  type k9_kodeverk_vilkår_Avslagsårsak as OpplæringVurderingDtoAvslagsårsak,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  checkForOverlap,
  checkIfPeriodsAreEdgeToEdge,
  combineConsecutivePeriods,
  findUncoveredDays,
  getDaysInPeriod,
} from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { formatPeriod } from '../../../../utils/formatters';
import { PlusCircleIcon, ScissorsFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, DatePicker, Label, Modal, Radio, RadioGroup } from '@navikt/ds-react';
import { Period } from '@navikt/ft-utils';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  type FieldArrayWithId,
  type UseFieldArrayRemove,
  type UseFieldArrayReplace,
} from 'react-hook-form';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex';
import { Avslagsårsak } from './Avslagsårsak';
import Periodevelger from '../../../../shared/periodevelger/Periodevelger';

type NødvendigOpplæringFormFields = {
  begrunnelse: string;
  resultat: OpplæringVurderingDtoResultat | '';
  harLegeerklæring: 'JA' | 'NEI' | '';
  harNødvendigOpplæring: 'JA' | 'DELVIS' | 'NEI' | '';
  avslagsårsak?: OpplæringVurderingDtoAvslagsårsak;
  perioder: {
    resultat: OpplæringVurderingDtoResultat | '';
    avslagsårsak: OpplæringVurderingDtoAvslagsårsak | '';
    fom: string;
    tom: string;
  }[];
  perioderUtenNødvendigOpplæring: {
    fom: string;
    tom: string;
    resultat: OpplæringVurderingDtoResultat | '';
    avslagsårsak: OpplæringVurderingDtoAvslagsårsak | '';
  }[];
};

const validateReisedag = (value: OpplæringVurderingDtoResultat | '', periode: { fom: string; tom: string }) => {
  if (value === OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID) {
    const days = getDaysInPeriod({
      fom: periode.fom,
      tom: periode.tom,
    });
    const hasWeekend = days.some(day => {
      const dayOfWeek = dayjs(day).day();
      return dayOfWeek === 0 || dayOfWeek === 6;
    });
    if (hasWeekend) {
      return 'Reisedag kan ikke være en helgedag';
    }
  }
  return undefined;
};

export const DelvisOpplæring = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const opprinneligPeriode = vurdering.perioder[0]!;
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const submitCount = formMethods.formState.submitCount;
  const context = useContext(SykdomOgOpplæringContext);
  const readOnly = context.readOnly;
  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'perioder',
  });

  const perioder = formMethods.watch('perioder');
  const uncoveredDays = findUncoveredDays(opprinneligPeriode, perioder);
  const uncoveredPeriods = combineConsecutivePeriods(uncoveredDays);
  const touchedFieldsIndexes = formMethods.formState.touchedFields?.perioder
    ?.map((v, index) => (v ? index : undefined))
    .filter(v => v !== undefined);

  // hvis periode A og B overlapper, og vi deretter endrer periode A så de ikke lenger overlapper
  // så må vi gjøre dette for å få trigget validering av periode B for å fjern feilmeldingen
  // gjelder også hvis man går fra å ikke overlappe til å overlappe
  useEffect(() => {
    if (submitCount && submitCount > 0) {
      perioder.forEach((periode, index) => {
        if (periode.fom && periode.tom) {
          void formMethods.trigger(`perioder.${index}.fom`);
          void formMethods.trigger(`perioder.${index}.tom`);
        }
      });
    }
  }, [JSON.stringify(perioder), JSON.stringify(touchedFieldsIndexes), submitCount]);
  return (
    <div id="delvis-opplæring">
      <div className="flex flex-col gap-4">
        <Label size="small">I hvilken periode er det nødvendig opplæring?</Label>
        {fields.map((v, index) => (
          <div className="flex gap-4" key={v.id}>
            <Periodevelger
              minDate={vurdering.perioder[0]?.fom ? dayjs(vurdering.perioder[0].fom).toDate() : undefined}
              maxDate={vurdering.perioder[0]?.tom ? dayjs(vurdering.perioder[0].tom).toDate() : undefined}
              fromField={{
                name: `perioder.${index}.fom`,
                validate: [
                  (value: string) => (value && dayjs(value).isValid() ? undefined : 'Fra er påkrevd'),
                  (value: string) => {
                    if (!value || !perioder[index]?.fom) return undefined;
                    const currentPeriod = { fom: value, tom: perioder[index]?.tom };
                    const allPeriods = fields.map(field => ({ fom: field.fom, tom: field.tom }));
                    return checkForOverlap(index, currentPeriod, allPeriods)
                      ? 'Perioden kan ikke overlappe med andre perioder'
                      : undefined;
                  },
                ],
              }}
              toField={{
                name: `perioder.${index}.tom`,
                validate: [
                  (value: string) => (value && dayjs(value).isValid() ? undefined : 'Til er påkrevd'),
                  (value: string) => {
                    if (!value || !perioder[index]?.tom) return undefined;
                    const currentPeriod = { fom: value, tom: perioder[index]?.tom };
                    const allPeriods = fields.map(field => ({ fom: field.fom, tom: field.tom }));
                    return checkForOverlap(index, currentPeriod, allPeriods)
                      ? 'Perioden kan ikke overlappe med andre perioder'
                      : undefined;
                  },
                ],
              }}
              readOnly={readOnly}
              size="small"
            />
            {index > 0 && (
              <Button variant="tertiary" size="small" type="button" onClick={() => remove(index)} icon={<TrashIcon />}>
                Fjern
              </Button>
            )}
          </div>
        ))}
        <div>
          <Button
            variant="tertiary"
            size="small"
            type="button"
            icon={<PlusCircleIcon />}
            iconPosition="left"
            onClick={() => {
              append({
                fom: '',
                tom: '',
                resultat: '',
                avslagsårsak: '',
              });
            }}
          >
            Legg til ny periode
          </Button>
          <div>
            <PerioderUtenNødvendigOpplæring perioder={uncoveredPeriods} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PerioderUtenNødvendigOpplæring = ({ perioder }: { perioder: { fom: string; tom: string }[] }) => {
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const { fields, remove, update, replace } = useFieldArray<
    NødvendigOpplæringFormFields,
    'perioderUtenNødvendigOpplæring',
    'id'
  >({
    control: formMethods.control,
    name: 'perioderUtenNødvendigOpplæring',
  });
  const [periodeSomMåDekkes, setPeriodeSomMåDekkes] = useState<{ fom: string; tom: string } | null>(null);

  useEffect(() => {
    if (perioder.length > 0) {
      setPeriodeSomMåDekkes(perioder[0]!);
    }
  }, [perioder]);

  useEffect(() => {
    replace(
      perioder.map(period => {
        return {
          fom: period.fom,
          tom: period.tom,
          resultat: '',
          avslagsårsak: '',
        };
      }),
    );
    // perioder er faktisk i dependency arrayet så disabler warning her. Må ha stringify så vi ikke får infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(perioder), replace]);

  const checkWhichExistingPeriodToPutPeriodIn = (
    fields: FieldArrayWithId<NødvendigOpplæringFormFields, 'perioderUtenNødvendigOpplæring', 'id'>[],
    uncoveredPeriod: { fom: string; tom: string },
  ) => {
    return fields.find(field => checkIfPeriodsAreEdgeToEdge(field, uncoveredPeriod));
  };

  const expandPeriod = (
    existingPeriod: FieldArrayWithId<NødvendigOpplæringFormFields, 'perioderUtenNødvendigOpplæring', 'id'>,
    newPeriod: { fom: string; tom: string },
  ) => {
    const isBefore = dayjs(newPeriod.fom).isBefore(dayjs(existingPeriod?.fom));
    if (isBefore) {
      return {
        ...existingPeriod,
        fom: newPeriod.fom,
      };
    }

    return { ...existingPeriod, tom: newPeriod.tom };
  };

  useEffect(() => {
    if (!periodeSomMåDekkes) return;
    const uncoveredDays = findUncoveredDays(
      periodeSomMåDekkes,
      fields.map(periode => ({ fom: periode.fom, tom: periode.tom })),
    );
    if (uncoveredDays.length === 0) return;
    const uncoveredPeriods = combineConsecutivePeriods(uncoveredDays);
    const existingPeriod = checkWhichExistingPeriodToPutPeriodIn(fields, uncoveredPeriods[0]!);
    if (existingPeriod) {
      replace(
        [
          ...fields.filter(field => field.id !== existingPeriod.id),
          expandPeriod(existingPeriod, uncoveredPeriods[0]!),
        ].sort((a, b) => dayjs(a.fom).diff(dayjs(b.fom))),
      );
    }
  }, [fields.length, fields, periodeSomMåDekkes, remove, replace]);

  return (
    <>
      {fields.map((periodeUtenNødvendigOpplæring, index, array) => {
        return (
          <React.Fragment key={periodeUtenNødvendigOpplæring.id}>
            <div className="mt-4">
              <Controller
                control={formMethods.control}
                name={`perioderUtenNødvendigOpplæring.${index}.resultat`}
                rules={{
                  validate: value => validateReisedag(value, periodeUtenNødvendigOpplæring),
                }}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onChange={value => {
                      field.onChange(value);
                      update(index, { ...periodeUtenNødvendigOpplæring, resultat: value });
                    }}
                    legend={
                      <div>
                        Hva vil du gjøre med dagene{' '}
                        {formatPeriod(periodeUtenNødvendigOpplæring.fom, periodeUtenNødvendigOpplæring.tom)}?{' '}
                        <PeriodeHandlinger
                          periodeUtenNødvendigOpplæring={periodeUtenNødvendigOpplæring}
                          index={index}
                          replace={replace}
                          remove={remove}
                          kanSlette={array.length > 1}
                        />
                      </div>
                    }
                    size="small"
                    error={formMethods.formState.errors.perioderUtenNødvendigOpplæring?.[index]?.resultat?.message}
                  >
                    <Radio value={OpplæringVurderingDtoResultat.IKKE_GODKJENT}>Avslag</Radio>

                    <Radio value={OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID}>Vurder som reisedag</Radio>
                  </RadioGroup>
                )}
              />
            </div>
            {periodeUtenNødvendigOpplæring.resultat === OpplæringVurderingDtoResultat.IKKE_GODKJENT && (
              <div className="mt-4">
                <Avslagsårsak
                  name={`perioderUtenNødvendigOpplæring.${index}.avslagsårsak`}
                  fieldValue={periodeUtenNødvendigOpplæring}
                  update={update}
                  index={index}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

const PeriodeHandlinger = ({
  periodeUtenNødvendigOpplæring,
  replace,
  remove,
  index,
  kanSlette,
}: {
  periodeUtenNødvendigOpplæring: NødvendigOpplæringFormFields['perioderUtenNødvendigOpplæring'][number];
  replace: UseFieldArrayReplace<NødvendigOpplæringFormFields, 'perioderUtenNødvendigOpplæring'>;
  remove: UseFieldArrayRemove;
  index: number;
  kanSlette: boolean;
}) => {
  const [visModal, setVisModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [klippetPeriode, setKlippetPeriode] = useState<{ fom: string; tom: string } | null>(null);

  const handleCloseModal = () => {
    setVisModal(false);
    setError(null);
    setKlippetPeriode(null);
  };
  const antallDager = getDaysInPeriod(periodeUtenNødvendigOpplæring).length;

  const handleSubmit = () => {
    if (!klippetPeriode) {
      setError('Du må spesifisere en periode');
      return;
    }
    const uncoveredDays = findUncoveredDays(
      { fom: periodeUtenNødvendigOpplæring.fom, tom: periodeUtenNødvendigOpplæring.tom },
      [{ fom: klippetPeriode.fom, tom: klippetPeriode.tom }],
    );

    const combinedPeriods = combineConsecutivePeriods(uncoveredDays);
    const newPeriods = [...combinedPeriods, { fom: klippetPeriode.fom, tom: klippetPeriode.tom }]
      .sort((a, b) => dayjs(a.fom).diff(dayjs(b.fom)))
      .map(period => ({
        fom: period.fom,
        tom: period.tom,
        resultat: '' as const,
        avslagsårsak: '' as const,
      }));
    replace(newPeriods);

    handleCloseModal();
  };

  return (
    <>
      {antallDager > 1 && (
        <Button
          variant="tertiary"
          size="small"
          type="button"
          icon={<ScissorsFillIcon />}
          onClick={() => setVisModal(true)}
        />
      )}

      {kanSlette && (
        <Button variant="tertiary" size="small" type="button" icon={<TrashIcon />} onClick={() => remove(index)} />
      )}

      <Modal open={visModal} onClose={() => setVisModal(false)} aria-label="Klipp periode">
        <Modal.Header>Spesifiser periode</Modal.Header>
        <Modal.Body>
          <DatePicker.Standalone
            mode="range"
            onSelect={value => {
              if (value && value.from && value.to) {
                setKlippetPeriode({
                  fom: dayjs(value.from).format('YYYY-MM-DD'),
                  tom: dayjs(value.to).format('YYYY-MM-DD'),
                });
              } else {
                setKlippetPeriode(null);
              }
            }}
            dropdownCaption
            fromDate={new Date(periodeUtenNødvendigOpplæring.fom)}
            toDate={new Date(periodeUtenNødvendigOpplæring.tom)}
          />
          {error && <Alert variant="error">{error}</Alert>}
          <div className="flex justify-between mt-4">
            <Button variant="tertiary" type="button" onClick={handleCloseModal}>
              Avbryt
            </Button>
            <Button variant="primary" type="button" onClick={handleSubmit}>
              Legg til
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
