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
import styles from './uttaksplan.less';

interface UttaksplanProps {
  aktiviteter: Aktivitet[];
  aktiv: boolean;
  aktivitetsstatuser: KodeverkMedNavn[];
}

const Uttaksplan: FunctionComponent<UttaksplanProps> = ({ aktiviteter = [], aktivitetsstatuser = [], aktiv }) => {
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
