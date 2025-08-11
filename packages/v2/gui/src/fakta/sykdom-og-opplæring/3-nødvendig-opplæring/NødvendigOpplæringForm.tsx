import {
  OpplæringVurderingDtoAvslagsårsak,
  OpplæringVurderingDtoResultat,
  type OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  type ControllerProps,
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
} from 'react-hook-form';
import { Period } from '@navikt/ft-utils';
import {
  Alert,
  BodyShort,
  Button,
  Heading,
  Label,
  Link,
  List,
  Modal,
  Radio,
  RadioGroup,
  ReadMore,
  Textarea,
  DatePicker,
} from '@navikt/ds-react';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { ListItem } from '@navikt/ds-react/List';
import React, { useContext, useEffect, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import dayjs from 'dayjs';
import { KodeverdiSomObjektAvslagsårsakKilde } from '@k9-sak-web/backend/k9sak/generated';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import { Periodevisning } from '../../../shared/detailView/DetailView.js';
import { Datepicker as RHFDatepicker } from '@navikt/ft-form-hooks';
import { PlusCircleIcon, ScissorsFillIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  checkIfPeriodsAreEdgeToEdge,
  combineConsecutivePeriods,
  findUncoveredDays,
  formatPeriod,
  getDaysInPeriod,
} from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import InstitusjonOgSykdomInfo from './components/InstitusjonOgSykdomInfo.js';
import type { nødvendigOpplæringPayload } from '../FaktaSykdomOgOpplæringIndex.js';

const utledNødvendigOpplæring = (resultat: OpplæringVurderingDtoResultat): 'JA' | 'DELVIS' | 'NEI' | '' => {
  if (resultat === OpplæringVurderingDtoResultat.GODKJENT) {
    return 'JA';
  }
  if (resultat === OpplæringVurderingDtoResultat.IKKE_GODKJENT) {
    return 'NEI';
  }
  return '';
};

const utledHarLegeerklæring = (resultat: OpplæringVurderingDtoResultat): 'JA' | 'NEI' | '' => {
  if (resultat === OpplæringVurderingDtoResultat.IKKE_DOKUMENTERT) {
    return 'NEI';
  }
  if (resultat === OpplæringVurderingDtoResultat.MÅ_VURDERES) {
    return '';
  }
  return 'JA';
};

const defaultValues = (vurdering: OpplæringVurderingDto & { perioder: Period[] }) => {
  return {
    begrunnelse: vurdering.begrunnelse,
    resultat: vurdering.resultat,
    harLegeerklæring: utledHarLegeerklæring(vurdering.resultat),
    harNødvendigOpplæring: utledNødvendigOpplæring(vurdering.resultat),
    // Her er det bare en periode, så vi kan bruke perioder[0]!
    perioder: [
      {
        resultat: vurdering.resultat,
        avslagsårsak: vurdering.avslagsårsak,
        fom: vurdering.perioder[0]!.fom,
        tom: vurdering.perioder[0]!.tom,
      },
    ],
  };
};

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

const NødvendigOpplæringForm = ({
  vurdering,
  setRedigering,
  redigering,
}: {
  vurdering: OpplæringVurderingDto & { perioder: Period[] };
  setRedigering: (redigering: boolean) => void;
  redigering: boolean;
}) => {
  const { readOnly, løsAksjonspunkt9302 } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm<NødvendigOpplæringFormFields>({
    defaultValues: defaultValues(vurdering),
  });

  useEffect(() => {
    formMethods.reset({
      ...defaultValues(vurdering),
    });
  }, [formMethods, vurdering]);

  const opplæringIkkeDokumentertMedLegeerklæring = formMethods.watch('harLegeerklæring') === 'NEI';

  useEffect(() => {
    if (opplæringIkkeDokumentertMedLegeerklæring) {
      formMethods.setValue('begrunnelse', '');
      formMethods.setValue('harNødvendigOpplæring', '');
    } else {
      formMethods.setValue('harNødvendigOpplæring', '');
    }
  }, [opplæringIkkeDokumentertMedLegeerklæring, formMethods]);

  const nødvendigOpplæring = formMethods.watch('harNødvendigOpplæring');
  return (
    <>
      <Form
        formMethods={formMethods}
        onSubmit={data => {
          const perioder = data.perioder.map(periode => ({
            begrunnelse: data.begrunnelse,
            resultat:
              data.harNødvendigOpplæring === 'JA' || data.harNødvendigOpplæring === 'DELVIS'
                ? OpplæringVurderingDtoResultat.GODKJENT
                : OpplæringVurderingDtoResultat.IKKE_GODKJENT,
            avslagsårsak: data.avslagsårsak || null,
            periode: {
              fom: dayjs(periode.fom).format('YYYY-MM-DD'),
              tom: dayjs(periode.tom).format('YYYY-MM-DD'),
            },
          }));

          const perioderUtenNødvendigOpplæring = data.perioderUtenNødvendigOpplæring.map(periode => ({
            begrunnelse: data.begrunnelse,
            resultat: periode.resultat,
            avslagsårsak: periode.avslagsårsak || null,
            periode: {
              fom: dayjs(periode.fom).format('YYYY-MM-DD'),
              tom: dayjs(periode.tom).format('YYYY-MM-DD'),
            },
          }));

          løsAksjonspunkt9302({
            perioder: [...perioder, ...perioderUtenNødvendigOpplæring],
          } as nødvendigOpplæringPayload);
        }}
      >
        <div className="flex flex-col gap-6">
          <Controller
            control={formMethods.control}
            name="harLegeerklæring"
            rules={
              opplæringIkkeDokumentertMedLegeerklæring
                ? undefined
                : {
                    validate: value =>
                      value?.length && value.length > 0 ? undefined : 'Dokumentert opplæring er påkrevd',
                  }
            }
            render={({ field }) => (
              <RadioGroup
                legend="Har vi fått legeerklæring?"
                {...field}
                readOnly={readOnly}
                size="small"
                error={formMethods.formState.errors.harLegeerklæring?.message as string | undefined}
              >
                <Radio value="JA">Ja</Radio>
                <Radio value="NEI">Nei</Radio>
              </RadioGroup>
            )}
          />
          <div className={`flex flex-col gap-6 ${opplæringIkkeDokumentertMedLegeerklæring ? 'opacity-30' : ''}`}>
            <div className="mt-4">
              <Heading size="small" level="2" className="!mb-0">
                Vurdering av nødvendig opplæring
              </Heading>
              <Periodevisning perioder={vurdering.perioder} />
            </div>
            <div className="border-none bg-border-subtle h-[2px]" />
            <InstitusjonOgSykdomInfo perioder={vurdering.perioder} />
          </div>
          <div>
            <Textarea
              {...formMethods.register('begrunnelse', {
                validate: opplæringIkkeDokumentertMedLegeerklæring
                  ? undefined
                  : value => (value?.length > 0 ? undefined : 'Begrunnelse er påkrevd'),
              })}
              readOnly={readOnly}
              size="small"
              label={
                <Label htmlFor="begrunnelse" size="small">
                  Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter
                  <Lovreferanse> § 9-14, første ledd</Lovreferanse>
                </Label>
              }
              minRows={3}
              id="begrunnelse"
              error={formMethods.formState.errors.begrunnelse?.message as string | undefined}
              disabled={opplæringIkkeDokumentertMedLegeerklæring}
              description={
                <ReadMore header="Hva skal vurderingen inneholde?" size="small">
                  <BodyShort size="small">
                    Du skal ta utgangspunkt i{' '}
                    <Link href="https://lovdata.no/dokument/NL/lov/1997-02-28-19/KAPITTEL_4-5-3#%C2%A79-14">
                      lovteksten
                    </Link>{' '}
                    og{' '}
                    <Link href="https://lovdata.no/nav/rundskriv/r09-00#ref/lov/1997-02-28-19/%C2%A79-14">
                      rundskrivet
                    </Link>{' '}
                    når du skriver vurderingen.
                  </BodyShort>
                  <div className="mt-6">
                    Vurderingen skal beskrive:
                    {/* overrider margin-block i List sitt child element ul med important*/}
                    <List size="small" className="[&>ul]:!m-0">
                      {/* !mb-0 overrider marign-block-end med important*/}
                      <ListItem className="!mb-0">Om kursinnholdet tilsier at det er opplæring</ListItem>
                      <ListItem className="!mb-0">
                        Om det er årsakssammenheng mellom opplæringen og sykdom til barnet
                      </ListItem>
                    </List>
                  </div>
                </ReadMore>
              }
            />
          </div>
          <Controller
            control={formMethods.control}
            name="harNødvendigOpplæring"
            rules={
              opplæringIkkeDokumentertMedLegeerklæring
                ? undefined
                : {
                    validate: value =>
                      value?.length && value.length > 0 ? undefined : 'Nødvendig opplæring er påkrevd',
                  }
            }
            disabled={opplæringIkkeDokumentertMedLegeerklæring}
            render={({ field }) => (
              <RadioGroup
                legend="Har søker opplæring som er nødvendig?"
                {...field}
                readOnly={readOnly}
                size="small"
                error={formMethods.formState.errors.harNødvendigOpplæring?.message as string | undefined}
              >
                <Radio value="JA">Ja</Radio>
                <Radio value="DELVIS">Deler av perioden</Radio>
                <Radio value="NEI">Nei</Radio>
              </RadioGroup>
            )}
          />
          {nødvendigOpplæring === 'DELVIS' && <DelvisOpplæring vurdering={vurdering} />}
          {nødvendigOpplæring === 'NEI' && <Avslagsårsak name="avslagsårsak" />}
          {opplæringIkkeDokumentertMedLegeerklæring && (
            <Alert variant="info" size="small">
              Behandlingen vil gå videre til avslag for manglende dokumentasjon av nødvendig opplæring etter{' '}
              <Lovreferanse>§9-14</Lovreferanse> og <Lovreferanse>§22-3</Lovreferanse>. Før du kan avslå må du etterlyse
              dokumentasjon fra bruker.
            </Alert>
          )}
          {!readOnly && (
            <div className="flex gap-4">
              <Button variant="primary" type="submit" size="small">
                Bekreft og fortsett
              </Button>
              {redigering && (
                <Button variant="secondary" type="button" onClick={() => setRedigering(false)} size="small">
                  Avbryt redigering
                </Button>
              )}
            </div>
          )}
        </div>
      </Form>
    </>
  );
};

const DelvisOpplæring = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const opprinneligPeriode = vurdering.perioder[0]!;
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const readOnly = useContext(SykdomOgOpplæringContext).readOnly;
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

const PerioderUtenNødvendigOpplæring = ({ perioder }: { perioder: { fom: string; tom: string }[] }) => {
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const { fields, append, remove, update, replace } = useFieldArray({
    control: formMethods.control,
    name: 'perioderUtenNødvendigOpplæring',
  });
  const [periodeSomMåDekkes, setPeriodeSomMåDekkes] = useState<{ fom: string; tom: string } | null>(null);

  useEffect(() => {
    if (perioder.length > 0) {
      setPeriodeSomMåDekkes(perioder[0]!);
    }
  }, [JSON.stringify(perioder)]);

  useEffect(() => {
    remove();
    perioder.forEach(period => {
      append({
        fom: period.fom,
        tom: period.tom,
        resultat: '',
        avslagsårsak: '',
      });
    });
  }, [JSON.stringify(perioder)]);

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
      periodeSomMåDekkes!,
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
  }, [fields.length, fields, periodeSomMåDekkes, remove, append]);

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
                          append={append}
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

