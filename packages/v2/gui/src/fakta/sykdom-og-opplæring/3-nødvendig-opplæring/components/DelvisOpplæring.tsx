import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto,
  type k9_kodeverk_vilkår_Avslagsårsak as OpplæringVurderingDtoAvslagsårsak,
} from '@k9-sak-web/backend/k9sak/generated';
import {
  Controller,
  useFieldArray,
  useFormContext,
  type FieldArrayWithId,
  type UseFieldArrayRemove,
  type UseFieldArrayReplace,
} from 'react-hook-form';
import { Period } from '@navikt/ft-utils';
import { Alert, Button, Label, Modal, Radio, RadioGroup, DatePicker } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex';
import dayjs from 'dayjs';
import { Datepicker as RHFDatepicker } from '@navikt/ft-form-hooks';
import { PlusCircleIcon, ScissorsFillIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  checkIfPeriodsAreEdgeToEdge,
  combineConsecutivePeriods,
  findUncoveredDays,
  formatPeriod,
  getDaysInPeriod,
} from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Avslagsårsak } from './Avslagsårsak';

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

export const DelvisOpplæring = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const opprinneligPeriode = vurdering.perioder[0]!;
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const context = useContext(SykdomOgOpplæringContext);
  const readOnly = context.readOnly;
  const { fields, append, remove, update } = useFieldArray({
    control: formMethods.control,
    name: 'perioder',
  });

  const uncoveredDays = findUncoveredDays(
    opprinneligPeriode,
    fields.map(periode => ({ fom: periode.fom, tom: periode.tom })),
  );
  const uncoveredPeriods = combineConsecutivePeriods(uncoveredDays);

  return (
    <div id="delvis-opplæring">
      <div className="flex flex-col gap-4">
        <Label size="small">I hvilken periode er det nødvendig opplæring?</Label>
        {fields.map((v, index) => (
          <div className="flex gap-4" key={v.id}>
            <Controller
              control={formMethods.control}
              name={`perioder.${index}.fom`}
              render={({ field }) => (
                <RHFDatepicker
                  {...field}
                  label="Fra"
                  size="small"
                  disabled={readOnly}
                  validate={[
                    (value: string) => (value && dayjs(value).isValid() ? undefined : 'Fra er påkrevd'),
                    (value: string) =>
                      value && dayjs(value).isSameOrBefore(dayjs(v.tom)) ? undefined : 'Fra må være før til',
                  ]}
                  fromDate={new Date(opprinneligPeriode.fom)}
                  toDate={new Date(opprinneligPeriode.tom)}
                  onChange={value => {
                    field.onChange(value);
                    update(index, { ...v, fom: value });
                  }}
                />
              )}
            />
            <Controller
              control={formMethods.control}
              name={`perioder.${index}.tom`}
              render={({ field }) => (
                <RHFDatepicker
                  {...field}
                  label="Til"
                  size="small"
                  disabled={readOnly}
                  validate={[
                    (value: string) => (value && dayjs(value).isValid() ? undefined : 'Til er påkrevd'),
                    (value: string) =>
                      value && dayjs(v.fom).isSameOrBefore(dayjs(value)) ? undefined : 'Til må være etter fra',
                  ]}
                  fromDate={new Date(vurdering.opplæring.fom)}
                  toDate={new Date(vurdering.opplæring.tom)}
                  onChange={value => {
                    field.onChange(value);
                    update(index, { ...v, tom: value });
                  }}
                />
              )}
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
                  >
                    <Radio value={OpplæringVurderingDtoResultat.IKKE_GODKJENT}>Avslag</Radio>
                    <Radio value={OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID}>Vurder som reisetid</Radio>
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
