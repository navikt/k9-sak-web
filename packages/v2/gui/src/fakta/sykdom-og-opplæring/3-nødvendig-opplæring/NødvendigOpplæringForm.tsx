import { type OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import type { Period } from '@navikt/ft-utils';
import { BodyShort, Button, Label, Link, List, Radio, RadioGroup, ReadMore, Textarea } from '@navikt/ds-react';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { ListItem } from '@navikt/ds-react/List';
import { useContext } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import dayjs from 'dayjs';
import PeriodePicker from '../../../shared/periode-picker/PeriodePicker';

const booleanToRadioValue = (value: boolean | undefined) => {
  if (value === undefined) return '';
  return value ? 'ja' : 'nei';
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
  const { løsAksjonspunkt9302, readOnly } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm<{
    dokumentertOpplæring: string;
    nødvendigOpplæring: string;
    begrunnelse: string;
    periode?: {
      fom: Date;
      tom: Date;
    };
  }>({
    defaultValues: {
      dokumentertOpplæring: booleanToRadioValue(vurdering.dokumentertOpplæring),
      begrunnelse: vurdering.begrunnelse,
      nødvendigOpplæring: booleanToRadioValue(vurdering.nødvendigOpplæring),
    },
  });

  const nødvendigOpplæring = formMethods.watch('nødvendigOpplæring');
  return (
    <>
      <Form
        formMethods={formMethods}
        onSubmit={data => {
          const nødvendigOpplæring = data.nødvendigOpplæring === 'ja';

          const periode = nødvendigOpplæring ? data.periode : vurdering.opplæring;

          løsAksjonspunkt9302({
            periode: {
              fom: dayjs(periode?.fom).format('YYYY-MM-DD'),
              tom: dayjs(periode?.tom).format('YYYY-MM-DD'),
            },
            begrunnelse: data.begrunnelse,
            nødvendigOpplæring: data.nødvendigOpplæring === 'ja',
            dokumentertOpplæring: data.dokumentertOpplæring === 'ja',
          });
        }}
      >
        <div className="flex flex-col gap-6">
          <Controller
            control={formMethods.control}
            name="dokumentertOpplæring"
            rules={{ validate: value => (value.length > 0 ? undefined : 'Dokumentert opplæring er påkrevd') }}
            render={({ field }) => (
              <RadioGroup
                legend="Er nødvendig opplæring dokumentert med legeerklæring?"
                {...field}
                readOnly={readOnly}
                size="small"
                error={formMethods.formState.errors.dokumentertOpplæring?.message as string | undefined}
              >
                <Radio value="ja">Ja</Radio>
                <Radio value="nei">Nei</Radio>
              </RadioGroup>
            )}
          />
          <div>
            <Label htmlFor="begrunnelse" size="small">
              Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet som følge av
              <Lovreferanse> § 9-14</Lovreferanse>
            </Label>
            <Textarea
              {...formMethods.register('begrunnelse', {
                validate: value => (value.length > 0 ? undefined : 'Begrunnelse er påkrevd'),
              })}
              readOnly={readOnly}
              size="small"
              label=""
              id="begrunnelse"
              error={formMethods.formState.errors.begrunnelse?.message as string | undefined}
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
                  <div className="mt-8">
                    Vurderingen skal beskrive:
                    <List>
                      <ListItem>Om kursinnholdet tilsier at det er opplæring</ListItem>
                      <ListItem>Om det er årsakssammenheng mellom opplæringen og sykdom til barnet</ListItem>
                    </List>
                  </div>
                </ReadMore>
              }
            />
          </div>
          <Controller
            control={formMethods.control}
            name="nødvendigOpplæring"
            rules={{ validate: value => (value.length > 0 ? undefined : 'Nødvendig opplæring er påkrevd') }}
            render={({ field }) => (
              <RadioGroup
                legend="Har søker hatt opplæring som er nødvendig for å kunne ta seg av og behandle barnet?"
                {...field}
                readOnly={readOnly}
                size="small"
                error={formMethods.formState.errors.nødvendigOpplæring?.message as string | undefined}
              >
                <Radio value="ja">Ja</Radio>
                <Radio value="nei">Nei</Radio>
              </RadioGroup>
            )}
          />
          {nødvendigOpplæring === 'ja' && (
            <PeriodePicker
              minDate={new Date(vurdering.opplæring.fom)}
              maxDate={new Date(vurdering.opplæring.tom)}
              size="small"
              fromField={{
                name: 'periode.fom',
                validate: value => {
                  return value && dayjs(value).isValid() ? undefined : 'Fra er påkrevd';
                },
              }}
              toField={{
                name: 'periode.tom',
                validate: value => (value && dayjs(value).isValid() ? undefined : 'Til er påkrevd'),
              }}
              readOnly={readOnly}
            />
          )}
          {/* nødvendigOpplæring === 'nei' && <Avslagårsak vurdering={vurdering} /> */}
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

/* const Avslagårsak = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const formMethods = useFormContext();

  return (
    <Controller
      control={formMethods.control}
      name="avslagårsak"
      render={({ field }) => (
        <RadioGroup legend="Avslagsårsak:" {...field}>
          <Radio value="opplæringen-er-ikke-nødvendig">
            Opplæringen er ikke nødvendig for å kunne ta seg av og behandle barnet
          </Radio>
          <Radio value="kurset-inneholder-ikke-opplæring">Kurset inneholder ikke opplæring</Radio>
          <Radio value="annet">Annet</Radio>
        </RadioGroup>
      )}
    />
  );
}; */

export default NødvendigOpplæringForm;
