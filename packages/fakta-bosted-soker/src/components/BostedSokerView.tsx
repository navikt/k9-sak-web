import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import Region from '@fpsak-frontend/kodeverk/src/region';
import { getAddresses } from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort, Detail, HGrid, Label, Tag } from '@navikt/ds-react';

import { Adresse, BostedSokerPersonopplysninger } from '../types';
import styles from './bostedSokerView.module.css';

interface OwnProps {
  personopplysninger: BostedSokerPersonopplysninger;
  sokerTypeText: string;
  regionTypes: KodeverkMedNavn[];
  sivilstandTypes: KodeverkMedNavn[];
  personstatusTypes: KodeverkMedNavn[];
}

const getAdresse = (adresser: Adresse[]) => {
  const adresseListe = getAddresses(adresser);
  const adresse = adresseListe[opplysningAdresseType.POSTADRESSE] || adresseListe[opplysningAdresseType.BOSTEDSADRESSE];
  return adresse || '-';
};

const getUtlandsadresse = (adresser: Adresse[]) => {
  const adresseListe = getAddresses(adresser);
  const utlandsAdresse =
    adresseListe[opplysningAdresseType.UTENLANDSK_POSTADRESSE] ||
    adresseListe[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE];
  return utlandsAdresse || '-';
};

const getPersonstatus = (personopplysning: BostedSokerPersonopplysninger) =>
  personopplysning.avklartPersonstatus && personopplysning.avklartPersonstatus.overstyrtPersonstatus
    ? personopplysning.avklartPersonstatus.overstyrtPersonstatus
    : personopplysning.personstatus;

export const BostedSokerView = ({
  personopplysninger,
  sokerTypeText,
  regionTypes,
  sivilstandTypes,
  personstatusTypes,
}: OwnProps) => (
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
              className={getPersonstatus(personopplysninger).kode === personstatusType.DOD ? styles.dodEtikett : ''}
              title="Personstatus"
            >
              {getPersonstatus(personopplysninger).kode === personstatusType.UDEFINERT
                ? 'Ukjent'
                : personstatusTypes.find(s => s.kode === getPersonstatus(personopplysninger).kode).navn}
            </Tag>
          </div>
        )}
        {personopplysninger.sivilstand && (
          <div className={styles.etikettMargin}>
            <Tag variant="warning" size="small" title="Sivilstand">
              {sivilstandTypes.find(s => s.kode === personopplysninger.sivilstand.kode).navn}
            </Tag>
          </div>
        )}
        {personopplysninger.region && personopplysninger.region.kode !== Region.UDEFINERT && (
          <div className={styles.etikettMargin}>
            <Tag variant="warning" size="small" title="Region">
              {regionTypes.find(r => r.kode === personopplysninger.region.kode).navn}
            </Tag>
          </div>
        )}
      </div>
    </HGrid>
  </div>
);

export default BostedSokerView;
