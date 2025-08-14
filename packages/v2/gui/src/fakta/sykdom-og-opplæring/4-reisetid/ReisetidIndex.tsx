import type {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultatType,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidVurderingDto as ReisetidVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultat } from '@k9-sak-web/backend/k9sak/generated';
import { Period } from '@navikt/ft-utils';
import { useContext, useState } from 'react';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { CenteredLoader } from '../CenteredLoader';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { useVurdertReisetid } from '../SykdomOgOpplæringQueries';
import ReisetidContainer from './ReisetidContainer';
import { Alert, Button } from '@navikt/ds-react';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils';

interface ReisetidVurderingselement extends Omit<Vurderingselement, 'resultat'>, ReisetidVurderingDto {
  perioder: Period[];
  resultat: ReisetidResultatType;
}

const ReisetidIndex = () => {
  const { behandlingUuid, aksjonspunkter, readOnly, løsAksjonspunkt9303 } = useContext(SykdomOgOpplæringContext);
  const { data: vurdertReisetid, isLoading: isLoadingVurdertReisetid } = useVurdertReisetid(behandlingUuid);
  const [valgtVurdering, setValgtVurdering] = useState<ReisetidVurderingselement | null>(null);
  const aksjonspunkt9303 = aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9303');

  const vurderingsliste = vurdertReisetid?.vurderinger.map(vurdering => ({
    ...vurdering,
    resultat: vurdering.reisetid.resultat,
    perioder: [new Period(vurdering.reisetid.periode.fom, vurdering.reisetid.periode.tom)],
  }));

  const alleVurderingerFerdigVurdert = vurderingsliste?.every(
    vurdering => vurdering.resultat !== ReisetidResultat.MÅ_VURDERES,
  );

  const løsAksjonspunktUtenEndringer = () => {
    if (!vurdertReisetid?.vurderinger[0]) return;
    løsAksjonspunkt9303({
      periode: {
        fom: vurdertReisetid.vurderinger[0].reisetid.periode.fom,
        tom: vurdertReisetid.vurderinger[0].reisetid.periode.tom,
      },
      begrunnelse: vurdertReisetid.vurderinger[0].reisetid.begrunnelse,
      godkjent: vurdertReisetid.vurderinger[0].reisetid.resultat === ReisetidResultat.GODKJENT,
    });
  };
  if (isLoadingVurdertReisetid) {
    return <CenteredLoader />;
  }

  return (
    <div>
      {isAksjonspunktOpen(aksjonspunkt9303?.status.kode) && alleVurderingerFerdigVurdert && !readOnly && (
        <Alert variant="info" size="small" className="mb-4 p-4">
          Reisetid er ferdig vurdert og du kan gå videre i behandlingen.
          <div className="mt-2">
            <Button variant="secondary" size="small" onClick={løsAksjonspunktUtenEndringer}>
              Bekreft og fortsett
            </Button>
          </div>
        </Alert>
      )}
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon<ReisetidVurderingselement>
              valgtPeriode={valgtVurdering}
              perioder={vurderingsliste || []}
              onPeriodeClick={setValgtVurdering}
              nyesteFørst={false}
            />
          </>
        )}
        showDetailSection
        detailSection={() => (valgtVurdering ? <ReisetidContainer vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default ReisetidIndex;
