import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import Vurderingsnavigasjon, {
  Resultat,
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Alert, Button, Radio, RadioGroup } from '@navikt/ds-react';
import { Period } from '@fpsak-frontend/utils';
import { useContext, useState } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useLangvarigSykVurderingerFagsak } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../SykdomOgOpplæringIndex';
import SykdomUperiodisertForm from './SykdomUperiodisertForm';
import type { LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
const utledResultat = (element: LangvarigSykdomVurderingDto) => {
  if (element.godkjent) {
    return Resultat.OPPFYLT;
  }
  if (element.godkjent === false) {
    return Resultat.IKKE_OPPFYLT;
  }
  return Resultat.IKKE_VURDERT;
};

const VurderSykdomUperiodisert = () => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: langvarigSykVurderingerFagsak } = useLangvarigSykVurderingerFagsak(behandlingUuid);
  const mappedVurderinger = langvarigSykVurderingerFagsak?.map(element => ({
    ...element,
    godkjent: element.godkjent ? ('ja' as const) : ('nei' as const),
  }));
  const vurderingsliste = langvarigSykVurderingerFagsak?.map(element => ({
    ...element,
    perioder: element.vurderingsdato ? [new Period(element.vurderingsdato, element.vurderingsdato)] : [],
    id: element.uuid,
    resultat: utledResultat(element),
  }));

  const [valgtPeriode, setValgtPeriode] = useState<Vurderingselement | null>(null);
  const [nyVurdering, setNyVurdering] = useState<boolean>(false);

  const velgPeriode = (periode: Vurderingselement) => {
    setValgtPeriode(periode);
    setNyVurdering(false);
  };

  const handleNyVurdering = () => {
    setNyVurdering(true);
    setValgtPeriode(null);
  };

  const valgtVurdering = mappedVurderinger?.find(vurdering => vurdering.uuid === valgtPeriode?.id);

  return (
    <>
      <BekreftAlert vurderinger={langvarigSykVurderingerFagsak} />
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon
              perioderTilVurdering={vurderingsliste || []}
              vurdertePerioder={[]}
              onPeriodeClick={velgPeriode}
            />
            <Button variant="tertiary" icon={<PlusIcon />} onClick={handleNyVurdering}>
              Legg til ny sykdomsvurdering
            </Button>
          </>
        )}
        showDetailSection={nyVurdering || !!valgtVurdering}
        detailSection={() =>
          nyVurdering ? (
            <SykdomUperiodisertForm
              vurdering={{
                diagnosekoder: [],
                begrunnelse: '',
                godkjent: '',
              }}
            />
          ) : (
            valgtVurdering && <SykdomUperiodisertForm vurdering={valgtVurdering} />
          )
        }
      />
    </>
  );
};

const BekreftAlert = ({ vurderinger = [] }: { vurderinger?: LangvarigSykdomVurderingDto[] }) => {
  const { løsAksjonspunkt9301 } = useContext(SykdomOgOpplæringContext);
  const form = useForm();
  if (vurderinger.length === 1 && vurderinger[0]) {
    const vurdering = vurderinger[0];
    return (
      <>
        <Form
          formMethods={form}
          onSubmit={() => {
            løsAksjonspunkt9301({ langvarigsykdomsvurderingUuid: vurdering.uuid, begrunnelse: vurdering.begrunnelse });
          }}
        >
          <Alert variant="warning">
            Det er tidligere vurdert om barnet har en funksjonshemning eller en langvarig sykdom. Bekreft om tidligere
            sykdomsvurdering gjelder for ny periode eller legg til en ny sykdomsvurdering.
          </Alert>
          <Button variant="primary" type="submit">
            Bekreft og fortsett
          </Button>
        </Form>
      </>
    );
  }
  if (vurderinger.length > 1) {
    return (
      <Alert variant="warning">
        Det er tidligere vurdert om barnet har en funksjonshemning eller en langvarig sykdom. Bekreft om tidligere
        sykdomsvurdering gjelder for ny periode eller legg til en ny sykdomsvurdering.
        <Form
          formMethods={form}
          onSubmit={() => {
            const vurdering = vurderinger.find(vurdering => vurdering.uuid === form.getValues('vurdering'));
            if (vurdering) {
              løsAksjonspunkt9301({
                langvarigsykdomsvurderingUuid: vurdering.uuid,
                begrunnelse: vurdering.begrunnelse,
              });
            }
          }}
        >
          <div className="flex flex-col gap-2">
            <Controller
              control={form.control}
              name="vurdering"
              rules={{ required: 'Vurdering er påkrevd' }}
              render={({ field, fieldState }) => (
                <RadioGroup
                  className="mt-3"
                  legend="Bekreft om tidligere sykdomsvurdering gjelder for ny periode eller legg til en ny sykdomsvurdering."
                  error={fieldState.error?.message}
                  {...field}
                >
                  {vurderinger.map(vurdering => (
                    <Radio key={vurdering.uuid} value={vurdering.uuid}>
                      {dayjs(vurdering.vurderingsdato).format('DD.MM.YYYY')}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            />
            <div>
              <Button variant="primary" type="submit">
                Bekreft og fortsett
              </Button>
            </div>
          </div>
        </Form>
      </Alert>
    );
  }
  return <Alert variant="warning">Vurder om barnet har en funksjonshemning eller en langvarig sykdom.</Alert>;
};

export default VurderSykdomUperiodisert;
