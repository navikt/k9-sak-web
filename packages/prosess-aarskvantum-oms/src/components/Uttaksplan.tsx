import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Tabs from 'nav-frontend-tabs';
import { Undertittel } from 'nav-frontend-typografi';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/calendar_filled.svg';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { joinNonNullStrings } from '@fpsak-frontend/fp-felles/index';
import BorderedContainer from './BorderedContainer';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';
import styles from './uttaksplan.less';

interface UttaksplanProps {
  aktiviteterBehandling: Aktivitet[];
  aktiviteterHittilIÅr: Aktivitet[];
  aktiv: boolean;
  aktivitetsstatuser: KodeverkMedNavn[];
}

const mapAktiviteterTilTabell = (aktiviteter: Aktivitet[], aktivitetsstatuser: KodeverkMedNavn[]) =>
  aktiviteter.map(({ arbeidsforhold, uttaksperioder }) => (
    <AktivitetTabell
      arbeidsforhold={arbeidsforhold}
      uttaksperioder={uttaksperioder}
      aktivitetsstatuser={aktivitetsstatuser}
      key={joinNonNullStrings(Object.values(arbeidsforhold))}
    />
  ));

const Uttaksplan: FunctionComponent<UttaksplanProps> = ({
  aktiviteterBehandling = [],
  aktiviteterHittilIÅr = [],
  aktivitetsstatuser = [],
  aktiv,
}) => {
  const [valgtTabIndex, setValgtTabIndex] = useState<number>(0);
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
      <Tabs
        tabs={[
          { label: <FormattedMessage id="Uttaksplan.DenneBehandling" /> },
          { label: <FormattedMessage id="Uttaksplan.HittilIÅr" /> },
        ]}
        onChange={(e, valgtIndex) => setValgtTabIndex(valgtIndex)}
      />
      <VerticalSpacer sixteenPx />
      {valgtTabIndex === 0 &&
        (aktiviteterBehandling.length ? (
          mapAktiviteterTilTabell(aktiviteterBehandling, aktivitetsstatuser)
        ) : (
          <FormattedMessage id="Uttaksplan.IngenUttaksplaner" />
        ))}
      {valgtTabIndex === 1 && mapAktiviteterTilTabell(aktiviteterHittilIÅr, aktivitetsstatuser)}
    </BorderedContainer>
  );
};

export default Uttaksplan;
