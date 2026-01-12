import { Period } from '@fpsak-frontend/utils';
import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Aksjonspunkt from '../../../types/Aksjonspunkt';
import AksjonspunktRequestPayload from '../../../types/AksjonspunktRequestPayload';
import { TilstandBeriket } from '../../../types/KompletthetData';
import { sorterSkjæringstidspunkt } from '../../../util/utils';
import FortsettUtenInntektsmeldingForm from '../fortsett-uten-inntektsmelding-form/FortsettUtenInntektsmeldingForm';
import FortsettUtenInntektsmeldingAvslag from './FortsettUtenInntektsmeldingAvslag';
import FortsettUtenInntektsmeldingInfo from './FortsettUtenInntektsmeldingInfo';
import styles from './periodList.module.css';

interface PeriodListProps {
  tilstander: TilstandBeriket[];
  listHeadingRenderer: () => React.ReactNode;
  listItemRenderer: (period: Period) => React.ReactNode;
  onFormSubmit: (payload: AksjonspunktRequestPayload) => void;
  aksjonspunkt: Aksjonspunkt;
  formMethods: UseFormReturn;
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
  <ul className={styles.periodList}>
    {tilstander.sort(sorterSkjæringstidspunkt).map(tilstand => (
      <li className={styles.periodList__element} key={tilstand.periode.prettifyPeriod()}>
        <HStack marginBlock="0 4" align="center" gap="space-4">
          <CalendarIcon fontSize="1.5rem" />
          <BodyShort size="small">{tilstand.periode.prettifyPeriod()}</BodyShort>
        </HStack>
        {listHeadingRenderer()}
        <VStack gap={'space-16'}>
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
