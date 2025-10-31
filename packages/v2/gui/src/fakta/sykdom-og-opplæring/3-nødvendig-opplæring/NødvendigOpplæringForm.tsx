import {
  k9_kodeverk_vilkår_Avslagsårsak as OpplæringVurderingDtoAvslagsårsak,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  Alert,
  BodyShort,
  Button,
  Checkbox,
  Detail,
  ErrorMessage,
  Heading,
  Label,
  Link,
  List,
  Radio,
  RadioGroup,
  ReadMore,
  Textarea,
} from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';
import { RhfForm } from '@navikt/ft-form-hooks';
import { Period } from '@navikt/ft-utils';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Periodevisning } from '../../../shared/detailView/DetailView.js';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import type { nødvendigOpplæringPayload } from '../FaktaSykdomOgOpplæringIndex.js';
import { Avslagsårsak } from './components/Avslagsårsak';
import { DelvisOpplæring } from './components/DelvisOpplæring';
import InstitusjonOgSykdomInfo from './components/InstitusjonOgSykdomInfo.js';

const JA = 'JA' as const;
const DELVIS = 'DELVIS' as const;
const NEI = 'NEI' as const;
const VURDERES_SOM_REISETID = 'VURDERES_SOM_REISETID' as const;

type NødvendigOpplæringFormFields = {
  begrunnelse: string;
  resultat: OpplæringVurderingDtoResultat | '';
  harLegeerklæring: 'JA' | 'NEI' | '';
  harNødvendigOpplæring: 'JA' | 'DELVIS' | 'NEI' | 'VURDERES_SOM_REISETID' | '';
  avslagsårsak?: OpplæringVurderingDtoAvslagsårsak;
  perioder: {
    resultat: OpplæringVurderingDtoResultat | '';
    avslagsårsak: OpplæringVurderingDtoAvslagsårsak | '';
    fom: string;
    tom: string;
  }[];
  tilleggsPerioder: {
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

const utledHarLegeerklæring = (resultat: OpplæringVurderingDtoResultat): 'JA' | 'NEI' | '' => {
  if (resultat === OpplæringVurderingDtoResultat.IKKE_DOKUMENTERT) {
    return NEI;
  }
  if (resultat === OpplæringVurderingDtoResultat.MÅ_VURDERES) {
    return '';
  }
  return JA;
};

const utledNødvendigOpplæring = (
  resultat: OpplæringVurderingDtoResultat,
): 'JA' | 'DELVIS' | 'NEI' | 'VURDERES_SOM_REISETID' | '' => {
  if (resultat === OpplæringVurderingDtoResultat.GODKJENT) {
    return JA;
  }
  if (resultat === OpplæringVurderingDtoResultat.IKKE_GODKJENT) {
    return NEI;
  }

  if (resultat === OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID) {
    return VURDERES_SOM_REISETID;
  }

  return '';
};

const nødvendigOpplæringTilResultat = (nødvendigOpplæring: 'JA' | 'DELVIS' | 'NEI' | 'VURDERES_SOM_REISETID' | '') => {
  if (nødvendigOpplæring === JA) {
    return OpplæringVurderingDtoResultat.GODKJENT;
  }
  if (nødvendigOpplæring === DELVIS) {
    return OpplæringVurderingDtoResultat.GODKJENT;
  }
  if (nødvendigOpplæring === NEI) {
    return OpplæringVurderingDtoResultat.IKKE_GODKJENT;
  }
  if (nødvendigOpplæring === VURDERES_SOM_REISETID) {
    return OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID;
  }
  return '';
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
    tilleggsPerioder: [],
    perioderUtenNødvendigOpplæring: [],
  };
};

const onSubmit = (data: NødvendigOpplæringFormFields) => {
  const resultat =
    data.harLegeerklæring === 'NEI'
      ? OpplæringVurderingDtoResultat.IKKE_DOKUMENTERT
      : nødvendigOpplæringTilResultat(data.harNødvendigOpplæring);
  const perioder = data.perioder.map(periode => ({
    begrunnelse: data.begrunnelse || null,
    resultat: resultat,
    avslagsårsak: data.avslagsårsak || null,
    periode: {
      fom: dayjs(periode.fom).format('YYYY-MM-DD'),
      tom: dayjs(periode.tom).format('YYYY-MM-DD'),
    },
  }));

  const tilleggsPerioder = data.tilleggsPerioder.map(periode => ({
    begrunnelse: data.begrunnelse || null,
    resultat: resultat,
    avslagsårsak: data.avslagsårsak || null,
    periode: {
      fom: dayjs(periode.fom).format('YYYY-MM-DD'),
      tom: dayjs(periode.tom).format('YYYY-MM-DD'),
    },
  }));

  const perioderUtenNødvendigOpplæring = data.perioderUtenNødvendigOpplæring.map(periode => ({
    begrunnelse: data.begrunnelse || null,
    resultat: periode.resultat,
    avslagsårsak: periode.avslagsårsak || null,
    periode: {
      fom: dayjs(periode.fom).format('YYYY-MM-DD'),
      tom: dayjs(periode.tom).format('YYYY-MM-DD'),
    },
  }));

  return {
    perioder: [...perioder, ...tilleggsPerioder, ...perioderUtenNødvendigOpplæring],
  };
};

const NødvendigOpplæringForm = ({
  vurdering,
  setRedigerer,
  redigerer,
  andrePerioderTilVurdering,
}: {
  vurdering: OpplæringVurderingDto & { perioder: Period[] };
  setRedigerer: (redigerer: boolean) => void;
  redigerer: boolean;
  andrePerioderTilVurdering: { fom: string; tom: string }[];
}) => {
  const { readOnly, løsAksjonspunkt9302 } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm<NødvendigOpplæringFormFields>({
    defaultValues: defaultValues(vurdering),
  });
  const [brukVurderingIAndrePerioder, setBrukVurderingIAndrePerioder] = useState(false);

  useEffect(() => {
    formMethods.reset({
      ...defaultValues(vurdering),
    });
  }, [formMethods, vurdering]);

  const harNødvendigOpplæring = formMethods.watch('harNødvendigOpplæring');
  const harLegeerklæring = formMethods.watch('harLegeerklæring');
  const opplæringIkkeDokumentertMedLegeerklæring = harLegeerklæring === 'NEI';

  const { control } = formMethods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tilleggsPerioder',
  });

  useEffect(() => {
    if (opplæringIkkeDokumentertMedLegeerklæring) {
      formMethods.setValue('begrunnelse', '');
      formMethods.setValue('harNødvendigOpplæring', '');
    }
  }, [opplæringIkkeDokumentertMedLegeerklæring, formMethods]);

  useEffect(() => {
    formMethods.setValue('perioderUtenNødvendigOpplæring', []);
    formMethods.resetField('perioder', { keepTouched: true });
  }, [harNødvendigOpplæring, harLegeerklæring, formMethods]);

  const nødvendigOpplæring = formMethods.watch('harNødvendigOpplæring');
  const periodeErEnkeltdag = vurdering.perioder[0]!.fom === vurdering.perioder[0]!.tom;
  return (
    <>
      <RhfForm
        formMethods={formMethods}
        onSubmit={data => løsAksjonspunkt9302(onSubmit(data) as nødvendigOpplæringPayload)}
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
                description={
                  <Detail>
                    Legeerklæringen skal dokumentere om opplæringen er nødvendig for at søker skal kunne ta seg av og
                    behandle barnet.
                  </Detail>
                }
                error={formMethods.formState.errors.harLegeerklæring?.message}
              >
                <Radio value={JA}>Ja</Radio>
                <Radio value={NEI}>Nei</Radio>
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
            <div className="border-none bg-ax-border-neutral-subtle h-[2px]" />
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
              error={formMethods.formState.errors.begrunnelse?.message}
              disabled={opplæringIkkeDokumentertMedLegeerklæring}
              description={
                <ReadMore header="Hva skal vurderingen inneholde?" size="small">
                  <BodyShort size="small">
                    Du skal ta utgangspunkt i{' '}
                    <Link target="_blank" href="https://lovdata.no/pro/lov/1997-02-28-19/§9-14">
                      lovteksten
                    </Link>{' '}
                    og{' '}
                    <Link target="_blank" href="https://lovdata.no/pro/NAV/rundskriv/r09-00/KAPITTEL_4-5">
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
                      <ListItem className="!mb-0">
                        Om opplæringen er nødvendig på grunn av barnets sykdom og behov for pleie og omsorg
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
            render={({ field }) => {
              return (
                <RadioGroup
                  legend="Har søker opplæring som er nødvendig?"
                  {...field}
                  readOnly={readOnly}
                  size="small"
                  error={formMethods.formState.errors.harNødvendigOpplæring?.message}
                >
                  <Radio value={JA}>Ja</Radio>
                  {!periodeErEnkeltdag && <Radio value={DELVIS}>Deler av perioden</Radio>}
                  <Radio value={NEI}>Nei</Radio>
                </RadioGroup>
              );
            }}
          />
          {nødvendigOpplæring === DELVIS && <DelvisOpplæring vurdering={vurdering} />}
          {nødvendigOpplæring === NEI && <Avslagsårsak name="avslagsårsak" />}
          {opplæringIkkeDokumentertMedLegeerklæring && (
            <Alert variant="info" size="small">
              Behandlingen vil gå videre til avslag for manglende dokumentasjon av nødvendig opplæring etter{' '}
              <Lovreferanse>§9-14</Lovreferanse> og <Lovreferanse>§22-3</Lovreferanse>. Før du kan avslå må du etterlyse
              dokumentasjon fra bruker.
            </Alert>
          )}
          {/* Hidden validation for tilleggsPerioder when checkbox is checked */}
          <Controller
            control={formMethods.control}
            name="tilleggsPerioder"
            rules={{
              validate: () => {
                if (brukVurderingIAndrePerioder && fields.length === 0) {
                  return 'Du må velge minst én periode når du velger å gjenbruke vurderingen';
                }
                return undefined;
              },
            }}
            render={() => <></>}
          />
          {andrePerioderTilVurdering.length > 0 && (
            <Checkbox
              size="small"
              checked={brukVurderingIAndrePerioder}
              onChange={() => {
                if (brukVurderingIAndrePerioder) {
                  setBrukVurderingIAndrePerioder(false);
                  formMethods.setValue('tilleggsPerioder', []);
                  formMethods.clearErrors('tilleggsPerioder');
                } else {
                  setBrukVurderingIAndrePerioder(true);
                }
              }}
            >
              Bruk denne vurderingen for andre perioder
            </Checkbox>
          )}
          {brukVurderingIAndrePerioder && (
            <div>
              <Label size="small">I hvilke perioder vil du gjenbruke vurderingen?</Label>
              {andrePerioderTilVurdering.map((periode, index) => {
                const fieldIdx = fields.findIndex(f => f.fom === periode.fom && f.tom === periode.tom);
                return (
                  <Checkbox
                    key={index}
                    size="small"
                    checked={fieldIdx !== -1}
                    onChange={() => {
                      if (fieldIdx === -1) {
                        append({ fom: periode.fom, tom: periode.tom });
                      } else {
                        remove(fieldIdx);
                      }
                      // Trigger validation after change
                      formMethods.trigger('tilleggsPerioder');
                    }}
                  >
                    {`${dayjs(periode.fom).format('DD.MM.YYYY')} - ${dayjs(periode.tom).format('DD.MM.YYYY')}`}
                  </Checkbox>
                );
              })}
              {formMethods.formState.errors.tilleggsPerioder && (
                <ErrorMessage size="small">{formMethods.formState.errors.tilleggsPerioder.message}</ErrorMessage>
              )}
            </div>
          )}
          {!readOnly && (
            <div className="flex gap-4">
              <Button variant="primary" type="submit" size="small">
                Bekreft og fortsett
              </Button>
              {redigerer && (
                <Button variant="secondary" type="button" onClick={() => setRedigerer(false)} size="small">
                  Avbryt redigering
                </Button>
              )}
            </div>
          )}
        </div>
      </RhfForm>
    </>
  );
};

export default NødvendigOpplæringForm;
