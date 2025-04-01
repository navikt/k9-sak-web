import {
  type LangvarigSykdomVurderingDto,
  LangvarigSykdomVurderingDtoAvslagsårsak,
} from '@k9-sak-web/backend/k9sak/generated';
import { Form, TextAreaField } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, Label, Radio, RadioGroup } from '@navikt/ds-react';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import DiagnosekodeVelger from '../../../shared/diagnosekodeVelger/DiagnosekodeVelger';
import { useContext, useEffect } from 'react';
import { useOppdaterSykdomsvurdering, useOpprettSykdomsvurdering } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { useQueryClient } from '@tanstack/react-query';
import { SykdomUperiodisertContext } from './SykdomUperiodisertIndex';
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
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { setNyVurdering } = useContext(SykdomUperiodisertContext);
  const queryClient = useQueryClient();
  const { mutate: opprettSykdomsvurdering } = useOpprettSykdomsvurdering({
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['langvarigSykVurderingerFagsak', behandlingUuid] });
      setNyVurdering(false);
    },
  });
  const { mutate: oppdaterSykdomsvurdering } = useOppdaterSykdomsvurdering({
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['langvarigSykVurderingerFagsak', behandlingUuid] });
      setRedigering(false);
    },
  });
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
          ? oppdaterSykdomsvurdering({
              behandlingUuid,
              diagnoser: data.diagnosekoder,
              begrunnelse: data.begrunnelse,
              godkjent: data.godkjent === 'ja',
              uuid: vurdering.uuid,
              avslagsårsak: data.godkjent !== 'ja' ? finnAvslagsårsak(data.godkjent) : undefined,
            })
          : opprettSykdomsvurdering({
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
          <Label htmlFor="begrunnelse">
            Vurder om barnet har en funksjonshemning eller en langvarig sykdom antatt å vare i mer enn ett år som følge
            av <Lovreferanse>§ 9-14</Lovreferanse>
          </Label>
          <TextAreaField label="" name="begrunnelse" id="begrunnelse" />
        </div>
        <Controller
          control={formMethods.control}
          name="godkjent"
          render={({ field }) => (
            <RadioGroup {...field} legend="Har barnet en langvarig funksjonshemming eller langvarig sykdom?">
              <Radio value="ja">Ja</Radio>
              <Radio value="nei">Nei</Radio>
              <Radio value="mangler_dokumentasjon">Mangler dokumentasjon</Radio>
            </RadioGroup>
          )}
        />
        {formMethods.watch('godkjent') === 'mangler_dokumentasjon' && (
          <Alert variant="info">
            Behandlingen vil gå videre til avslag for manglende dokumentasjon på sykdom etter
            <Lovreferanse>§ 9-14</Lovreferanse> og <Lovreferanse>§ 22-3</Lovreferanse>.
          </Alert>
        )}
        <DiagnosekodeVelger
          label="Legg til diagnose(r)"
          name="diagnosekoder"
          onChange={diagnosekoder => {
            formMethods.setValue('diagnosekoder', diagnosekoder);
          }}
          value={formMethods.watch('diagnosekoder')}
          size="medium"
          disabled={formMethods.watch('godkjent') === 'mangler_dokumentasjon'}
        />
        <div className="flex gap-4">
          <Button variant="primary" type="submit" size="small">
            {vurdering.uuid ? 'Oppdater sykdomsvurdering' : 'Lagre ny sykdomsvurdering'}
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
