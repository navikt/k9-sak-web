import { type OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm, useFormContext } from 'react-hook-form';
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

const NødvendigOpplæringForm = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const { løsAksjonspunkt9302 } = useContext(SykdomOgOpplæringContext);
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
            render={({ field }) => (
              <RadioGroup legend="Er nødvendig opplæring dokumentert med legeerklæring?" {...field}>
                <Radio value="ja">Ja</Radio>
                <Radio value="nei">Nei</Radio>
              </RadioGroup>
            )}
          />
          <div>
            <Label htmlFor="begrunnelse">
              Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet som følge av
              <Lovreferanse> § 9-14</Lovreferanse>
            </Label>
            <Textarea
              {...formMethods.register('begrunnelse')}
              size="small"
              label=""
              id="begrunnelse"
              description={
                <ReadMore header="Hva skal vurderingen inneholde?">
                  <BodyShort>
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
            render={({ field }) => (
              <RadioGroup
                legend="Har søker hatt opplæring som er nødvendig for å kunne ta seg av og behandle barnet?"
                {...field}
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
              fromFieldName="periode.fom"
              toFieldName="periode.tom"
            />
          )}
          {nødvendigOpplæring === 'nei' && <Avslagårsak vurdering={vurdering} />}
          <div>
            <Button variant="primary" type="submit">
              Bekreft og fortsett
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

const Avslagårsak = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
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
};

export default NødvendigOpplæringForm;