const Avslagsårsak = ({
  name,
  update,
  index,
  fieldValue,
}: {
  name: ControllerProps<NødvendigOpplæringFormFields>['name'];
  update?: (index: number, value: any) => void;
  index?: number;
  fieldValue?: NødvendigOpplæringFormFields['perioderUtenNødvendigOpplæring'][number];
}) => {
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const readOnly = useContext(SykdomOgOpplæringContext).readOnly;
  const k9Kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const opplæringIkkeDokumentertMedLegeerklæring = formMethods.watch('harLegeerklæring') === 'NEI';

  return (
    <Controller
      control={formMethods.control}
      name={name}
      rules={
        opplæringIkkeDokumentertMedLegeerklæring
          ? undefined
          : {
              validate: value => {
                return value === KodeverdiSomObjektAvslagsårsakKilde.IKKE_NØDVENDIG_OPPLÆRING ||
                  value === KodeverdiSomObjektAvslagsårsakKilde.IKKE_OPPLÆRING_I_PERIODEN
                  ? undefined
                  : 'Avslagsårsak er påkrevd';
              },
            }
      }
      render={({ field, fieldState }) => {
        return (
          <RadioGroup
            {...field}
            legend="Avslagsårsak"
            readOnly={readOnly}
            size="small"
            error={fieldState.error?.message as string | undefined}
            onChange={value => {
              field.onChange(value);
              if (index !== undefined && update) {
                update(index, { ...fieldValue, avslagsårsak: value });
              }
            }}
          >
            <Radio value={KodeverdiSomObjektAvslagsårsakKilde.IKKE_NØDVENDIG_OPPLÆRING}>
              {
                k9Kodeverkoppslag.k9sak.avslagsårsaker(KodeverdiSomObjektAvslagsårsakKilde.IKKE_NØDVENDIG_OPPLÆRING)
                  .navn
              }
            </Radio>
            <Radio value={KodeverdiSomObjektAvslagsårsakKilde.IKKE_OPPLÆRING_I_PERIODEN}>
              {
                k9Kodeverkoppslag.k9sak.avslagsårsaker(KodeverdiSomObjektAvslagsårsakKilde.IKKE_OPPLÆRING_I_PERIODEN)
                  .navn
              }
            </Radio>
          </RadioGroup>
        );
      }}
    />
  );
};

const PeriodeHandlinger = ({
  periodeUtenNødvendigOpplæring,
  append,
  remove,
  index,
  kanSlette,
}: {
  periodeUtenNødvendigOpplæring: NødvendigOpplæringFormFields['perioderUtenNødvendigOpplæring'][number];
  append: UseFieldArrayAppend<NødvendigOpplæringFormFields, 'perioderUtenNødvendigOpplæring'>;
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
    remove();
    const newPeriods = [...combinedPeriods, { fom: klippetPeriode.fom, tom: klippetPeriode.tom }]
      .sort((a, b) => dayjs(a.fom).diff(dayjs(b.fom)))
      .map(period => ({
        fom: period.fom,
        tom: period.tom,
        resultat: '' as const,
        avslagsårsak: '' as const,
      }));
    newPeriods.forEach(period => append(period));

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

export default NødvendigOpplæringForm;
