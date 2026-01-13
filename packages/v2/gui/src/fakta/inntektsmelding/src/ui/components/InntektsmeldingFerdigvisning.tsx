import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { PencilIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button } from '@navikt/ds-react';
import type { TilstandMedUiState } from '../../types';
import { InntektsmeldingVurderingRequestKode, InntektsmeldingVurderingResponseKode } from '../../types';

const vurderingConfig: Record<string, { variant: 'info' | 'error'; melding: string }> = {
  [InntektsmeldingVurderingResponseKode.KAN_FORTSETTE]: {
    variant: 'info',
    melding: 'Fortsett uten inntektsmelding.',
  },
  [InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG]: {
    variant: 'error',
    melding: 'Søknaden avslås på grunn av manglende opplysninger om inntekt',
  },
  [InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP]: {
    variant: 'error',
    melding: 'Søknaden avslås fordi søker ikke har dokumentert tapt arbeidsinntekt',
  },
};

interface InntektsmeldingFerdigvisningProps {
  tilstand: TilstandMedUiState;
  onEdit: () => void;
  readOnly: boolean;
}

const InntektsmeldingFerdigvisning = ({
  tilstand,
  onEdit,
  readOnly,
}: InntektsmeldingFerdigvisningProps) => {
  console.log('tilstand', tilstand);
  const config = tilstand.vurdering ? vurderingConfig[tilstand.vurdering] : null;
  if (!config) return null;

  return (
    <>
      <Alert variant={config.variant} size="medium" className="mt-2">
        <div className="flex flex-col gap-4">
          <BodyShort>{config.melding}</BodyShort>
          {!readOnly && (
            <div>
              <Button variant="tertiary" size="small" onClick={onEdit} icon={<PencilIcon />}>
                Rediger vurdering
              </Button>
            </div>
          )}
        </div>
      </Alert>
      <LabelledContent
        label="Begrunnelse"
        content={<span className="whitespace-pre-wrap">{tilstand.begrunnelse}</span>}
        indentContent
      />
      <VurdertAv ident={tilstand.vurdertAv} date={tilstand.vurdertTidspunkt} />
    </>
  );
};

export default InntektsmeldingFerdigvisning;
