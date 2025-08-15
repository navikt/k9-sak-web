import { Alert, Button } from '@navikt/ds-react';
import { useContext } from 'react';
import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonVurderingDto as InstitusjonVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex';
import { isAksjonspunktOpen, finnAksjonspunkt } from '../../../../utils/aksjonspunktUtils';
import { utledGodkjentInstitusjon } from '../utils';
import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

interface FaktaInstitusjonAlertProps {
  valgtVurdering: InstitusjonVurderingDtoMedPerioder | undefined;
  vurderinger: InstitusjonVurderingDto[] | undefined;
}

const InstitusjonAlerts = ({ valgtVurdering, vurderinger }: FaktaInstitusjonAlertProps) => {
  const { readOnly, aksjonspunkter, løsAksjonspunkt9300 } = useContext(SykdomOgOpplæringContext);

  const aksjonspunkt9300 = finnAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_INSTITUSJON);
  const harÅpentAksjonspunkt = isAksjonspunktOpen(aksjonspunkt9300?.status);

  const alleVurderingerErGjort = vurderinger?.every(
    vurdering => vurdering.resultat !== InstitusjonResultat.MÅ_VURDERES,
  );

  const løsAksjonspunktUtenEndringer = (vurderinger: InstitusjonVurderingDto[]) => {
    if (vurderinger.length === 0) return;
    // bruker en vilkårlig vurdering fra listen for å løse aksjonspunktet
    løsAksjonspunkt9300({
      godkjent: utledGodkjentInstitusjon(vurderinger[0]?.resultat) === 'ja' ? true : false,
      journalpostId: {
        journalpostId: vurderinger[0]?.journalpostId.journalpostId ?? '',
      },
      begrunnelse: vurderinger[0]?.begrunnelse ?? '',
    });
  };

  if (valgtVurdering?.resultat === InstitusjonResultat.MÅ_VURDERES && !readOnly) {
    return (
      <Alert variant="warning" size="small" contentMaxWidth={false} className="mb-4">
        {`Vurder om opplæringen er utført ved godkjent helseinstitusjon eller kompetansesenter i perioden ${valgtVurdering.perioder.map(periode => periode.prettifyPeriod()).join(', ')}.`}
      </Alert>
    );
  }

  if (alleVurderingerErGjort && harÅpentAksjonspunkt && !readOnly && vurderinger && vurderinger.length > 0) {
    return (
      <Alert variant="info" size="small" className="mb-4 p-4">
        Institusjoner er ferdig vurdert og du kan gå videre i behandlingen.
        <div className="mt-2">
          <Button variant="secondary" size="small" onClick={() => løsAksjonspunktUtenEndringer(vurderinger)}>
            Bekreft og fortsett
          </Button>
        </div>
      </Alert>
    );
  }

  return null;
};

export default InstitusjonAlerts;
