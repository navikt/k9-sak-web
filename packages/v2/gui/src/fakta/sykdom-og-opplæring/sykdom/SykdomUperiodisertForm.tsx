import type { LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { CalendarIcon } from '@navikt/aksel-icons';
import { DetailView } from '@navikt/ft-plattform-komponenter';
import { Form, TextAreaField } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { Alert, Button, Label, Radio, RadioGroup } from '@navikt/ds-react';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import DiagnosekodeVelger from '../../../shared/diagnosekodeVelger/DiagnosekodeVelger';
import { useContext, useEffect } from 'react';
import { useOpprettSykdomsvurdering } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../SykdomOgOpplæringIndex';

export type UperiodisertSykdom = Pick<LangvarigSykdomVurderingDto, 'diagnosekoder' | 'begrunnelse'> & {
  godkjent: 'ja' | 'nei' | 'mangler_dokumentasjon' | undefined;
  vurderingsdato?: string;
};

const SykdomUperiodisertForm = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { mutate: opprettSykdomsvurdering } = useOpprettSykdomsvurdering();
  const formMethods = useForm({
    defaultValues: {
      diagnosekoder: vurdering.diagnosekoder || [],
      begrunnelse: vurdering.begrunnelse,
      godkjent: vurdering.godkjent,
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
    <>
      <DetailView title="Vurdering av sykdom">
        <div data-testid="Periode" className="flex items-center gap-2">
          {vurdering.vurderingsdato && (
            <>
              <CalendarIcon height={24} width={24} />{' '}
              <span>{dayjs(vurdering.vurderingsdato).format('DD.MM.YYYY')}</span>
            </>
          )}
        </div>
        <div className="border-none bg-border-default h-px mt-4" />
        <div className="mt-6">
          <Form
            formMethods={formMethods}
            onSubmit={data =>
              opprettSykdomsvurdering({
                behandlingUuid,
                diagnoser: data.diagnosekoder,
                begrunnelse: data.begrunnelse,
                godkjent: data.godkjent === 'ja',
              })
            }
          >
            <div className="flex flex-col gap-6">
              <div>
                <Label htmlFor="begrunnelse">
                  Vurder om barnet har en funksjonshemning eller en langvarig sykdom antatt å vare i mer enn ett år som
                  følge av <Lovreferanse>§ 9-14</Lovreferanse>
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
                className="max-w-[320px]"
                disabled={formMethods.watch('godkjent') === 'mangler_dokumentasjon'}
              />
              <div>
                <Button variant="primary">Lagre ny sykdomsvurdering</Button>
              </div>
            </div>
          </Form>
        </div>
      </DetailView>
    </>
  );
};

export default SykdomUperiodisertForm;
