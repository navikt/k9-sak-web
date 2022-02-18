import React from 'react';

import { Kodeverk, UtenlandsoppholdPerioder } from '@k9-sak-web/types';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PeriodeListe from './PeriodeListe';
import styles from './utenlandsopphold.less';

const mapItems = periode => {
  const erEØS = periode.region.kode === 'NORDEN' || periode.region.kode === 'EOS';

  const land = { label: 'Land', value: periode.landkode.navn };
  const eos = { label: 'EØS', value: erEØS ? 'Ja' : 'Nei' };
  const årsak = { label: 'Årsak', value: 'finnårsak func' };

  return [land, eos];
};
export default function Utenlandsopphold({
  utenlandsopphold,
  kodeverk,
}: {
  utenlandsopphold: UtenlandsoppholdPerioder;
  kodeverk: Kodeverk;
}) {
  const perioder = utenlandsopphold?.perioder;

  if (!perioder || !perioder.length) {
    return <>Ingen utenlandsopphold å vise.</>;
  }

  const perioderFomTom = perioder.map(periode => {
    const [fom, tom] = periode.periode.split('/');
    return { fom, tom, items: [] };
  });

  return (
    <div className={styles.utenlandsopphold}>
      <Heading spacing size="small" level="4">
        Utenlandsopphold
      </Heading>
      <Alert variant="info">
        <BodyLong spacing size="small">
          Det er et vilkår for rett til pleiepenger at medlemmet oppholder seg i Norge/EØS.
        </BodyLong>
        <BodyLong spacing size="small">
          Det gis likevel ytelser etter dette kapitlet ved opphold i utlandet til en person som er medlem etter §§ 2-5,
          2-6 eller 2-8 et medlem som har omsorgen for et barn som er innlagt i helseinstitusjon for norsk offentlig
          regning, eller der barnet får oppholdet dekket etter avtale med et annet land om trygd.{' '}
        </BodyLong>
        <BodyLong spacing size="small">
          Et medlem kan også ellers få ytelser etter dette kapitlet i inntil åtte uker i løpet av en
          tolvmånedersperiode. Medlemmet skal informere Arbeids- og velferdsetaten om utenlandsoppholdet.
        </BodyLong>
      </Alert>
      <VerticalSpacer fourtyPx />
      <PeriodeListe perioder={[...perioderFomTom]} tittel="Perioder i utlandet" />
    </div>
  );
}
