import Region from '@fpsak-frontend/kodeverk/src/region';
import {
  PersonadresseDtoAdresseType,
  PersonopplysningDtoPersonstatus,
  type PersonadresseDto,
  type PersonopplysningDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Detail, HGrid, Label, Tag } from '@navikt/ds-react';
import { useKodeverkContext } from '../../../../../kodeverk/hooks/useKodeverkContext';
import getAddresses from '../../../../../utils/getAddresses';
import styles from './bostedSokerView.module.css';

interface OwnProps {
  personopplysninger: PersonopplysningDto;
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

const getPersonstatus = (personopplysning: PersonopplysningDto) =>
  personopplysning.avklartPersonstatus && personopplysning.avklartPersonstatus.overstyrtPersonstatus
    ? personopplysning.avklartPersonstatus.overstyrtPersonstatus
    : personopplysning.personstatus;

export const BostedSokerView = ({ personopplysninger, sokerTypeText }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
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
          {getPersonstatus(personopplysninger) && (
            <div className={styles.etikettMargin}>
              <Tag
                variant="warning"
                size="small"
                className={
                  getPersonstatus(personopplysninger) === PersonopplysningDtoPersonstatus.DØD ? styles.dodEtikett : ''
                }
                title="Personstatus"
              >
                {getPersonstatus(personopplysninger) === PersonopplysningDtoPersonstatus.UDEFINERT
                  ? 'Ukjent'
                  : kodeverkNavnFraKode(getPersonstatus(personopplysninger) ?? '', KodeverkType.PERSONSTATUS_TYPE)}
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
          {personopplysninger.region && personopplysninger.region !== Region.UDEFINERT && (
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
