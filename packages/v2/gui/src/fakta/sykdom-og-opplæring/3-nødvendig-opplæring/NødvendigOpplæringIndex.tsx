import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { useVurdertOpplæring } from '../SykdomOgOpplæringQueries';
import { useContext, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import NødvendigOpplæringContainer from './NødvendigOpplæringContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { CenteredLoader } from '../CenteredLoader';
import { Alert, Button } from '@navikt/ds-react';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils';

interface OpplæringVurderingselement extends Omit<Vurderingselement, 'resultat'>, OpplæringVurderingDto {
  perioder: Period[];
}

const NødvendigOpplæring = () => {
  const { behandlingUuid, readOnly, løsAksjonspunkt9302, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const { data: vurdertOpplæring, isLoading: isLoadingVurdertOpplæring } = useVurdertOpplæring(behandlingUuid);
  const [valgtVurdering, setValgtVurdering] = useState<OpplæringVurderingselement | null>(null);
  const vurderingsliste = vurdertOpplæring?.vurderinger.map(vurdering => ({
    ...vurdering,
    perioder: [new Period(vurdering.opplæring.fom, vurdering.opplæring.tom)],
  }));
  const aksjonspunkt9302 = aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9302');
  const alleVurderingerFerdigVurdert = vurderingsliste?.every(
    vurdering => vurdering.resultat !== OpplæringVurderingDtoResultat.MÅ_VURDERES,
  );
  const løsAksjonspunktUtenEndringer = () => {
    if (!vurderingsliste) return;
    løsAksjonspunkt9302({
      perioder: vurderingsliste?.map(vurdering => ({
        periode: {
          fom: vurdering.opplæring.fom,
          tom: vurdering.opplæring.tom,
        },
        begrunnelse: vurdering.begrunnelse || null,
        resultat: vurdering.resultat,
        avslagsårsak: vurdering.avslagsårsak,
      })),
    });
  };

  if (isLoadingVurdertOpplæring) {
    return <CenteredLoader />;
  }
  return (
    <div>
      {valgtVurdering?.resultat === OpplæringVurderingDtoResultat.MÅ_VURDERES && !readOnly && (
        <Alert className="mb-4" variant="warning" size="small">
          Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandlet barnet.
        </Alert>
      )}
      {isAksjonspunktOpen(aksjonspunkt9302?.status.kode) && alleVurderingerFerdigVurdert && !readOnly && (
        <Alert className="mb-4 p-4" variant="info" size="small">
          <div className="flex flex-col gap-2">
            <span>Dokumentasjon og nødvendig opplæring er ferdig vurdert og du kan gå videre i behandlingen.</span>
            <div>
              <Button variant="secondary" size="small" onClick={løsAksjonspunktUtenEndringer}>
                Bekreft og fortsett
              </Button>
            </div>
          </div>
        </Alert>
      )}
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon<OpplæringVurderingselement>
              perioder={vurderingsliste || []}
              onPeriodeClick={setValgtVurdering}
              valgtPeriode={valgtVurdering}
            />
          </>
        )}
        showDetailSection
        detailSection={() => (valgtVurdering ? <NødvendigOpplæringContainer vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default NødvendigOpplæring;
