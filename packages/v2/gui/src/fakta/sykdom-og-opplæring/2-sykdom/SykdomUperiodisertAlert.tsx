import { Alert, Button } from '@navikt/ds-react';
import { useContext } from 'react';
import {
  type k9_sak_kontrakt_opplæringspenger_langvarigsykdom_LangvarigSykdomVurderingDto as LangvarigSykdomVurderingDto,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_sykdom_ValgtLangvarigSykdomVurderingDto as ValgtLangvarigSykdomVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { harÅpentAksjonspunkt } from '../../../utils/aksjonspunktUtils';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

interface SykdomUperiodisertAlertProps {
  vurderinger: LangvarigSykdomVurderingDto[] | undefined;
  vurderingBruktIAksjonspunkt: ValgtLangvarigSykdomVurderingDto | undefined;
}

const SykdomUperiodisertAlert = ({ vurderinger, vurderingBruktIAksjonspunkt }: SykdomUperiodisertAlertProps) => {
  const { readOnly, behandlingUuid, aksjonspunkter, løsAksjonspunkt9301 } = useContext(SykdomOgOpplæringContext);
  const aksjonspunktErÅpent = harÅpentAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_LANGVARIG_SYK);

  const løsAksjonspunktUtenEndringer = () => {
    if (!vurderingBruktIAksjonspunkt) return;
    // bruker en vilkårlig vurdering fra listen for å løse aksjonspunktet
    løsAksjonspunkt9301(vurderingBruktIAksjonspunkt.vurderingUuid);
  };

  const harVurderingFraTidligereBehandling = vurderinger?.some(v => v.behandlingUuid !== behandlingUuid);

  if (
    aksjonspunktErÅpent &&
    vurderingBruktIAksjonspunkt?.resultat !== 'MÅ_VURDERES' &&
    !readOnly &&
    vurderinger &&
    vurderinger.length > 0
  ) {
    return (
      <Alert className="mb-4 p-4" variant="info" size="small">
        <div className="flex flex-col gap-2">
          <span>Sykdom er ferdig vurdert og du kan gå videre i behandlingen.</span>
          <div>
            <Button variant="secondary" size="small" onClick={løsAksjonspunktUtenEndringer}>
              Bekreft og fortsett
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  if (aksjonspunktErÅpent && harVurderingFraTidligereBehandling && !readOnly) {
    return (
      <Alert className="mb-4" variant="warning" size="small">
        Det er tidligere vurdert om barnet har en funksjonshemning eller en langvarig sykdom. Bekreft om tidligere
        sykdomsvurdering gjelder for ny periode eller legg til en ny sykdomsvurdering.
      </Alert>
    );
  }

  if (aksjonspunktErÅpent && !readOnly) {
    return (
      <Alert className="mb-4" variant="warning" size="small">
        Vurder om barnet har en funksjonshemning eller en langvarig sykdom.
      </Alert>
    );
  }

  return null;
};

export default SykdomUperiodisertAlert;
