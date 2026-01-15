import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { InntektsmeldingRequestPayload, TilstandMedUiState } from '../../types';
import { sorterSkjæringstidspunkt } from '../../util/utils';
import InntektsmeldingRad from './InntektsmeldingRad';
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
}: InntektsmeldingListeProps) => (
  <ul className="m-0 list-none p-0">
    {tilstander.sort(sorterSkjæringstidspunkt).map(tilstand => (
      <li key={tilstand.periode.prettifyPeriod()} className="mt-[0.625rem]">
        <hr className="border-ax-border-neutral-subtleA m-0 p-0 h-[1px]" />
        <HStack align="center" marginBlock={'5 0'}>
          <CalendarIcon fontSize="1.5rem" />
          <BodyShort size="small">{tilstand.periode.prettifyPeriod()}</BodyShort>
        </HStack>
        <VStack gap="space-16">
          <InntektsmeldingRad status={tilstand.status} førsteFraværsdag={tilstand.periode.fom} />
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
