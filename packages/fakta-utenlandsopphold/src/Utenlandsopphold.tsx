/* eslint-disable react/jsx-curly-brace-presence */
import ytelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { UtenlandsoppholdPerioder, UtenlandsoppholdType } from '@k9-sak-web/types';
import { Alert, Heading, ReadMore } from '@navikt/ds-react';
import { PeriodList } from '@navikt/ft-plattform-komponenter';
import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import React from 'react';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import styles from './utenlandsopphold.module.css';

countries.registerLocale(norwegianLocale);

const Utenlandsopphold = ({
  utenlandsopphold,
  fagsakYtelseType,
}: {
  utenlandsopphold: UtenlandsoppholdPerioder;
  fagsakYtelseType?: string;
}) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  const finnÅrsaker = (periode: UtenlandsoppholdType, erEØS) => {
    if (erEØS) {
      return 'Periode telles ikke.';
    }
    return kodeverkNavnFraKode(periode.årsak, KodeverkType.UTLANDSOPPHOLD_AARSAK, undefined, 'Ukjent årsak');
  };

  const vurderesMotEØSRegelverk = (landkode: string) => {
    const land = ['CHE'];
    if (land.includes(landkode)) {
      return '*';
    }
    return '';
  };

  const mapItems = (periode: UtenlandsoppholdType) => {
    const erEØS = periode.region === 'NORDEN' || periode.region === 'EOS';

    const land = { label: 'Land', value: countries.getName(periode.landkode, 'no') };
    const eos = { label: 'EØS', value: erEØS ? 'Ja' : `Nei${vurderesMotEØSRegelverk(periode.landkode)}` };
    const årsak = { label: 'Merknad til utenlandsopphold', value: finnÅrsaker(periode, erEØS) };

    return [land, eos, årsak];
  };

  const perioder = utenlandsopphold?.perioder;

  const harUtenlandsopphold = perioder?.length;

  const perioderMedItems = perioder?.map(periode => {
    const [fom, tom] = periode.periode.split('/');
    return { fom, tom, items: mapItems(periode) };
  });

  const erPleiepenger = fagsakYtelseType === ytelseType.PLEIEPENGER;

  return (
    <div className={styles.utenlandsopphold}>
      <Heading spacing size="small" level="4">
        Utenlandsopphold
      </Heading>
      <Alert variant="info" className={styles.alertstripe}>
        <ReadMore header="Hvor lenge har søker rett på pleiepenger i utlandet?" size="small">
          <ul>
            <li>
              Opphold innenfor EØS likestilles med opphold i Norge, og det er ingen tidsbegrensning på hvor lenge søker
              kan motta pleiepenger.
            </li>
            <li>
              For opphold utenfor EØS skal perioden med pleiepenger i utgangspunktet begrenses til 8 uker i løpet av en
              periode på 12 måneder.
            </li>
            {erPleiepenger && (
              <li>
                <div>Opphold utenfor EØS har likevel ingen tidsbegrensning dersom</div>
                <ul>
                  <li>barnet er innlagt i helseinstitusjon for norsk offentlig regning</li>
                  <li>barnet er innlagt i helseinstitusjon og oppholdet dekkes av trygdeordning med annet land</li>
                  <li>søker er medlem etter §§ 2-5, 2-6 eller 2-8</li>
                </ul>
              </li>
            )}
            <li>Vilkårene for rett til pleiepenger må være oppfylt hele perioden.</li>
            {erPleiepenger && (
              <li>
                Det utbetales ikke pleiepenger når søker avvikler ferie. Utenlandsopphold i en periode med ferie telles
                derfor ikke med, uavhengig av årsaken til utenlandsoppholdet.
              </li>
            )}
          </ul>
        </ReadMore>
      </Alert>
      <VerticalSpacer fourtyPx />
      {harUtenlandsopphold ? (
        <>
          <PeriodList perioder={[...perioderMedItems]} tittel="Perioder i utlandet" />
          {perioder.some(periode => vurderesMotEØSRegelverk(periode.landkode)) && (
            <div>{`*) Ikke en del av EØS, men vurderes mot EØS-regelverk`}</div>
          )}
        </>
      ) : (
        <>Søker har ingen utenlandsopphold å vise.</>
      )}
    </div>
  );
};

export default Utenlandsopphold;
