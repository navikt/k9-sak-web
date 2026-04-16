import { useContext, useEffect, useState } from 'react';
import { Button } from '@navikt/ds-react';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated/types.js';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning.js';
import InstitusjonForm from './InstitusjonForm.js';
import DetailView from '../../../../shared/detailView/DetailView.js';
import { PencilIcon } from '@navikt/aksel-icons';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { harAksjonspunkt } from '../../../../utils/aksjonspunktUtils.js';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
}

const InstitusjonDetails = ({ vurdering, readOnly }: OwnProps) => {
  const { aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const harAksjonspunkt9300 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_INSTITUSJON);
  const [redigerer, setRedigerer] = useState(false);
  const visRediger =
    !readOnly &&
    !redigerer &&
    vurdering.resultat !== InstitusjonVurderingDtoResultat.MÅ_VURDERES &&
    vurdering.erTilVurdering &&
    harAksjonspunkt9300;

  useEffect(() => {
    if (redigerer) {
      setRedigerer(false);
    }
  }, [vurdering.journalpostId]);

  return (
    <DetailView
      title="Vurdering av institusjon"
      border
      contentAfterTitleRenderer={() =>
        visRediger ? (
          <Button
            size="small"
            onClick={() => setRedigerer(true)}
            icon={<PencilIcon />}
            variant="tertiary"
            className="ml-4"
          >
            Rediger vurdering
          </Button>
        ) : null
      }
      perioder={vurdering.perioder}
    >
      {vurdering.resultat !== InstitusjonVurderingDtoResultat.MÅ_VURDERES && !redigerer ? (
        <InstitusjonFerdigVisning vurdering={vurdering} />
      ) : (
        <InstitusjonForm
          vurdering={vurdering}
          readOnly={readOnly}
          avbrytRedigering={() => setRedigerer(false)}
          erRedigering={redigerer}
        />
      )}
    </DetailView>
  );
};

export default InstitusjonDetails;
