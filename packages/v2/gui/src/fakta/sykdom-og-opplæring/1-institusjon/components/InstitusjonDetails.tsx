import { useState } from 'react';
import { Box, Button, BodyShort } from '@navikt/ds-react';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning.js';
import InstitusjonForm from './InstitusjonForm.js';
import DetailView from '../../../../shared/detail-view/DetailView.js';
import { PencilIcon, CalendarIcon } from '@navikt/aksel-icons';
import { LabelledContent } from '../../../../shared/LabelledContent/LabelledContent.js';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
}

const InstitusjonDetails = ({ vurdering, readOnly }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);
  const erManueltVurdert =
    vurdering.resultat === InstitusjonVurderingDtoResultat.IKKE_GODKJENT_MANUELT ||
    vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT;
  const visEndreLink = !readOnly && erManueltVurdert;

  return (
    <DetailView
      title="Vurdering av institusjon"
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
    >
      {vurdering.perioder.map(periode => (
        <div key={periode.prettifyPeriod()} data-testid="Periode">
          <CalendarIcon fontSize="20" /> <BodyShort size="small">{periode.prettifyPeriod()}</BodyShort>
        </div>
      ))}

      <Box className="mt-8">
        <LabelledContent label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?" size="small">
          {vurdering.institusjon}
        </LabelledContent>
      </Box>

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
