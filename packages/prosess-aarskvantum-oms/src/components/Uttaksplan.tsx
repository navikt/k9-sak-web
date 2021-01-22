import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Tabs from 'nav-frontend-tabs';
import { Undertittel } from 'nav-frontend-typografi';
import { Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/calendar_filled.svg';
import { KodeverkMedNavn, Arbeidsforhold, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { joinNonNullStrings, MicroFrontend } from '@fpsak-frontend/utils';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';
import styles from './uttaksplan.less';
import KomponenterIMicroFrontend from '../types/KomponenterIMicroFrontend';

interface UttaksplanProps {
  aktiviteterBehandling: Aktivitet[];
  aktiviteterHittilIÅr: Aktivitet[];
  aktiv: boolean;
  aktivitetsstatuser: KodeverkMedNavn[];
  arbeidsforhold: Arbeidsforhold[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const mapAktiviteterTilTabell = (
  aktiviteter: Aktivitet[],
  aktivitetsstatuser: KodeverkMedNavn[],
  alleArbeidsforhold: Arbeidsforhold[],
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
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
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        arbeidsforholdtypeKode={arbeidsforhold.type}
        uttaksperioder={uttaksperioder}
        aktivitetsstatuser={aktivitetsstatuser}
        key={joinNonNullStrings(Object.values(arbeidsforhold))}
      />
    );
  });
};

const initializeMicrofrontendOmsorgsdager = elementId =>
  (window as any).renderMicrofrontendOmsorgsdagerApp(elementId, {
    visKomponent: KomponenterIMicroFrontend.KORRIGERE_PERIODER,
  });
const microfrontendOmsorgsdagerId = 'microfrontendOmsorgsdager';

const Uttaksplan: FunctionComponent<UttaksplanProps> = ({
  aktiviteterBehandling = [],
  aktiviteterHittilIÅr = [],
  aktivitetsstatuser = [],
  aktiv,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
}) => {
  const [valgtTabIndex, setValgtTabIndex] = useState<number>(0);
  return (
    <>
      <MicroFrontend
        id={microfrontendOmsorgsdagerId}
        jsSrc="/k9/microfrontend/omsorgsdager/build/1.5.15/app.js"
        jsIntegrity="sha256-nOxS0w9MtU198p2w/11gRfsoowhAaAwyovc/DfhtiVM="
        stylesheetSrc="/k9/microfrontend/omsorgsdagerbuild/build/1.5.15/styles.css"
        stylesheetIntegrity="sha384-D6mnBSiYF3HI+jySnUtKmjX4Ajz+rYOY/38zDGfXO73I+Bwg+/tU0wNmCRpg2Og9"
        onReady={() => initializeMicrofrontendOmsorgsdager(microfrontendOmsorgsdagerId)}
        onError={() => {}}
      />
      <div className={styles.uttaksboks}>
        <div className={styles.overskrift}>
          {!aktiv && (
            <AlertStripeInfo className={styles.alertstripe}>
              <FormattedMessage id="Uttaksplan.Inaktiv" />
            </AlertStripeInfo>
          )}
          <Undertittel tag="h3">
            <Image src={kalender} />
            <FormattedMessage id="Uttaksplan.Heading" />
          </Undertittel>
        </div>
        <Tabs
          tabs={[
            { label: <FormattedMessage id="Uttaksplan.DenneBehandling" /> },
            { label: <FormattedMessage id="Uttaksplan.HittilIÅr" /> },
          ]}
          onChange={(e, valgtIndex) => setValgtTabIndex(valgtIndex)}
        />
        {valgtTabIndex === 0 &&
          mapAktiviteterTilTabell(
            aktiviteterBehandling,
            aktivitetsstatuser,
            arbeidsforhold,
            arbeidsgiverOpplysningerPerId,
          )}
        {valgtTabIndex === 1 &&
          mapAktiviteterTilTabell(
            aktiviteterHittilIÅr,
            aktivitetsstatuser,
            arbeidsforhold,
            arbeidsgiverOpplysningerPerId,
          )}
      </div>
    </>
  );
};

export default Uttaksplan;
