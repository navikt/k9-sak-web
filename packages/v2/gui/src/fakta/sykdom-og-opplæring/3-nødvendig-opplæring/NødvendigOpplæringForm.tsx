import {
  OpplæringVurderingDtoAvslagsårsak,
  OpplæringVurderingDtoResultat,
  type OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import { Period } from '@navikt/ft-utils';
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
import { Periodevisning } from '../../../shared/detailView/DetailView.js';
import InstitusjonOgSykdomInfo from './components/InstitusjonOgSykdomInfo.js';
import type { nødvendigOpplæringPayload } from '../FaktaSykdomOgOpplæringIndex.js';
import { DelvisOpplæring } from './components/DelvisOpplæring';
import { Avslagsårsak } from './components/Avslagsårsak';

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
  return 'JA';
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
    perioderUtenNødvendigOpplæring: [],
  };
};

const onSubmit = (data: NødvendigOpplæringFormFields) => {
  const perioder = data.perioder.map(periode => ({
    begrunnelse: data.begrunnelse,
    resultat: nødvendigOpplæringTilResultat(data.harNødvendigOpplæring),
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

  return {
    perioder: [...perioder, ...perioderUtenNødvendigOpplæring],
  };
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
    }
  }, [opplæringIkkeDokumentertMedLegeerklæring, formMethods]);

  const nødvendigOpplæring = formMethods.watch('harNødvendigOpplæring');
  const periodeErEnkeltdag = vurdering.perioder[0]!.fom === vurdering.perioder[0]!.tom;
  return (
    <>
      <Form
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
              error={formMethods.formState.errors.begrunnelse?.message}
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
                  {periodeErEnkeltdag ? (
                    <Radio value={VURDERES_SOM_REISETID}>Vurderes som reisetid</Radio>
                  ) : (
                    <Radio value={DELVIS}>Deler av perioden</Radio>
                  )}
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

export default NødvendigOpplæringForm;
