import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { InntektsmeldingRequestPayload, TilstandMedUiState } from '../../types';
import { skalVurderes } from '../../util/utils';
import InntektsmeldingFerdigvisning from './InntektsmeldingFerdigvisning';
import VurderingSkjema from './InntektsmeldingAksjonspunktForm';
import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';

interface InntektsmeldingVurderingProps {
  tilstand: TilstandMedUiState;
  onSubmit: (payload: InntektsmeldingRequestPayload) => Promise<void>;
  aksjonspunkt?: AksjonspunktDto;
  formMethods: UseFormReturn<FieldValues>;
  harFlereTilstanderTilVurdering: boolean;
}

const InntektsmeldingVurdering = ({
  tilstand,
  onSubmit,
  aksjonspunkt,
  formMethods,
  harFlereTilstanderTilVurdering,
}: InntektsmeldingVurderingProps) => {
  const { readOnly } = useInntektsmeldingContext();
  const { redigeringsmodus, setRedigeringsmodus } = tilstand;

  const harTidligereVurdering = tilstand.vurdering && tilstand.tilVurdering;
  const skalViseSkjema =
    tilstand.tilVurdering && aksjonspunkt && (redigeringsmodus || (skalVurderes(tilstand) && !readOnly));
  const skalViseFerdigvisning = harTidligereVurdering && !redigeringsmodus;

  if (skalViseSkjema && aksjonspunkt) {
    return (
      <VurderingSkjema
        tilstand={tilstand}
        aksjonspunkt={aksjonspunkt}
        formMethods={formMethods}
        onSubmit={onSubmit}
        harFlereTilstanderTilVurdering={harFlereTilstanderTilVurdering}
      />
    );
  }

  if (skalViseFerdigvisning) {
    return (
      <InntektsmeldingFerdigvisning
        tilstand={tilstand}
        onEdit={() => setRedigeringsmodus(true)}
        readOnly={readOnly}
        harAksjonspunkt={!!aksjonspunkt}
      />
    );
  }

  return null;
};

export default InntektsmeldingVurdering;
