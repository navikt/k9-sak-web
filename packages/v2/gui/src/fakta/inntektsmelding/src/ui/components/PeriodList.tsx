import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import type { JSX } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { InntektsmeldingRequestPayload } from '../../types/InntektsmeldingAPRequest';
import type { Tilstand, TilstandMedUiState } from '../../types/KompletthetData';
import { InntektsmeldingVurderingRequestKode, InntektsmeldingVurderingResponseKode } from '../../types/KompletthetData';
import { sorterSkjæringstidspunkt } from '../../util/utils';
import FortsettUtenInntektsmeldingForm from './FortsettUtenInntektsmeldingForm';
import InntektsmeldingListe from './InntektsmeldingListe';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

// Viser tidligere vurdering med mulighet for å redigere
interface TidligereVurderingProps {
  tilstand: Tilstand;
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
}

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

const TidligereVurdering = ({
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
}: TidligereVurderingProps): JSX.Element | null => {
  const { readOnly } = useInntektsmeldingContext();

  const config = tilstand?.vurdering ? vurderingConfig[tilstand.vurdering] : null;
  const skalVises = config && !redigeringsmodus && tilstand.tilVurdering;

  if (!skalVises) return null;

  return (
    <>
      <Alert variant={config.variant} size="medium" className="mt-2">
        <div className="flex flex-col gap-4">
          <BodyShort>{config.melding}</BodyShort>
          {!readOnly && (
            <div>
              <Button variant="tertiary" size="small" onClick={() => setRedigeringsmodus(true)} icon={<PencilIcon />}>
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

// Main PeriodList component
interface PeriodListProps {
  tilstander: TilstandMedUiState[];
  onFormSubmit: (payload: InntektsmeldingRequestPayload) => void;
  aksjonspunkt?: AksjonspunktDto;
  formMethods: UseFormReturn<FieldValues>;
  harFlereTilstanderTilVurdering: boolean;
}

const PeriodList = ({
  tilstander,
  onFormSubmit,
  aksjonspunkt,
  formMethods,
  harFlereTilstanderTilVurdering,
}: PeriodListProps): JSX.Element => (
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
          <InntektsmeldingListe status={tilstand.status} />
          <FortsettUtenInntektsmeldingForm
            onSubmit={onFormSubmit}
            tilstand={tilstand}
            aksjonspunkt={aksjonspunkt}
            formMethods={formMethods}
            redigeringsmodus={tilstand.redigeringsmodus}
            setRedigeringsmodus={tilstand.setRedigeringsmodus}
            harFlereTilstanderTilVurdering={harFlereTilstanderTilVurdering}
          />
          <TidligereVurdering
            tilstand={tilstand}
            redigeringsmodus={tilstand.redigeringsmodus}
            setRedigeringsmodus={tilstand.setRedigeringsmodus}
          />
        </VStack>
      </li>
    ))}
  </ul>
);

export default PeriodList;
