import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidDto as ReisetidDto } from '@k9-sak-web/backend/k9sak/generated';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultat } from '@k9-sak-web/backend/k9sak/generated';
import { useContext } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Alert, Button } from '@navikt/ds-react';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils';

interface ReisetidAlertProps {
  vurdertReisetid: ReisetidDto | undefined;
}

const ReisetidAlerts = ({ vurdertReisetid }: ReisetidAlertProps) => {
  const { aksjonspunkter, readOnly, løsAksjonspunkt9303 } = useContext(SykdomOgOpplæringContext);
  const aksjonspunkt9303 = aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9303');
  const førsteVurderingIListen = vurdertReisetid?.vurderinger[0];

  if (!førsteVurderingIListen) return null;

  const alleVurderingerFerdigVurdert = vurdertReisetid.vurderinger.every(
    vurdering => vurdering.reisetid.resultat !== ReisetidResultat.MÅ_VURDERES,
  );

  // Vi tar en vilkårlig vurdering fra listen for å løse aksjonspunktet
  const løsAksjonspunktUtenEndringer = () => {
    if (!førsteVurderingIListen) return;
    løsAksjonspunkt9303({
      periode: {
        fom: førsteVurderingIListen.reisetid.periode.fom,
        tom: førsteVurderingIListen.reisetid.periode.tom,
      },
      begrunnelse: førsteVurderingIListen.reisetid.begrunnelse,
      godkjent: førsteVurderingIListen.reisetid.resultat === ReisetidResultat.GODKJENT,
    });
  };

  if (isAksjonspunktOpen(aksjonspunkt9303?.status.kode) && !readOnly) {
    return (
      <Alert variant="warning" size="small" className="mb-4">
        Vurder reisetid på andre dager enn søker har opplæring.
      </Alert>
    );
  }

  if (
    isAksjonspunktOpen(aksjonspunkt9303?.status.kode) &&
    alleVurderingerFerdigVurdert &&
    !readOnly &&
    førsteVurderingIListen
  ) {
    return (
      <Alert variant="info" size="small" className="mb-4 p-4">
        Reisetid er ferdig vurdert og du kan gå videre i behandlingen.
        <div className="mt-2">
          <Button variant="secondary" size="small" onClick={løsAksjonspunktUtenEndringer}>
            Bekreft og fortsett
          </Button>
        </div>
      </Alert>
    );
  }
  return null;
};

export default ReisetidAlerts;
