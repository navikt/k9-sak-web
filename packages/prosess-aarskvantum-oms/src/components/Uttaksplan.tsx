import kalender from '@fpsak-frontend/assets/images/calendar_filled.svg';
import { Image } from '@fpsak-frontend/shared-components/index';
import { joinNonNullStrings } from '@fpsak-frontend/utils';
import { ArbeidsforholdV2, ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import { Alert, Heading, Tabs } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';
import styles from './uttaksplan.module.css';

interface UttaksplanProps {
  behandlingUuid: string;
  aktiviteterBehandling: Aktivitet[];
  aktiviteterHittilIÅr: Aktivitet[];
  aktiv: boolean;
  aktivitetsstatuser: KodeverkMedNavn[];
  arbeidsforhold: ArbeidsforholdV2[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const mapAktiviteterTilTabell = (
  behandlingUuid: string,
  aktiviteter: Aktivitet[],
  aktivitetsstatuser: KodeverkMedNavn[],
  alleArbeidsforhold: ArbeidsforholdV2[],
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
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
}: UttaksplanProps) => {
  const [valgtTabIndex, setValgtTabIndex] = useState<number>(0);
  const tabs = [
    { label: <FormattedMessage id="Uttaksplan.DenneBehandling" />, key: 'Uttaksplan.DenneBehandling' },
    { label: <FormattedMessage id="Uttaksplan.HittilIÅr" />, key: 'Uttaksplan.HittilIÅr' },
  ];
  return (
    <div className={styles.uttaksboks}>
      <div className={styles.overskrift}>
        {!aktiv && (
          <Alert size="small" variant="info" className={styles.alertstripe}>
            <FormattedMessage id="Uttaksplan.Inaktiv" />
          </Alert>
        )}
        <Heading size="small" level="3">
          <Image src={kalender} />
          <FormattedMessage id="Uttaksplan.Heading" />
        </Heading>
      </div>
      <Tabs defaultValue="0">
        <Tabs.List>
          {tabs.map((tab, index) => (
            <Tabs.Tab key={tab.key} value={`${index}`} label={tab.label} onClick={() => setValgtTabIndex(index)} />
          ))}
        </Tabs.List>
      </Tabs>
      {valgtTabIndex === 0 &&
        mapAktiviteterTilTabell(
          behandlingUuid,
          aktiviteterBehandling,
          aktivitetsstatuser,
          arbeidsforhold,
          arbeidsgiverOpplysningerPerId,
        )}
      {valgtTabIndex === 1 &&
        mapAktiviteterTilTabell(
          behandlingUuid,
          aktiviteterHittilIÅr,
          aktivitetsstatuser,
          arbeidsforhold,
          arbeidsgiverOpplysningerPerId,
        )}
    </div>
  );
};

export default Uttaksplan;
