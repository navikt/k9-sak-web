import type { UtenlandsoppholdPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Region } from '@k9-sak-web/backend/k9sak/kodeverk/geografisk/Region.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { PeriodList } from '@k9-sak-web/gui/shared/periodList/PeriodList.js';
import { ytelseVisningsnavn } from '@k9-sak-web/gui/utils/ytelseVisningsnavn.js';
import { Alert, Heading, ReadMore } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import { useContext } from 'react';
import { UtenlandsoppholdApiContext } from './api/UtenlandsoppholdApiContext.js';
import styles from './utenlandsopphold.module.css';

countries.registerLocale(norwegianLocale);

interface UtenlandsoppholdIndexProps {
  behandlingUuid: string;
  fagsakYtelseType?: FagsakYtelsesType;
}

const erEØSRegion = (periode: UtenlandsoppholdPeriodeDto): boolean => {
  const landkode = periode.landkode?.kode;
  return periode.region === Region.NORDEN || (periode.region === Region.EOS && landkode !== 'GBR');
};

const vurderesMotEØSRegelverk = (landkode?: string): string => (landkode === 'CHE' ? '*' : '');

const hentLandNavn = (landkode?: string): string => {
  if (!landkode) return 'Ukjent land';
  if (landkode === 'XXK') return 'Kosovo';
  return countries.getName(landkode, 'no') ?? 'Ukjent land';
};

const UtenlandsoppholdIndex = ({ behandlingUuid, fagsakYtelseType }: UtenlandsoppholdIndexProps) => {
  const api = useContext(UtenlandsoppholdApiContext);
  if (!api) throw new Error('UtenlandsoppholdApiContext not provided');

  const { data: utenlandsopphold } = useSuspenseQuery({
    queryKey: ['utenlandsopphold', behandlingUuid],
    queryFn: () => api.getUtenlandsopphold(behandlingUuid),
  });

  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const finnÅrsak = (periode: UtenlandsoppholdPeriodeDto): string => {
    const erEØS = erEØSRegion(periode);
    if (erEØS || periode.landkode?.kode === 'CHE') {
      return 'Periode telles ikke.';
    }
    if (!periode.årsak) return 'Ukjent årsak';
    const årsak = kodeverkoppslag?.k9sak.utenlandsoppholdÅrsaker(periode.årsak, OrUndefined);
    return årsak?.navn ?? 'Ukjent årsak';
  };

  const mapItems = (periode: UtenlandsoppholdPeriodeDto) => {
    const erEØS = erEØSRegion(periode);
    const landkode = periode.landkode?.kode;
    const eøsStatus = erEØS ? 'Ja' : `Nei${vurderesMotEØSRegelverk(landkode)}`;

    return [
      { label: 'Land', value: hentLandNavn(landkode) },
      { label: 'EØS', value: eøsStatus },
      { label: 'Merknad til utenlandsopphold', value: finnÅrsak(periode) },
    ];
  };

  const perioder = utenlandsopphold?.perioder ?? [];
  const harUtenlandsopphold = perioder.length > 0;

  const perioderMedItems = perioder.map(periode => {
    const [fom = '', tom = ''] = (periode.periode ?? '/').split('/');
    return { fom, tom, items: mapItems(periode) };
  });

  const erPleiepenger = fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
  const ytelseTekst = ytelseVisningsnavn(fagsakYtelseType);

  return (
    <div className={styles['utenlandsopphold']}>
      <Heading spacing size="small" level="4">
        Utenlandsopphold
      </Heading>
      <Alert variant="info" className={styles['alertstripe']}>
        <ReadMore header={`Hvor lenge har søker rett på ${ytelseTekst.ytelseNavnUbestemt} i utlandet?`} size="small">
          <ul>
            <li>
              Opphold innenfor EØS likestilles med opphold i Norge, og det er ingen tidsbegrensning på hvor lenge søker
              kan motta {ytelseTekst.ytelseNavnUbestemt}.
            </li>
            <li>
              For opphold utenfor EØS skal perioden med ytelse i utgangspunktet begrenses til 8 uker i løpet av en
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
            <li>Vilkårene for rett til {ytelseTekst.ytelseNavnUbestemt} må være oppfylt hele perioden.</li>
            {erPleiepenger && (
              <li>
                Det utbetales ikke {ytelseTekst.ytelseNavnUbestemt} når søker avvikler ferie. Utenlandsopphold i en
                periode med ferie telles derfor ikke med, uavhengig av årsaken til utenlandsoppholdet.
              </li>
            )}
          </ul>
        </ReadMore>
      </Alert>
      {harUtenlandsopphold ? (
        <>
          <PeriodList perioder={[...perioderMedItems]} tittel="Perioder i utlandet" />
          {perioder.some(periode => vurderesMotEØSRegelverk(periode.landkode?.kode)) && (
            <div>{`*) Ikke en del av EØS, men vurderes mot EØS-regelverk`}</div>
          )}
        </>
      ) : (
        <>Søker har ingen utenlandsopphold å vise.</>
      )}
    </div>
  );
};

export default UtenlandsoppholdIndex;
