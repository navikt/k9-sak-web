import { Period } from '@fpsak-frontend/utils';
import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import type { JSX, ReactNode } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import type { InntektsmeldingRequestPayload } from '../../../types/InntektsmeldingAPRequest';
import type { TilstandBeriket } from '../../../types/KompletthetData';
import { sorterSkjæringstidspunkt } from '../../../util/utils';
import FortsettUtenInntektsmeldingForm from '../fortsett-uten-inntektsmelding-form/FortsettUtenInntektsmeldingForm';
import FortsettUtenInntektsmeldingAvslag from './FortsettUtenInntektsmeldingAvslag';
import FortsettUtenInntektsmeldingInfo from './FortsettUtenInntektsmeldingInfo';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

interface PeriodListProps {
  tilstander: TilstandBeriket[];
  listHeadingRenderer: () => ReactNode;
  listItemRenderer: (period: Period) => ReactNode;
  onFormSubmit: (payload: InntektsmeldingRequestPayload) => void;
  aksjonspunkt?: AksjonspunktDto;
  formMethods: UseFormReturn<FieldValues>;
  harFlereTilstanderTilVurdering: boolean;
}

const PeriodList = ({
  tilstander,
  listHeadingRenderer,
  listItemRenderer,
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
        {listHeadingRenderer()}
        <VStack gap="space-16">
          {listItemRenderer(tilstand.periode)}
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
