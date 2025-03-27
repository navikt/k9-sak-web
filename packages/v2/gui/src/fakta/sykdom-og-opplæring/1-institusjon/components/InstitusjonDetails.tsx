import { useState } from 'react';
import { Box } from '@navikt/ds-react';
import { Calender } from '@navikt/ds-icons';
import { DetailView, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { LinkButton } from '@navikt/ft-plattform-komponenter';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import InstitusjonFerdigVisning from './InstitusjonFerdigVisning.js';
import InstitusjonForm from './InstitusjonForm.js';

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
          <LinkButton onClick={() => setRedigering(true)} className="ml-4">
            Endre vurdering
          </LinkButton>
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
          avbrytRedigering={() => setRedigering(false)}
          erRedigering={redigering}
        />
      )}
    </DetailView>
  );
};

export default InstitusjonDetails;
