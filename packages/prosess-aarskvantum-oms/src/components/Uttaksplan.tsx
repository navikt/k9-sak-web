import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Tabs from 'nav-frontend-tabs';
import { Undertittel } from 'nav-frontend-typografi';
import { Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/calendar_filled.svg';
import { KodeverkMedNavn, Arbeidsforhold } from '@k9-sak-web/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { joinNonNullStrings } from '@fpsak-frontend/utils';
import BorderedContainer from './BorderedContainer';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';
import styles from './uttaksplan.less';

interface UttaksplanProps {
  aktiviteterBehandling: Aktivitet[];
  aktiviteterHittilIÅr: Aktivitet[];
  aktiv: boolean;
  aktivitetsstatuser: KodeverkMedNavn[];
  arbeidsforhold: Arbeidsforhold[];
}

const mapAktiviteterTilTabell = (
  aktiviteter: Aktivitet[],
  aktivitetsstatuser: KodeverkMedNavn[],
  alleArbeidsforhold: Arbeidsforhold[],
) => {
  if (!aktiviteter.length) {
    return <FormattedMessage id="Uttaksplan.IngenUttaksplaner" />;
  }
  return aktiviteter.map(({ arbeidsforhold, uttaksperioder }) => {
    const gjeldendeArbeidsforhold = alleArbeidsforhold
      .filter(
        arb =>
          arb.arbeidsgiverIdentifikator === arbeidsforhold.organisasjonsnummer ||
          arb.arbeidsgiverIdentifiktorGUI === arbeidsforhold.organisasjonsnummer,
      )
      .find(arb => arb.arbeidsforholdId === arbeidsforhold.arbeidsforholdId);

    return (
      <AktivitetTabell
        arbeidsforhold={gjeldendeArbeidsforhold}
        arbeidsforholdtypeKode={arbeidsforhold.type}
        uttaksperioder={uttaksperioder}
        aktivitetsstatuser={aktivitetsstatuser}
        key={joinNonNullStrings(Object.values(arbeidsforhold))}
      />
    );
  });
};

const Uttaksplan: FunctionComponent<UttaksplanProps> = ({
  aktiviteterBehandling = [],
  aktiviteterHittilIÅr = [],
  aktivitetsstatuser = [],
  aktiv,
  arbeidsforhold,
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
      {valgtTabIndex === 0 && mapAktiviteterTilTabell(aktiviteterBehandling, aktivitetsstatuser, arbeidsforhold)}
      {valgtTabIndex === 1 && mapAktiviteterTilTabell(aktiviteterHittilIÅr, aktivitetsstatuser, arbeidsforhold)}
    </BorderedContainer>
  );
};

export default Uttaksplan;
