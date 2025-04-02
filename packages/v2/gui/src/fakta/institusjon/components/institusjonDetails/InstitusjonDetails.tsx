import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import { Calender } from '@navikt/ds-icons';
import { Box, Button } from '@navikt/ds-react';
import { DetailView } from '@navikt/ft-plattform-komponenter';
import { useState } from 'react';

import { LabelledContent } from '../../../../shared/labelledContent/LabelledContent.js';
import type { InstitusjonVurderingDtoMedPerioder } from '../../types/InstitusjonVurderingDtoMedPerioder.js';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning.js';
import InstitusjonForm, { type SubmitValues } from './InstitusjonForm.js';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
  løsAksjonspunkt: (payload: SubmitValues) => void;
}

const InstitusjonDetails = ({ vurdering, readOnly, løsAksjonspunkt }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);
  const visEndreLink = !readOnly && vurdering.resultat !== InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK;

  return (
    <DetailView
      title="Vurdering av institusjon"
      contentAfterTitleRenderer={() =>
        visEndreLink && !redigering ? (
          <Button variant="tertiary" size="xsmall" onClick={() => setRedigering(true)} className="ml-2">
            Endre vurdering
          </Button>
        ) : null
      }
    >
      {vurdering.perioder.map(periode => (
        <div key={periode.prettifyPeriod()} data-testid="Periode">
          <Calender /> <span>{periode.prettifyPeriod()}</span>
        </div>
      ))}

      <Box className="mt-8">
        <LabelledContent
          label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
          content={vurdering.institusjon}
        />
      </Box>

      {vurdering.resultat !== InstitusjonVurderingDtoResultat.MÅ_VURDERES && !redigering ? (
        <InstitusjonFerdigVisning vurdering={vurdering} />
      ) : (
        <InstitusjonForm
          vurdering={vurdering}
          readOnly={readOnly}
          løsAksjonspunkt={løsAksjonspunkt}
          avbrytRedigering={() => setRedigering(false)}
          erRedigering={redigering}
        />
      )}
    </DetailView>
  );
};

export default InstitusjonDetails;
