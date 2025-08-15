import { Alert, Button } from '@navikt/ds-react';
import { useContext } from 'react';
import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils';
import { Period } from '@navikt/ft-utils';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

interface OpplæringVurderingselement extends Omit<{ resultat: string }, 'resultat'>, OpplæringVurderingDto {
  perioder: Period[];
}

interface NødvendigOpplæringAlertProps {
  valgtVurdering: OpplæringVurderingselement | null;
  vurderingsliste: OpplæringVurderingselement[] | undefined;
}

const NødvendigOpplæringAlerts = ({ valgtVurdering, vurderingsliste }: NødvendigOpplæringAlertProps) => {
  const { readOnly, løsAksjonspunkt9302, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const aksjonspunkt9302 = aksjonspunkter.find(akspunkt => akspunkt.definisjon === aksjonspunktCodes.VURDER_OPPLÆRING);
  const alleVurderingerFerdigVurdert = vurderingsliste?.every(
    vurdering => vurdering.resultat !== OpplæringVurderingDtoResultat.MÅ_VURDERES,
  );

  const løsAksjonspunktUtenEndringer = (vurderingsliste: OpplæringVurderingselement[]) => {
    if (vurderingsliste.length === 0) return;
    // bruker en vilkårlig vurdering fra listen for å løse aksjonspunktet
    løsAksjonspunkt9302({
      perioder: vurderingsliste.map(vurdering => ({
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

  if (valgtVurdering?.resultat === OpplæringVurderingDtoResultat.MÅ_VURDERES && !readOnly) {
    return (
      <Alert className="mb-4" variant="warning" size="small">
        Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandlet barnet.
      </Alert>
    );
  }

  if (
    isAksjonspunktOpen(aksjonspunkt9302?.status) &&
    alleVurderingerFerdigVurdert &&
    !readOnly &&
    vurderingsliste?.length
  ) {
    return (
      <Alert className="mb-4 p-4" variant="info" size="small">
        <div className="flex flex-col gap-2">
          <span>Dokumentasjon og nødvendig opplæring er ferdig vurdert og du kan gå videre i behandlingen.</span>
          <div>
            <Button variant="secondary" size="small" onClick={() => løsAksjonspunktUtenEndringer(vurderingsliste)}>
              Bekreft og fortsett
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  return null;
};

export default NødvendigOpplæringAlerts;
