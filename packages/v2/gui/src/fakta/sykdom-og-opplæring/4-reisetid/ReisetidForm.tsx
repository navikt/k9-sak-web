import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidVurderingDto as ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import { Period } from '@navikt/ft-utils';
import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import PeriodePicker from '../../../shared/periode-picker/PeriodePicker';
import dayjs from 'dayjs';
import OppgittReisetid from './OppgittReisetid';
import { resultatTilJaNei } from './utils';
interface ReisetidFormProps {
  vurdering: ReisetidVurderingDto & { perioder: Period[] };
  setRedigering: React.Dispatch<React.SetStateAction<boolean>>;
  redigering: boolean;
}

const defaultValues = (vurdering: ReisetidVurderingDto & { perioder: Period[] }) => {
  return {
    begrunnelse: vurdering.reisetid.begrunnelse,
    godkjent: resultatTilJaNei(vurdering.reisetid.resultat),
    periode: {
      fom: new Date(vurdering.perioder[0]?.fom as string),
      tom: new Date(vurdering.perioder[0]?.tom as string),
    },
  };
};

const ReisetidForm = ({ vurdering, setRedigering, redigering }: ReisetidFormProps) => {
  const { løsAksjonspunkt9303, readOnly } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm<{
    begrunnelse: string;
    godkjent: string;
    periode: {
      fom: Date;
      tom: Date;
    };
  }>({
    defaultValues: defaultValues(vurdering),
  });

  useEffect(() => {
    // reset form til values fra annen vurdering når vi bytter vurdering
    formMethods.reset({
      ...defaultValues(vurdering),
    });
  }, [vurdering.perioder]);
  const oppgittReisedager = vurdering.informasjonFraSøker.reisetidPeriodeOppgittISøknad;
  const vurderingGjelderEnkeltdag = vurdering.perioder[0]?.asListOfDays().length === 1;

  const submit = formMethods.handleSubmit(data => {
    løsAksjonspunkt9303({
      begrunnelse: data.begrunnelse,
      godkjent: data.godkjent === 'ja',
      periode: {
        fom: dayjs(data.periode.fom).format('YYYY-MM-DD'),
        tom: dayjs(data.periode.tom).format('YYYY-MM-DD'),
      },
    });
  });

  return (
    <>
      <Form formMethods={formMethods}>
        <div className="flex flex-col gap-6">
          <OppgittReisetid reisedagerOppgittISøknad={oppgittReisedager} size="small" />
          <Textarea
            label="Vurdering"
            {...formMethods.register('begrunnelse', {
              validate: value => (value?.length > 0 ? undefined : 'Vurdering er påkrevd'),
            })}
            size="small"
            readOnly={readOnly}
            error={formMethods.formState.errors.begrunnelse?.message as string | undefined}
          />
          <Controller
            name="godkjent"
            rules={{ validate: value => (value?.length > 0 ? undefined : 'Vurdering er påkrevd') }}
            render={({ field }) => (
              <RadioGroup
                legend={vurderingGjelderEnkeltdag ? 'Innvilges reisedag?' : 'Innvilges reisedager?'}
                {...field}
                readOnly={readOnly}
                size="small"
                error={formMethods.formState.errors.godkjent?.message as string | undefined}
              >
                <Radio value="ja">Ja</Radio>
                <Radio value="nei">Nei</Radio>
              </RadioGroup>
            )}
          />
          {formMethods.watch('godkjent') === 'ja' && !vurderingGjelderEnkeltdag && (
            <PeriodePicker
              minDate={new Date(vurdering.perioder[0]?.fom as string)}
              maxDate={new Date(vurdering.perioder[0]?.tom as string)}
              size="small"
              fromField={{
                name: 'periode.fom',
                validate: value => (value && dayjs(value).isValid() ? undefined : 'Fra er påkrevd'),
              }}
              toField={{
                name: 'periode.tom',
                validate: value => (value && dayjs(value).isValid() ? undefined : 'Til er påkrevd'),
              }}
              readOnly={readOnly}
            />
          )}
          {!readOnly && (
            <div className="flex gap-4">
              <Button variant="primary" onClick={submit} size="small">
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

export default ReisetidForm;
