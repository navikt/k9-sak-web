import { DetailView } from '@navikt/ft-plattform-komponenter';
import { type OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useController, useForm, useFormContext } from 'react-hook-form';
import { CalendarIcon } from '@navikt/aksel-icons';
import type { Period } from '@navikt/ft-utils';
import {
  BodyShort,
  Button,
  DatePicker,
  HStack,
  Label,
  Link,
  List,
  Radio,
  RadioGroup,
  ReadMore,
  Textarea,
  useRangeDatepicker,
} from '@navikt/ds-react';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { ListItem } from '@navikt/ds-react/List';
import { useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import dayjs from 'dayjs';

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

  return (
    <>
      <DetailView title="Nødvendig opplæring">
        <div data-testid="Periode" className="flex items-center gap-2">
          {vurdering.perioder.length > 0 && (
            <>
              <CalendarIcon height={24} width={24} />{' '}
              <span>{vurdering.perioder.map(p => p.prettifyPeriod()).join(', ')}</span>
            </>
          )}
        </div>
        <div className="border-none bg-border-default h-px mt-4" />
        <div className="mt-6">
          <Form
            formMethods={formMethods}
            onSubmit={data => {
              løsAksjonspunkt9302({
                periode: {
                  fom: dayjs(data.periode?.fom).format('YYYY-MM-DD'),
                  tom: dayjs(data.periode?.tom).format('YYYY-MM-DD'),
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
              {formMethods.watch('nødvendigOpplæring') === 'ja' && (
                <PeriodePicker
                  minDate={new Date(vurdering.opplæring.fom)}
                  maxDate={new Date(vurdering.opplæring.tom)}
                />
              )}
              <div>
                <Button variant="primary" type="submit">
                  Bekreft og fortsett
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </DetailView>
    </>
  );
};

const PeriodePicker = ({ minDate, maxDate }: { minDate: Date; maxDate: Date }) => {
  const formMethods = useFormContext();

  const fomMethods = useController({
    control: formMethods.control,
    name: 'periode.fom',
    defaultValue: new Date(minDate),
  });
  const tomMethods = useController({
    control: formMethods.control,
    name: 'periode.tom',
    defaultValue: new Date(maxDate),
  });
  useEffect(() => {
    return () => {
      formMethods.unregister('periode');
    };
  }, []);

  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    fromDate: minDate,
    toDate: maxDate,
    defaultSelected: {
      from: new Date(fomMethods.field.value),
      to: new Date(tomMethods.field.value),
    },
    today: minDate,
    onRangeChange: val => {
      fomMethods.field.onChange(val?.from);
      tomMethods.field.onChange(val?.to);
    },
  });

  return (
    <DatePicker {...datepickerProps}>
      <HStack wrap gap="4" justify="center">
        <DatePicker.Input {...fromInputProps} label="Fra" />
        <DatePicker.Input {...toInputProps} label="Til" />
      </HStack>
    </DatePicker>
  );
};

export default NødvendigOpplæringForm;
