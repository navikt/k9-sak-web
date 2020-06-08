import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/calendar_filled.svg';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import Aksjonspunkt from '@k9-sak-web/types/src/aksjonspunktTsType';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { joinNonNullStrings } from '@fpsak-frontend/fp-felles/index';
import BorderedContainer from './BorderedContainer';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';
import AksjonspunktForm from './AksjonspunktForm';
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
  aksjonspunkterForSteg?: Aksjonspunkt[];
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
  aksjonspunkterForSteg = [],
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
      {aksjonspunkterForSteg.length > 0 && (
        <AksjonspunktForm
          aktiviteter={aktiviteter}
          rammevedtak={rammevedtak}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          submitCallback={submitCallback}
          aksjonspunkterForSteg={aksjonspunkterForSteg}
          isAksjonspunktOpen={isAksjonspunktOpen}
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
