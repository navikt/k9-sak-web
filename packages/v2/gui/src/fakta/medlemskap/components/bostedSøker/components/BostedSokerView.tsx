import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import getAddresses from '@k9-sak-web/gui/utils/getAddresses.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Detail, HGrid, Label, Tag } from '@navikt/ds-react';
import {
  type k9_sak_kontrakt_person_PersonadresseDto as PersonadresseDto,
  k9_kodeverk_geografisk_AdresseType as PersonadresseDtoAdresseType,
  k9_kodeverk_person_PersonstatusType as PersonopplysningDtoPersonstatus,
  k9_kodeverk_geografisk_Region as PersonopplysningDtoRegion,
} from '@navikt/k9-sak-typescript-client';
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
      <HGrid gap="4" columns={{ xs: '8fr 4fr' }}>
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
                variant="warning"
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
              <Tag variant="warning" size="small" title="Sivilstand">
                {kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
              </Tag>
            </div>
          )}
          {personopplysninger.region && personopplysninger.region !== PersonopplysningDtoRegion.UDEFINERT && (
            <div className={styles.etikettMargin}>
              <Tag variant="warning" size="small" title="Region">
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
