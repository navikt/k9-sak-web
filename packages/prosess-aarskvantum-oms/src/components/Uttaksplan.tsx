import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Tabs from 'nav-frontend-tabs';
import { Undertittel } from 'nav-frontend-typografi';
import { Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/calendar_filled.svg';
import { KodeverkMedNavn, ArbeidsforholdV2, ArbeidsgiverOpplysningerPerId, FeatureToggles } from '@k9-sak-web/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { joinNonNullStrings } from '@fpsak-frontend/utils';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';
import styles from './uttaksplan.less';

interface UttaksplanProps {
  behandlingUuid: string;
  aktiviteterBehandling: Aktivitet[];
  aktiviteterHittilIÅr: Aktivitet[];
  aktiv: boolean;
  aktivitetsstatuser: KodeverkMedNavn[];
  arbeidsforhold: ArbeidsforholdV2[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
}

const mapAktiviteterTilTabell = (
  behandlingUuid: string,
  aktiviteter: Aktivitet[],
  aktivitetsstatuser: KodeverkMedNavn[],
  alleArbeidsforhold: ArbeidsforholdV2[],
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  featureToggles: FeatureToggles
) => {
  if (!aktiviteter.length) {
    return <FormattedMessage id="Uttaksplan.IngenUttaksplaner" />;
  }

  return aktiviteter.map(({ arbeidsforhold, uttaksperioder }) => {
    const gjeldendeArbeidsforhold = alleArbeidsforhold
      .filter(arb => arb.arbeidsgiver?.arbeidsgiverOrgnr === arbeidsforhold.organisasjonsnummer)
      .find(arb => arb.arbeidsforhold?.internArbeidsforholdId === arbeidsforhold.arbeidsforholdId);

    return (
      <AktivitetTabell
        behandlingUuid={behandlingUuid}
        arbeidsforhold={gjeldendeArbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        arbeidsforholdtypeKode={arbeidsforhold.type}
        uttaksperioder={uttaksperioder}
        aktivitetsstatuser={aktivitetsstatuser}
        key={joinNonNullStrings(Object.values(arbeidsforhold))}
        featureToggles={featureToggles}
      />
    );
  });
};

const Uttaksplan = ({
  behandlingUuid,
  aktiviteterBehandling = [],
  aktiviteterHittilIÅr = [],
  aktivitetsstatuser = [],
  aktiv,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  featureToggles
}: UttaksplanProps) => {
  const [valgtTabIndex, setValgtTabIndex] = useState<number>(0);

  return (
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
          behandlingUuid,
          aktiviteterBehandling,
          aktivitetsstatuser,
          arbeidsforhold,
          arbeidsgiverOpplysningerPerId,
          featureToggles
        )}
      {valgtTabIndex === 1 &&
        mapAktiviteterTilTabell(
          behandlingUuid,
          aktiviteterHittilIÅr,
          aktivitetsstatuser,
          arbeidsforhold,
          arbeidsgiverOpplysningerPerId,
          featureToggles
        )}
    </div>
  );
};

export default Uttaksplan;
