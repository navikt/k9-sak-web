import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Button } from '@navikt/ds-react';
import { Period } from '@fpsak-frontend/utils';
import { useContext, useState } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useLangvarigSykVurderingerFagsak } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../SykdomOgOpplæringIndex';
import SykdomUperiodisertForm, { type UperiodisertSykdom } from './SykdomUperiodisertForm';

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
  }));

  const [valgtPeriode, setValgtPeriode] = useState<Vurderingselement | null>(null);
  const [valgtVurdering, setValgtVurdering] = useState<UperiodisertSykdom | null>(null);

  const nyVurdering = () => {
    setValgtPeriode(null);
    setValgtVurdering({
      diagnosekoder: [],
      begrunnelse: '',
      godkjent: undefined,
    });
  };

  const velgPeriode = (periode: Vurderingselement) => {
    setValgtPeriode(periode);
    setValgtVurdering(null);
  };

  const faktiskValgtVurdering =
    valgtVurdering || mappedVurderinger?.find(vurdering => vurdering.uuid === valgtPeriode?.id);

  return (
    <>
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon
              perioderTilVurdering={vurderingsliste || []}
              vurdertePerioder={[]}
              onPeriodeClick={velgPeriode}
            />
            <Button variant="tertiary" icon={<PlusIcon />} onClick={nyVurdering}>
              Legg til ny sykdomsvurdering
            </Button>
          </>
        )}
        showDetailSection={!!valgtVurdering || !!valgtPeriode}
        detailSection={() => faktiskValgtVurdering && <SykdomUperiodisertForm vurdering={faktiskValgtVurdering} />}
      />
    </>
  );
};

export default VurderSykdomUperiodisert;
