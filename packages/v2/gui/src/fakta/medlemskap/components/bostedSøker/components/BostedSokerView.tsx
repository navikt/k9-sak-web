import type { PersonadresseDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonadresseDto.js';
import { adresseType as PersonadresseDtoAdresseType } from '@k9-sak-web/backend/k9sak/kodeverk/geografisk/adresseType.js';
import { personstatus as PersonopplysningDtoPersonstatus } from '@k9-sak-web/backend/k9sak/kodeverk/person/personstatus.js';
import { PersonopplysningDtoRegion } from '@k9-sak-web/backend/k9sak/kodeverk/geografisk/PersonopplysningDtoRegion.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import getAddresses from '@k9-sak-web/gui/utils/getAddresses.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Detail, HGrid, Label, Tag } from '@navikt/ds-react';
import type { Foreldre } from '../../../types/FormState';
import styles from './bostedSokerView.module.css';

interface OwnProps {
  personopplysninger: Foreldre['personopplysning'];
  sokerTypeText?: string;
}

const getAdresse = (adresser?: PersonadresseDto[]) => {
  const adresseListe = getAddresses(adresser);
  const adresse =
    adresseListe[PersonadresseDtoAdresseType.POSTADRESSE] || adresseListe[PersonadresseDtoAdresseType.BOSTEDSADRESSE];
  return adresse || '-';
};

const getUtlandsadresse = (adresser?: PersonadresseDto[]) => {
  const adresseListe = getAddresses(adresser);
  const utlandsAdresse =
    adresseListe[PersonadresseDtoAdresseType.POSTADRESSE_UTLAND] ||
    adresseListe[PersonadresseDtoAdresseType.MIDLERTIDIG_POSTADRESSE_UTLAND];
  return utlandsAdresse || '-';
};

const getPersonstatus = (personopplysning: Foreldre['personopplysning']) =>
  personopplysning.avklartPersonstatus && personopplysning.avklartPersonstatus.overstyrtPersonstatus
    ? personopplysning.avklartPersonstatus.overstyrtPersonstatus
    : personopplysning.personstatus;

export const BostedSokerView = ({ personopplysninger, sokerTypeText }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const personstatus = getPersonstatus(personopplysninger);
  return (
    <div className={styles.defaultBostedSoker}>
      <HGrid gap="space-16" columns={{ xs: '8fr 4fr' }}>
        <div>
          <Detail>{sokerTypeText}</Detail>
          <Label size="small" as="p">
            {personopplysninger.navn ? personopplysninger.navn : '-'}
          </Label>
          <BodyShort size="small" className={styles.paddingBottom}>
            {getAdresse(personopplysninger.adresser)}
          </BodyShort>
          <Detail>Utenlandsadresse</Detail>
          <BodyShort size="small">{getUtlandsadresse(personopplysninger.adresser)}</BodyShort>
        </div>
        <div>
          {personstatus && (
            <div className={styles.etikettMargin}>
              <Tag
                data-color="warning"
                variant="outline"
                size="small"
                className={personstatus === PersonopplysningDtoPersonstatus.DØD ? styles.dodEtikett : ''}
                title="Personstatus"
              >
                {personstatus === PersonopplysningDtoPersonstatus.UDEFINERT
                  ? 'Ukjent'
                  : kodeverkNavnFraKode(personstatus ?? '', KodeverkType.PERSONSTATUS_TYPE)}
              </Tag>
            </div>
          )}
          {personopplysninger.sivilstand && (
            <div className={styles.etikettMargin}>
              <Tag data-color="warning" variant="outline" size="small" title="Sivilstand">
                {kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
              </Tag>
            </div>
          )}
          {personopplysninger.region && personopplysninger.region !== PersonopplysningDtoRegion.UDEFINERT && (
            <div className={styles.etikettMargin}>
              <Tag data-color="warning" variant="outline" size="small" title="Region">
                {kodeverkNavnFraKode(personopplysninger.region, KodeverkType.REGION)}
              </Tag>
            </div>
          )}
        </div>
      </HGrid>
    </div>
  );
};

export default BostedSokerView;
