/* eslint-disable react/jsx-curly-brace-presence */
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { PeriodList } from '@k9-sak-web/gui/shared/periodList/PeriodList.js';
import { KodeverkMedNavn, UtenlandsoppholdPerioder, UtenlandsoppholdType } from '@k9-sak-web/types';
import { ytelseVisningsnavn } from '@k9-sak-web/gui/utils/ytelseVisningsnavn.js';
import { Alert, Heading, ReadMore } from '@navikt/ds-react';
import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import styles from './utenlandsopphold.module.css';

countries.registerLocale(norwegianLocale);

const Utenlandsopphold = ({
  utenlandsopphold,
  kodeverk,
  fagsakYtelseType,
}: {
  utenlandsopphold: UtenlandsoppholdPerioder;
  kodeverk: { UtenlandsoppholdÅrsak: KodeverkMedNavn[] };
  fagsakYtelseType?: FagsakYtelsesType;
}) => {
  const finnÅrsaker = (periode: UtenlandsoppholdType, erEØS: boolean) => {
    if (erEØS || periode.landkode.kode === 'CHE') {
      return 'Periode telles ikke.';
    }

    return kodeverk?.UtenlandsoppholdÅrsak?.find(v => v.kode === periode?.årsak)?.navn || 'Ukjent årsak';
  };

  // Sveits vurderes på lik linje med EØS-land
  const vurderesMotEØSRegelverk = (landkode: string) => {
    const land = ['CHE'];
    if (land.includes(landkode)) {
      return '*';
    }
    return '';
  };

  const mapItems = (periode: UtenlandsoppholdType) => {
    // Storbritannia ligger som EØS-land i kodeverket. Frem til det er fjernet derfra må det spesialhåndteres her.
    const erEØS = () =>
      periode.region.kode === 'NORDEN' || (periode.region.kode === 'EOS' && periode.landkode.kode !== 'GBR');

    const hentLand = () => {
      // Kosovo har en spesiell kode i kodeverk som ikke samsvarer med ISO-koden i i18n-iso-countries
      if (periode.landkode.kode === 'XXK') {
        return { label: 'Land', value: 'Kosovo' };
      }
      return { label: 'Land', value: countries.getName(periode.landkode.kode, 'no') ?? 'Ukjent land' };
    };

    const hentEØSStatus = () => {
      const eøsStatus = erEØS() ? 'Ja' : `Nei${vurderesMotEØSRegelverk(periode.landkode.kode)}`;
      return { label: 'EØS', value: eøsStatus };
    };

    const hentÅrsak = () => ({ label: 'Merknad til utenlandsopphold', value: finnÅrsaker(periode, erEØS()) });

    return [hentLand(), hentEØSStatus(), hentÅrsak()];
  };

  const perioder = utenlandsopphold?.perioder;

  const harUtenlandsopphold = perioder?.length;

  const perioderMedItems = perioder?.map(periode => {
    const [fom, tom] = periode.periode.split('/');
    return { fom, tom, items: mapItems(periode) };
  });

  const erPleiepenger = fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
  const ytelseTekst = ytelseVisningsnavn(fagsakYtelseType);

  return (
    <div className={styles.utenlandsopphold}>
      <Heading spacing size="small" level="4">
        Utenlandsopphold
      </Heading>
      <Alert variant="info" className={styles.alertstripe}>
        <ReadMore header={`Hvor lenge har søker rett på ${ytelseTekst.ytelseNavnUbestemt} i utlandet?`} size="small">
          <ul>
            <li>
              Opphold innenfor EØS likestilles med opphold i Norge, og det er ingen tidsbegrensning på hvor lenge søker
              kan motta ${ytelseTekst.ytelseNavnUbestemt}.
            </li>
            <li>
              For opphold utenfor EØS skal perioden med pleiepenger/opplæringspenger i utgangspunktet begrenses til 8
              uker i løpet av en periode på 12 måneder.
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
            <li>Vilkårene for rett til ${ytelseTekst.ytelseNavnUbestemt} må være oppfylt hele perioden.</li>
            {erPleiepenger && (
              <li>
                Det utbetales ikke ${ytelseTekst.ytelseNavnUbestemt} når søker avvikler ferie. Utenlandsopphold i en
                periode med ferie telles derfor ikke med, uavhengig av årsaken til utenlandsoppholdet.
              </li>
            )}
          </ul>
        </ReadMore>
      </Alert>
      <VerticalSpacer fourtyPx />
      {harUtenlandsopphold ? (
        <>
          <PeriodList perioder={[...perioderMedItems]} tittel="Perioder i utlandet" />
          {perioder.some(periode => vurderesMotEØSRegelverk(periode.landkode.kode)) && (
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
