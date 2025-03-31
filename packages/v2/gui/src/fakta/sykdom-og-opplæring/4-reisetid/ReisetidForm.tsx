import type { ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import { Period } from '@navikt/ft-utils';
import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { useContext } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import PeriodePicker from '../../../shared/periode-picker/PeriodePicker';
import dayjs from 'dayjs';
import { useVurdertReisetid } from '../SykdomOgOpplæringQueries';
import OppgittReisetid from './OppgittReisetid';
import { resultatTilJaNei } from './utils';
interface ReisetidFormProps {
  vurdering: ReisetidVurderingDto & { perioder: Period[] };
}

const ReisetidForm = ({ vurdering }: ReisetidFormProps) => {
  const { løsAksjonspunkt9303, behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm<{
    begrunnelse: string;
    godkjent: string;
    periode: {
      fom: Date;
      tom: Date;
    };
  }>({
    defaultValues: {
      begrunnelse: vurdering.reisetid.begrunnelse,
      godkjent: resultatTilJaNei(vurdering.reisetid.resultat),
      periode: {
        fom: new Date(vurdering.perioder[0]?.fom as string),
        tom: new Date(vurdering.perioder[0]?.tom as string),
      },
    },
  });
  const oppgittReisedager = vurdering.informasjonFraSøker.reisetidPeriodeOppgittISøknad;
  const vurderingGjelderEnkeltdag = vurdering.perioder[0]?.asListOfDays().length === 1;

  const { refetch: refetchReisetidVurderinger } = useVurdertReisetid(behandlingUuid);

  const submit = formMethods.handleSubmit(data => {
    løsAksjonspunkt9303({
      begrunnelse: data.begrunnelse,
      godkjent: data.godkjent === 'ja',
      periode: {
        fom: dayjs(data.periode.fom).format('YYYY-MM-DD'),
        tom: dayjs(data.periode.tom).format('YYYY-MM-DD'),
      },
    });
    void refetchReisetidVurderinger();
  });

  return (
    <>
      <Form formMethods={formMethods}>
        <div className="flex flex-col gap-6">
          <OppgittReisetid reisedagerOppgittISøknad={oppgittReisedager} />
          <Textarea label="Vurdering" {...formMethods.register('begrunnelse')} />
          <Controller
            name="godkjent"
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup
                legend={vurderingGjelderEnkeltdag ? 'Innvilges reisedag?' : 'Innvilges reisedager?'}
                {...field}
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
              fromFieldName="periode.fom"
              toFieldName="periode.tom"
            />
          )}
          <div>
            <Button variant="primary" onClick={submit}>
              Bekreft og fortsett
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ReisetidForm;
