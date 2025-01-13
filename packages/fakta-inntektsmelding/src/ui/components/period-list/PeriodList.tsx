import React from 'react';
import { Period } from '@fpsak-frontend/utils';
import { CalendarIcon } from '@navikt/ft-plattform-komponenter';
import { UseFormReturn } from 'react-hook-form';
import styles from './periodList.module.css';
import FortsettUtenInntektsmeldingForm from '../fortsett-uten-inntektsmelding-form/FortsettUtenInntektsmeldingForm';
import { TilstandBeriket } from '../../../types/KompletthetData';
import FortsettUtenInntektsmeldingInfo from './FortsettUtenInntektsmeldingInfo';
import FortsettUtenInntektsmeldingAvslag from './FortsettUtenInntektsmeldingAvslag';
import Aksjonspunkt from '../../../types/Aksjonspunkt';
import AksjonspunktRequestPayload from '../../../types/AksjonspunktRequestPayload';
import { sorterSkjæringstidspunkt } from '../../../util/utils';

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
        <div className={styles.periodList__element__title}>
          <CalendarIcon />
          <span className={styles.periodList__element__title__period}>{tilstand.periode.prettifyPeriod()}</span>
        </div>
        {listHeadingRenderer()}
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
      </li>
    ))}
  </ul>
);

export default PeriodList;
