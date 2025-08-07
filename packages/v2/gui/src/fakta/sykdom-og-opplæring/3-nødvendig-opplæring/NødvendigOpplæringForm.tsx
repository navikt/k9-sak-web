import {
  OpplæringVurderingDtoAvslagsårsak,
  OpplæringVurderingDtoResultat,
  type OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { Period } from '@navikt/ft-utils';
import { Period as PeriodType } from '@navikt/ft-utils';
import {
  Alert,
  BodyShort,
  Button,
  Heading,
  Label,
  Link,
  List,
  Radio,
  RadioGroup,
  ReadMore,
  Textarea,
} from '@navikt/ds-react';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { ListItem } from '@navikt/ds-react/List';
import { useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import dayjs from 'dayjs';
import { KodeverdiSomObjektAvslagsårsakKilde } from '@k9-sak-web/backend/k9sak/generated';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import { Periodevisning } from '../../../shared/detailView/DetailView.js';
import InstitusjonOgSykdomInfo from './InstitusjonOgSykdomInfo.js';
import { Datepicker } from '@navikt/ft-form-hooks';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { combineConsecutivePeriods, formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';

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

const defaultValues = (vurdering: OpplæringVurderingDto & { perioder: PeriodType[] }) => {
  return {
    begrunnelse: vurdering.begrunnelse,
    resultat: vurdering.resultat,
    harLegeerklæring: utledHarLegeerklæring(vurdering.resultat),
    harNødvendigOpplæring: utledNødvendigOpplæring(vurdering.resultat),
    perioder: vurdering.perioder.map(periode => ({
      resultat: vurdering.resultat,
      avslagsårsak: vurdering.avslagsårsak,
      fom: periode.fom,
      tom: periode.tom,
    })),
  };
};

type NødvendigOpplæringFormFields = {
  begrunnelse: string;
  resultat: OpplæringVurderingDtoResultat;
  harLegeerklæring: 'JA' | 'NEI' | '';
  harNødvendigOpplæring: 'JA' | 'DELVIS' | 'NEI' | '';
  avslagsårsak?: OpplæringVurderingDtoAvslagsårsak;
  perioder: {
    resultat?: OpplæringVurderingDtoResultat;
    avslagsårsak?: OpplæringVurderingDtoAvslagsårsak;
    fom: string;
    tom: string;
  }[];
};

const NødvendigOpplæringForm = ({
  vurdering,
  setRedigering,
  redigering,
}: {
  vurdering: OpplæringVurderingDto & { perioder: PeriodType[] };
  setRedigering: (redigering: boolean) => void;
  redigering: boolean;
}) => {
  const { løsAksjonspunkt9302, readOnly } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm<NødvendigOpplæringFormFields>({
    defaultValues: defaultValues(vurdering),
  });

  useEffect(() => {
    formMethods.reset({
      ...defaultValues(vurdering),
    });
  }, [vurdering.perioder]);

  const k9Kodeverkoppslag = useContext(K9KodeverkoppslagContext);

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
      <Form formMethods={formMethods} onSubmit={data => {}}>
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
          {nødvendigOpplæring === 'NEI' && (
            <Controller
              control={formMethods.control}
              name="avslagsårsak"
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
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  legend="Avslagsårsak"
                  readOnly={readOnly}
                  size="small"
                  error={formMethods.formState.errors.avslagsårsak?.message as string | undefined}
                >
                  <Radio value={KodeverdiSomObjektAvslagsårsakKilde.IKKE_NØDVENDIG_OPPLÆRING}>
                    {
                      k9Kodeverkoppslag.k9sak.avslagsårsaker(
                        KodeverdiSomObjektAvslagsårsakKilde.IKKE_NØDVENDIG_OPPLÆRING,
                      ).navn
                    }
                  </Radio>
                  <Radio value={KodeverdiSomObjektAvslagsårsakKilde.IKKE_OPPLÆRING_I_PERIODEN}>
                    {
                      k9Kodeverkoppslag.k9sak.avslagsårsaker(
                        KodeverdiSomObjektAvslagsårsakKilde.IKKE_OPPLÆRING_I_PERIODEN,
                      ).navn
                    }
                  </Radio>
                </RadioGroup>
              )}
            />
          )}
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

const DelvisOpplæring = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: PeriodType[] } }) => {
  const opprinneligPeriode = vurdering.perioder[0]!;
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const readOnly = useContext(SykdomOgOpplæringContext).readOnly;
  const { fields, append, remove, update } = useFieldArray({
    control: formMethods.control,
    name: 'perioder',
  });
  console.log(formMethods.watch('perioder'));
  console.log(fields);

  const opprinneligPeriodeDays = new Period(opprinneligPeriode.fom, opprinneligPeriode.tom).asListOfDays();
  const perioderDays = fields.map(periode => new Period(periode.fom, periode.tom).asListOfDays());
  const uncoveredDays = opprinneligPeriodeDays.filter(day => !perioderDays.some(period => period.includes(day)));
  const uncoveredPeriods = combineConsecutivePeriods(uncoveredDays);

  console.log(uncoveredPeriods);
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
                <Datepicker
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
                <Datepicker
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
                resultat: undefined,
                avslagsårsak: undefined,
              });
            }}
          >
            Legg til ny periode
          </Button>
          <div>
            {`Hva vil du gjøre med dagene ${uncoveredPeriods.map(period => formatPeriod(period.fom, period.tom)).join(', ')}?`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NødvendigOpplæringForm;
