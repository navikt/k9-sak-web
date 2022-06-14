import React from 'react';

import { Alert, Heading } from '@navikt/ds-react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { KodeverkMedNavn, UtenlandsoppholdPerioder } from '@k9-sak-web/types';
import { PeriodList } from '@navikt/k9-react-components';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import styles from './utenlandsopphold.less';

countries.registerLocale(norwegianLocale);

export default function Utenlandsopphold({
  utenlandsopphold,
  kodeverk,
}: {
  utenlandsopphold: UtenlandsoppholdPerioder;
  kodeverk: { UtenlandsoppholdÅrsak: KodeverkMedNavn[] };
}) {
  const finnÅrsaker = (periode, erEØS) => {
    if (erEØS) {
      return 'Periode telles ikke.';
    }

    return kodeverk?.UtenlandsoppholdÅrsak?.find(v => v.kode === periode?.årsak)?.navn || 'Ukjent årsak';
  };

  const mapItems = periode => {
    const erEØS = periode.region === 'NORDEN' || periode.region === 'EOS';

    const land = { label: 'Land', value: countries.getName(periode.landkode, 'no') };
    const eos = { label: 'EØS', value: erEØS ? 'Ja' : 'Nei' };
    const årsak = { label: 'Merknad til utenlandsopphold', value: finnÅrsaker(periode, erEØS) };

    return [land, eos, årsak];
  };

  const perioder = utenlandsopphold?.perioder;

  const harUtenlandsopphold = perioder?.length;

  const perioderMedItems = perioder?.map(periode => {
    const [fom, tom] = periode.periode.split('/');
    return { fom, tom, items: mapItems(periode) };
  });

  return (
    <div className={styles.utenlandsopphold}>
      <Heading spacing size="small" level="4">
        Utenlandsopphold
      </Heading>
      <Alert variant="info" className={styles.alertstripe}>
        <Ekspanderbartpanel
          tittel="Hvor lenge har søker rett på pleiepenger i utlandet?"
          className={styles.utenlandsopphold__info}
        >
          <ul>
            <li>
              Opphold innenfor EØS likestilles med opphold i Norge, og det er ingen tidsbegrensning på hvor lenge søker
              kan motta pleiepenger.
            </li>
            <li>
              For opphold utenfor EØS skal perioden med pleiepenger i utgangspunktet begrenses til 8 uker i løpet av en
              periode på 12 måneder.
            </li>
            <li>
              <div>Opphold utenfor EØS har likevel ingen tidsbegrensning dersom</div>
              <ul>
                <li>barnet er innlagt i helseinstitusjon for norsk offentlig regning</li>
                <li>barnet er innlagt i helseinstitusjon og oppholdet dekkes av trygdeordning med annet land</li>
                <li>søker er medlem etter §§ 2-5, 2-6 eller 2-8</li>
              </ul>
            </li>
            <li>Vilkårene for rett til pleiepenger må være oppfylt hele perioden.</li>
            <li>
              Det utbetales ikke pleiepenger når søker avvikler ferie. Utenlandsopphold i en periode med ferie telles
              derfor ikke med, uavhengig av årsaken til utenlandsoppholdet.
            </li>
          </ul>
        </Ekspanderbartpanel>
      </Alert>
      <VerticalSpacer fourtyPx />
      {harUtenlandsopphold ? (
        <PeriodList perioder={[...perioderMedItems]} tittel="Perioder i utlandet" />
      ) : (
        <>Søker har ingen utenlandsopphold å vise.</>
      )}
    </div>
  );
}
