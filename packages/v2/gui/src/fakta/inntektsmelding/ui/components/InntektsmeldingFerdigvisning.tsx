import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { PencilIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button } from '@navikt/ds-react';
import type { TilstandMedUiState } from '../../types';
import { Vurdering } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';

const vurderingConfig: Record<string, { variant: 'info' | 'error'; melding: string }> = {
  [Vurdering.KAN_FORTSETTE]: {
    variant: 'info',
    melding: 'Fortsett uten inntektsmelding.',
  },
  [Vurdering.MANGLENDE_GRUNNLAG]: {
    variant: 'error',
    melding: 'Søknaden avslås på grunn av manglende opplysninger om inntekt',
  },
  [Vurdering.IKKE_INNTEKTSTAP]: {
    variant: 'error',
    melding: 'Søknaden avslås fordi søker ikke har dokumentert tapt arbeidsinntekt',
  },
};

interface InntektsmeldingFerdigvisningProps {
  tilstand: TilstandMedUiState;
  onEdit: () => void;
  readOnly: boolean;
  harAksjonspunkt: boolean;
}

const InntektsmeldingFerdigvisning = ({
  tilstand,
  onEdit,
  readOnly,
  harAksjonspunkt,
}: InntektsmeldingFerdigvisningProps) => {
  const config = tilstand.vurdering ? vurderingConfig[tilstand.vurdering] : null;
  if (!config) return null;

  return (
    <>
      <Alert variant={config.variant} size="medium" className="mt-2">
        <div className="flex flex-col gap-4">
          <BodyShort>{config.melding}</BodyShort>
          {!readOnly && harAksjonspunkt && (
            <div>
              <Button variant="secondary" size="small" onClick={onEdit} icon={<PencilIcon />}>
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
