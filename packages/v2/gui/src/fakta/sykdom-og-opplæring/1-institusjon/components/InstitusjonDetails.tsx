import { useState } from 'react';
import { Box, Button, BodyShort } from '@navikt/ds-react';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning.js';
import InstitusjonForm from './InstitusjonForm.js';
import DetailView from '../../../../shared/detailView/DetailView.js';
import { PencilIcon, CalendarIcon } from '@navikt/aksel-icons';
import { LabelledContent } from '../../../../shared/labelled-content/LabelledContent.js';

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
  const perioder = vurdering.perioder.map(periode => (
    <div key={periode.prettifyPeriod()} data-testid="Periode" className="flex gap-2">
      <CalendarIcon fontSize="20" /> <BodyShort size="small">{periode.prettifyPeriod()}</BodyShort>
    </div>
  ));
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
      belowTitleContent={perioder}
    >
      <Box className="mt-8">
        <LabelledContent
          label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
          size="small"
          content={vurdering.institusjon}
        />
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
