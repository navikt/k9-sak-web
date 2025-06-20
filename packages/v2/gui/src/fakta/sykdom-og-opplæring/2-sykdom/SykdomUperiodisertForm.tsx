import {
  type LangvarigSykdomVurderingDto,
  LangvarigSykdomVurderingDtoAvslagsårsak,
} from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, Label, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import DiagnosekodeVelger from '../../../shared/diagnosekodeVelger/DiagnosekodeVelger';
import { useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';

export type UperiodisertSykdom = Pick<LangvarigSykdomVurderingDto, 'diagnosekoder' | 'begrunnelse'> &
  Pick<Partial<LangvarigSykdomVurderingDto>, 'uuid' | 'behandlingUuid' | 'vurdertTidspunkt' | 'vurdertAv'> & {
    godkjent: 'ja' | 'nei' | 'mangler_dokumentasjon' | '';
  };

const finnAvslagsårsak = (godkjent: string) => {
  if (godkjent === 'mangler_dokumentasjon') {
    return LangvarigSykdomVurderingDtoAvslagsårsak.MANGLENDE_DOKUMENTASJON;
  }
  if (godkjent === 'nei') {
    return LangvarigSykdomVurderingDtoAvslagsårsak.IKKE_LANGVARIG_SYK;
  }
  return undefined;
};

const SykdomUperiodisertForm = ({
  vurdering,
  setRedigering,
  redigering,
}: {
  vurdering: UperiodisertSykdom;
  setRedigering: (redigering: boolean) => void;
  redigering: boolean;
}) => {
  const { behandlingUuid, løsAksjonspunkt9301 } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm({
    defaultValues: {
      diagnosekoder: vurdering.diagnosekoder || [],
      begrunnelse: vurdering.begrunnelse || '',
      godkjent: vurdering.godkjent || '',
    },
  });

  useEffect(() => {
    formMethods.setValue('diagnosekoder', vurdering.diagnosekoder || []);
    formMethods.setValue('begrunnelse', vurdering.begrunnelse);
    formMethods.setValue('godkjent', vurdering.godkjent);
  }, [vurdering, formMethods]);

  const godkjent = formMethods.watch('godkjent');
  useEffect(() => {
    if (godkjent === 'mangler_dokumentasjon') {
      formMethods.setValue('diagnosekoder', []);
    }
  }, [godkjent, formMethods]);

  if (!vurdering) {
    return null;
  }

  return (
    <Form
      formMethods={formMethods}
      onSubmit={data => {
        return vurdering.uuid
          ? løsAksjonspunkt9301(vurdering.uuid, {
              behandlingUuid,
              diagnoser: data.diagnosekoder,
              begrunnelse: data.begrunnelse,
              godkjent: data.godkjent === 'ja',
              avslagsårsak: data.godkjent !== 'ja' ? finnAvslagsårsak(data.godkjent) : undefined,
            })
          : løsAksjonspunkt9301(undefined, {
              behandlingUuid,
              diagnoser: data.diagnosekoder,
              begrunnelse: data.begrunnelse,
              godkjent: data.godkjent === 'ja',
              avslagsårsak: data.godkjent !== 'ja' ? finnAvslagsårsak(data.godkjent) : undefined,
            });
      }}
    >
      <div className="flex flex-col gap-6">
        <div>
          <Label htmlFor="begrunnelse" size="small">
            Vurder om barnet har en funksjonshemning eller en langvarig sykdom antatt å vare i mer enn ett år som følge
            av <Lovreferanse>§ 9-14</Lovreferanse>
          </Label>
          <Textarea
            {...formMethods.register('begrunnelse', {
              validate: value => (value.length > 0 ? undefined : 'Begrunnelse er påkrevd'),
            })}
            size="small"
            label=""
            id="begrunnelse"
            error={formMethods.formState.errors.begrunnelse?.message as string | undefined}
          />
        </div>
        <Controller
          control={formMethods.control}
          name="godkjent"
          rules={{ validate: value => (value.length > 0 ? undefined : 'Vurdering er påkrevd') }}
          render={({ field }) => (
            <RadioGroup
              {...field}
              legend="Har barnet en langvarig funksjonshemming eller langvarig sykdom?"
              size="small"
              error={formMethods.formState.errors.godkjent?.message as string | undefined}
            >
              <Radio value="ja">Ja</Radio>
              <Radio value="nei">Nei</Radio>
              <Radio value="mangler_dokumentasjon">Mangler dokumentasjon</Radio>
            </RadioGroup>
          )}
        />
        <DiagnosekodeVelger
          label="Hvilke diagnoser har barnet?"
          description="Her kan du legge inn én eller flere diagnoser."
          name="diagnosekoder"
          size="small"
          disabled={
            formMethods.watch('godkjent') === 'mangler_dokumentasjon' || formMethods.watch('godkjent') === 'nei'
          }
        />
        {formMethods.watch('godkjent') === 'mangler_dokumentasjon' && (
          <Alert variant="info" size="small">
            Behandlingen vil gå videre til avslag for manglende dokumentasjon på sykdom etter
            <Lovreferanse>§ 9-14</Lovreferanse> og <Lovreferanse>§ 22-3</Lovreferanse>.
          </Alert>
        )}
        <div className="flex gap-4">
          <Button variant="primary" type="submit" size="small">
            {vurdering.uuid ? 'Oppdater og benytt vurdering' : 'Lagre og benytt vurdering'}
          </Button>
          {redigering && (
            <div>
              <Button variant="secondary" type="button" onClick={() => setRedigering(false)} size="small">
                Avbryt redigering
              </Button>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default SykdomUperiodisertForm;
