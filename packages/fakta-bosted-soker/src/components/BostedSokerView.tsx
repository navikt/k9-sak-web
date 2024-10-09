import React from 'react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import Region from '@fpsak-frontend/kodeverk/src/region';
import { getAddresses } from '@fpsak-frontend/utils';
import { BodyShort, Detail, HGrid, Label, Tag } from '@navikt/ds-react';

import { Adresse, BostedSokerPersonopplysninger } from '../types';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import styles from './bostedSokerView.module.css';

interface OwnProps {
  personopplysninger: BostedSokerPersonopplysninger;
  sokerTypeText: string;
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
                className={getPersonstatus(personopplysninger) === personstatusType.DOD ? styles.dodEtikett : ''}
                title="Personstatus"
              >
                {getPersonstatus(personopplysninger) === personstatusType.UDEFINERT
                  ? 'Ukjent'
                  : kodeverkNavnFraKode(getPersonstatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE)}
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
