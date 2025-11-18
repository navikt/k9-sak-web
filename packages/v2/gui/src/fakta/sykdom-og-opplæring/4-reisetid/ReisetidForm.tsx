import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidVurderingDto as ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Button, Link, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { Period } from '@navikt/ft-utils';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PeriodePicker from '../../../shared/periode-picker/PeriodePicker';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import OppgittReisetid from './OppgittReisetid';
import { resultatTilJaNei } from './utils';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktErUtført } from '../../../utils/aksjonspunktUtils';
interface ReisetidFormProps {
  vurdering: ReisetidVurderingDto & { perioder: Period[] };
  setRedigerer: React.Dispatch<React.SetStateAction<boolean>>;
  redigerer: boolean;
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

const ReisetidForm = ({ vurdering, setRedigerer, redigerer }: ReisetidFormProps) => {
  const { løsAksjonspunkt9303, readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);

  const harLøstNødvendigOpplæring = aksjonspunktErUtført(aksjonspunkter, aksjonspunktCodes.VURDER_OPPLÆRING);
  const lesemodus = readOnly || !harLøstNødvendigOpplæring;
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
        fom:
          data.godkjent === 'ja'
            ? dayjs(data.periode.fom).format('YYYY-MM-DD')
            : (vurdering.perioder[0]?.fom as string),
        tom:
          data.godkjent === 'ja'
            ? dayjs(data.periode.tom).format('YYYY-MM-DD')
            : (vurdering.perioder[0]?.tom as string),
      },
    });
  });

  return (
    <>
      <RhfForm formMethods={formMethods}>
        <div className="flex flex-col gap-6">
          <OppgittReisetid reisedagerOppgittISøknad={oppgittReisedager} size="small" />
          <Textarea
            label="Vurder om det er nødvendig å reise en annen dag enn kursdagene"
            {...formMethods.register('begrunnelse', {
              validate: value => (value?.length > 0 ? undefined : 'Vurdering er påkrevd'),
            })}
            size="small"
            disabled={lesemodus}
            description={
              <div>
                Ta utgangspunkt i{' '}
                <Link target="_blank" href="https://lovdata.no/pro/lov/1997-02-28-19/§9-14">
                  lovtekst
                </Link>{' '}
                og{' '}
                <Link target="_blank" href="https://lovdata.no/pro/NAV/rundskriv/r09-00/KAPITTEL_4-5">
                  rundskriv
                </Link>{' '}
                til §9-14
              </div>
            }
            error={formMethods.formState.errors.begrunnelse?.message as string | undefined}
          />
          <Controller
            name="godkjent"
            rules={{ validate: value => (value?.length > 0 ? undefined : 'Vurdering er påkrevd') }}
            disabled={!harLøstNødvendigOpplæring}
            render={({ field }) => (
              <RadioGroup
                legend={vurderingGjelderEnkeltdag ? 'Innvilges reisedag?' : 'Innvilges reisedager?'}
                {...field}
                readOnly={lesemodus}
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
              readOnly={lesemodus}
            />
          )}
          {!lesemodus && (
            <div className="flex gap-4">
              <Button variant="primary" onClick={submit} size="small">
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

export default ReisetidForm;
