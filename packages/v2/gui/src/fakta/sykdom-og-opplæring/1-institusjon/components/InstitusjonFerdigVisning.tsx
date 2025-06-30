import { BodyShort, Box } from '@navikt/ds-react';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import { LabelledContent } from '../../../../shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '../../../../shared/vurdert-av/VurdertAv.js';
import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import { CogIcon } from '@navikt/aksel-icons';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
}

const InstitusjonFerdigVisning = ({ vurdering }: OwnProps) => (
  <>
    <Box className="mt-8">
      <LabelledContent
        label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
        size="small"
        content={
          <BodyShort size="small" className="whitespace-pre-wrap">
            {vurdering.institusjon}
          </BodyShort>
        }
      />
    </Box>
    <div className="flex flex-col gap-6 mt-6">
      <LabelledContent
        label="Er opplæringen ved en godkjent helseinstitusjon eller kompetansesenter?"
        size="small"
        content={
          ((vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK ||
            vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) && (
            <BodyShort size="small">Ja</BodyShort>
          )) || <BodyShort size="small">Nei</BodyShort>
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
      {vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK && (
        <div className="flex gap-2 items-center">
          <CogIcon fontSize="20" />
          <BodyShort size="small">Automatisk vurdering</BodyShort>
        </div>
      )}
    </div>
  </>
);

export default InstitusjonFerdigVisning;
