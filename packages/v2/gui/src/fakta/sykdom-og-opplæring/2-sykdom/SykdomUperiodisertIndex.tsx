import Vurderingsnavigasjon, {
  Resultat,
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Alert, BodyLong, Button, Radio, RadioGroup } from '@navikt/ds-react';
import { Period } from '@fpsak-frontend/utils';
import { createContext, useContext, useState } from 'react';
import { PencilIcon, PlusIcon } from '@navikt/aksel-icons';
import { useLangvarigSykVurderingerFagsak } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import type { LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import SykdomUperiodisertFormContainer from './SykdomUperiodisertFormContainer';
import { NavigationWithDetailView } from '../../../shared/NavigationWithDetailView/NavigationWithDetailView';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
const utledResultat = (element: LangvarigSykdomVurderingDto) => {
  if (element.godkjent) {
    return Resultat.OPPFYLT;
  }
  if (element.godkjent === false) {
    return Resultat.IKKE_OPPFYLT;
  }
  return Resultat.IKKE_VURDERT;
};

export const SykdomUperiodisertContext = createContext<{
  setNyVurdering: (nyVurdering: boolean) => void;
}>({
  setNyVurdering: () => {},
});
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
      <div className="mb-5">
        <BekreftAlert vurderinger={langvarigSykVurderingerFagsak} />
      </div>
      <SykdomUperiodisertContext.Provider value={{ setNyVurdering }}>
        <NavigationWithDetailView
          navigationSection={() => (
            <>
              <Vurderingsnavigasjon
                perioderTilVurdering={vurderingsliste || []}
                vurdertePerioder={[]}
                onPeriodeClick={velgPeriode}
              />
            </>
          )}
          belowNavigationContent={
            <Button variant="tertiary" icon={<PlusIcon />} onClick={handleNyVurdering}>
              Legg til ny sykdomsvurdering
            </Button>
          }
          detailSection={() => {
            if (nyVurdering) {
              return (
                <SykdomUperiodisertFormContainer
                  vurdering={{
                    diagnosekoder: [],
                    begrunnelse: '',
                    godkjent: '',
                  }}
                />
              );
            }
            if (valgtVurdering) {
              return <SykdomUperiodisertFormContainer vurdering={valgtVurdering} />;
            }
            return null;
          }}
        />
      </SykdomUperiodisertContext.Provider>
    </>
  );
};

const BekreftAlert = ({ vurderinger = [] }: { vurderinger?: LangvarigSykdomVurderingDto[] }) => {
  const { løsAksjonspunkt9301, aksjonspunkter, readOnly } = useContext(SykdomOgOpplæringContext);
  const aksjonspunkt9301 = aksjonspunkter.find(
    aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_LANGVARIG_SYK,
  );

  const [redigerVurdering, setRedigerVurdering] = useState<boolean>(false);
  const kanVurdere = (redigerVurdering || aksjonspunkt9301?.status.kode === aksjonspunktStatus.OPPRETTET) && !readOnly;
  const aksjonspunktErLøst = aksjonspunkt9301?.status.kode === aksjonspunktStatus.UTFØRT;
  const form = useForm<{ vurderingUuid: string }>();

  const submit = (data: { vurderingUuid: string }) => {
    const vurdering = vurderinger.find(vurdering => vurdering.uuid === data.vurderingUuid);
    if (vurdering) {
      løsAksjonspunkt9301({
        langvarigsykdomsvurderingUuid: vurdering.uuid,
        begrunnelse: vurdering.begrunnelse,
      });
    }
  };

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
            <BodyLong>
              Det er tidligere vurdert om barnet har en funksjonshemning eller en langvarig sykdom. Bekreft om tidligere
              sykdomsvurdering gjelder for ny periode eller legg til en ny sykdomsvurdering.
            </BodyLong>
            {kanVurdere && (
              <Button variant="primary" className="mt-4" type="submit" size="small">
                Bekreft og fortsett
              </Button>
            )}
          </Alert>
        </Form>
      </>
    );
  }
  if (vurderinger.length > 1) {
    return (
      <Alert variant="warning">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <BodyLong>
              Det er tidligere vurdert om barnet har en funksjonshemning eller en langvarig sykdom. Bekreft om tidligere
              sykdomsvurdering gjelder for ny periode eller legg til en ny sykdomsvurdering.
            </BodyLong>
          </div>
          <Form formMethods={form} onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Controller
                  control={form.control}
                  name="vurderingUuid"
                  rules={{ required: 'Vurdering er påkrevd' }}
                  render={({ field, fieldState }) => (
                    <RadioGroup
                      className="mt-3"
                      legend="Hvilken sykdomsvurdering skal brukes?"
                      disabled={!kanVurdere}
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
                {aksjonspunktErLøst && (
                  <div>
                    <Button
                      className="mt-2"
                      variant={'tertiary'}
                      icon={<PencilIcon />}
                      onClick={() => setRedigerVurdering(!redigerVurdering)}
                      type="button"
                      size="small"
                    >
                      Endre vurdering
                    </Button>
                  </div>
                )}
              </div>
              {kanVurdere && (
                <div>
                  <Button variant="primary" onClick={() => form.handleSubmit(submit)}>
                    Bekreft og fortsett
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </div>
      </Alert>
    );
  }
  return <Alert variant="warning">Vurder om barnet har en funksjonshemning eller en langvarig sykdom.</Alert>;
};

export default VurderSykdomUperiodisert;
