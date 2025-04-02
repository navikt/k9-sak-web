import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import { Box } from '@navikt/ds-react';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';

import { LabelledContent } from '../../../../shared/labelledContent/LabelledContent.js';
import type { InstitusjonVurderingDtoMedPerioder } from '../../types/InstitusjonVurderingDtoMedPerioder.js';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
}

const InstitusjonFerdigVisning = ({ vurdering }: OwnProps) => (
  <>
    <Box className="mt-8">
      <LabelledContent
        label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
        content={<span className="whitespace-pre-wrap">{vurdering.begrunnelse}</span>}
        indentContent
      />
      <AssessedBy ident={vurdering?.vurdertAv} date={vurdering?.vurdertTidspunkt} />
    </Box>

    <Box className="mt-8">
      <LabelledContent
        label="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?"
        content={
          ((vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK ||
            vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) &&
            'Ja') ||
          'Nei'
        }
      />
    </Box>
  </>
);

export default InstitusjonFerdigVisning;
