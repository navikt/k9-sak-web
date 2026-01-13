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

// Info component (fortsett uten inntektsmelding)
interface FortsettInfoProps {
  tilstand: Tilstand;
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
}

const FortsettUtenInntektsmeldingInfo = ({
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
}: FortsettInfoProps): JSX.Element | null => {
  const { readOnly } = useInntektsmeldingContext();

  if (
    tilstand?.vurdering === InntektsmeldingVurderingResponseKode.KAN_FORTSETTE &&
    !redigeringsmodus &&
    tilstand.tilVurdering
  ) {
    return (
      <>
        <Alert variant="info" size="medium" className="mt-2">
          <div className="flex flex-col gap-4">
            <BodyShort>Fortsett uten inntektsmelding.</BodyShort>
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
  }

  return null;
};

// Avslag component
const FortsettUtenInntektsmeldingAvslag = ({
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
}: FortsettInfoProps): JSX.Element | null => {
  const { readOnly } = useInntektsmeldingContext();

  const kode = tilstand?.vurdering;
  const harAvslagskode =
    kode === InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG ||
    kode === InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP;

  if (harAvslagskode && !redigeringsmodus && tilstand.tilVurdering) {
    return (
      <>
        <Alert variant="error" size="medium" className="mt-2">
          <div className="flex flex-col gap-4">
            {kode === InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG && (
              <BodyShort>Søknaden avslås på grunn av manglende opplysninger om inntekt</BodyShort>
            )}
            {kode === InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP && (
              <BodyShort>Søknaden avslås fordi søker ikke har dokumentert tapt arbeidsinntekt</BodyShort>
            )}
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
  }
  return null;
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
          <FortsettUtenInntektsmeldingInfo
            tilstand={tilstand}
            redigeringsmodus={tilstand.redigeringsmodus}
            setRedigeringsmodus={tilstand.setRedigeringsmodus}
          />
          <FortsettUtenInntektsmeldingAvslag
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
