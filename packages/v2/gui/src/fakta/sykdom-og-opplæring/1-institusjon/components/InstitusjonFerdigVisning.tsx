import { BodyShort } from '@navikt/ds-react';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import { LabelledContent } from '../../../../shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '../../../../shared/vurdert-av/VurdertAv.js';
import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
}

const InstitusjonFerdigVisning = ({ vurdering }: OwnProps) => (
  <>
    <div className="flex flex-col gap-6 mt-6">
      <LabelledContent
        label="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?"
        size="small"
        content={
          ((vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK ||
            vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) &&
            'Ja') ||
          'Nei'
        }
      />
      {vurdering.begrunnelse && (
        <div>
          <LabelledContent
            label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
            indentContent
            size="small"
            content={
              <BodyShort size="small" className="whitespace-pre-wrap">
                {vurdering.begrunnelse}
              </BodyShort>
            }
          />
          <VurdertAv ident={vurdering?.vurdertAv} date={vurdering?.vurdertTidspunkt} />
        </div>
      )}
    </div>
  </>
);

export default InstitusjonFerdigVisning;
