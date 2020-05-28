import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/calendar_filled.svg';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import BorderedContainer from './BorderedContainer';
import Aktivitet from '../dto/Aktivitet';
import { joinNonNullStrings } from './utils';
import AktivitetTabell from './AktivitetTabell';
import AksjonspunktForm from './AksjonspunktForm';
import Rammevedtak from '../dto/Rammevedtak';
import styles from './uttaksplan.less';

interface UttaksplanProps {
  aktiviteter: Aktivitet[];
  rammevedtak: Rammevedtak[];
  aktiv: boolean;
  aktivitetsstatuser: KodeverkMedNavn[];
  isAksjonspunktOpen: boolean;
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any[]) => void;
}

const Uttaksplan: FunctionComponent<UttaksplanProps> = ({
  aktiviteter = [],
  rammevedtak = [],
  aktivitetsstatuser = [],
  aktiv,
  isAksjonspunktOpen,
  behandlingId,
  behandlingVersjon,
  submitCallback,
}) => {
  return (
    <BorderedContainer
      heading={
        <>
          {!aktiv && (
            <AlertStripeInfo className={styles.alertstripe}>
              <FormattedMessage id="Uttaksplan.Inaktiv" />
            </AlertStripeInfo>
          )}
          <Undertittel tag="h3">
            <Image src={kalender} />
            <FormattedMessage id="Uttaksplan.Heading" />
          </Undertittel>
        </>
      }
    >
      {isAksjonspunktOpen && (
        <AksjonspunktForm
          aktiviteter={aktiviteter}
          rammevedtak={rammevedtak}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          submitCallback={submitCallback}
        />
      )}
      {aktiviteter.length ? (
        aktiviteter.map(({ arbeidsforhold, uttaksperioder }) => (
          <AktivitetTabell
            arbeidsforhold={arbeidsforhold}
            uttaksperioder={uttaksperioder}
            aktivitetsstatuser={aktivitetsstatuser}
            key={joinNonNullStrings(Object.values(arbeidsforhold))}
          />
        ))
      ) : (
        <FormattedMessage id="Uttaksplan.IngenUttaksplaner" />
      )}
    </BorderedContainer>
  );
};

export default Uttaksplan;
