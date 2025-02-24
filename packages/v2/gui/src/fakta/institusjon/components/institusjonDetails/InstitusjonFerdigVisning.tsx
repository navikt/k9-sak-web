import { Box } from '@navikt/ds-react';
import { AssessedBy, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

import type { InstitusjonVurderingDtoMedPerioder } from '../../types/IinstitusjonVurderingDtoMedPerioder.js';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
  rediger: () => void;
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
