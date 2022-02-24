import React from 'react';

import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { UtenlandsoppholdPerioder } from '@k9-sak-web/types';
import { PeriodList } from '@navikt/k9-react-components';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import styles from './utenlandsopphold.less';

countries.registerLocale(norwegianLocale);

const finnÅrsaker = (periode, erEØS) => {
  if (erEØS) {
    return 'Ikke relevant innenfor EØS, telles ikke i 8 uker.';
  }
  return periode?.årsak?.navn || 'Ukjent årsak';
};

const mapItems = periode => {
  const erEØS = periode.region.kode === 'NORDEN' || periode.region.kode === 'EOS';

  const land = { label: 'Land', value: countries.getName(periode.landkode.kode, 'no') };
  const eos = { label: 'EØS', value: erEØS ? 'Ja' : 'Nei' };
  const årsak = { label: 'Årsak', value: finnÅrsaker(periode, erEØS) };

  return [land, eos, årsak];
};
export default function Utenlandsopphold({ utenlandsopphold }: { utenlandsopphold: UtenlandsoppholdPerioder }) {
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
          tittel="I hvilke tilfeller har søker rett på pleiepenger ved utenlandsopphold?"
          className={styles.utenlandsopphold__info}
        >
          <BodyLong spacing size="small">
            Det er et vilkår for rett til pleiepenger at medlemmet oppholder seg i Norge/EØS.
          </BodyLong>
          <BodyLong spacing size="small">
            Det gis likevel ytelser etter dette kapitlet ved opphold i utlandet til en person som er medlem etter §§
            2-5, 2-6 eller 2-8 et medlem som har omsorgen for et barn som er innlagt i helseinstitusjon for norsk
            offentlig regning, eller der barnet får oppholdet dekket etter avtale med et annet land om trygd.{' '}
          </BodyLong>
          <BodyLong spacing size="small">
            Et medlem kan også ellers få ytelser etter dette kapitlet i inntil åtte uker i løpet av en
            tolvmånedersperiode. Medlemmet skal informere Arbeids- og velferdsetaten om utenlandsoppholdet.
          </BodyLong>
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
