import { useEffect, useState } from 'react';
import { Button } from '@navikt/ds-react';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning.js';
import InstitusjonForm from './InstitusjonForm.js';
import DetailView from '../../../../shared/detailView/DetailView.js';
import { PencilIcon } from '@navikt/aksel-icons';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
}

const InstitusjonDetails = ({ vurdering, readOnly }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);
  const visEndreLink = !readOnly && vurdering.resultat !== InstitusjonVurderingDtoResultat.MÅ_VURDERES;

  useEffect(() => {
    if (redigering) {
      setRedigering(false);
    }
  }, [vurdering.journalpostId]);

  return (
    <DetailView
      title="Vurdering av institusjon"
      border
      contentAfterTitleRenderer={() =>
        visEndreLink && !redigering ? (
          <Button
            size="small"
            onClick={() => setRedigering(true)}
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
      {vurdering.resultat !== InstitusjonVurderingDtoResultat.MÅ_VURDERES && !redigering ? (
        <InstitusjonFerdigVisning vurdering={vurdering} />
      ) : (
        <InstitusjonForm
          vurdering={vurdering}
          readOnly={readOnly}
          avbrytRedigering={() => setRedigering(false)}
          erRedigering={redigering}
        />
      )}
    </DetailView>
  );
};

export default InstitusjonDetails;
