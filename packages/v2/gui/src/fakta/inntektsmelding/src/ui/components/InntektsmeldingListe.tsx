import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import type { JSX } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { InntektsmeldingRequestPayload, TilstandMedUiState } from '../../types';
import { sorterSkjæringstidspunkt } from '../../util/utils';
import InntektsmeldingInfo from './InntektsmeldingInfo';
import InntektsmeldingVurdering from './InntektsmeldingVurdering';

interface InntektsmeldingListeProps {
  tilstander: TilstandMedUiState[];
  onFormSubmit: (payload: InntektsmeldingRequestPayload) => void;
  aksjonspunkt?: AksjonspunktDto;
  formMethods: UseFormReturn<FieldValues>;
  harFlereTilstanderTilVurdering: boolean;
}

const InntektsmeldingListe = ({
  tilstander,
  onFormSubmit,
  aksjonspunkt,
  formMethods,
  harFlereTilstanderTilVurdering,
}: InntektsmeldingListeProps): JSX.Element => (
  <ul className="m-0 list-none p-0">
    {tilstander.sort(sorterSkjæringstidspunkt).map((tilstand, index) => (
      <li
        className={`border-b border-[#b0b0b0] py-6 pb-9 ${index === 0 ? 'border-t' : ''}`}
        key={tilstand.periode.prettifyPeriod()}
      >
        <HStack marginBlock="0 4" align="center" gap="space-4">
          <CalendarIcon fontSize="1.5rem" />
          <BodyShort size="small">{tilstand.periode.prettifyPeriod()}</BodyShort>
        </HStack>
        <VStack gap="space-16">
          <InntektsmeldingInfo status={tilstand.status} />
          <InntektsmeldingVurdering
            tilstand={tilstand}
            onSubmit={onFormSubmit}
            aksjonspunkt={aksjonspunkt}
            formMethods={formMethods}
            harFlereTilstanderTilVurdering={harFlereTilstanderTilVurdering}
          />
        </VStack>
      </li>
    ))}
  </ul>
);

export default InntektsmeldingListe;
