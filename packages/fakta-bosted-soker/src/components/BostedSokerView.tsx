import opplysningAdresseType from '@k9-sak-web/kodeverk/src/opplysningAdresseType';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import Region from '@k9-sak-web/kodeverk/src/region';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { getAddresses } from '@k9-sak-web/utils';
import { BodyShort, Detail, HGrid, Label, Tag } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import { BostedSokerPersonopplysninger } from '../BostedSokerFaktaIndex';

import styles from './bostedSokerView.module.css';

interface OwnProps {
  personopplysninger: BostedSokerPersonopplysninger;
  sokerTypeTextId: string;
  regionTypes: KodeverkMedNavn[];
  sivilstandTypes: KodeverkMedNavn[];
  personstatusTypes: KodeverkMedNavn[];
}

const getAdresse = adresser => {
  const adresseListe = getAddresses(adresser);
  const adresse = adresseListe[opplysningAdresseType.POSTADRESSE] || adresseListe[opplysningAdresseType.BOSTEDSADRESSE];
  return adresse || '-';
};

const getUtlandsadresse = adresser => {
  const adresseListe = getAddresses(adresser);
  const utlandsAdresse =
    adresseListe[opplysningAdresseType.UTENLANDSK_POSTADRESSE] ||
    adresseListe[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE];
  return utlandsAdresse || '-';
};

const getPersonstatus = personopplysning =>
  personopplysning.avklartPersonstatus && personopplysning.avklartPersonstatus.overstyrtPersonstatus
    ? personopplysning.avklartPersonstatus.overstyrtPersonstatus
    : personopplysning.personstatus;

export const BostedSokerView = ({
  intl,
  personopplysninger,
  sokerTypeTextId,
  regionTypes,
  sivilstandTypes,
  personstatusTypes,
}: OwnProps & WrappedComponentProps) => (
  <div className={styles.defaultBostedSoker}>
    <HGrid gap="4" columns={{ xs: '8fr 4fr' }}>
      <div>
        <Detail>
          <FormattedMessage id={sokerTypeTextId} />
        </Detail>
        <Label size="small" as="p">
          {personopplysninger.navn ? personopplysninger.navn : '-'}
        </Label>
        <BodyShort size="small" className={styles.paddingBottom}>
          {getAdresse(personopplysninger.adresser)}
        </BodyShort>
        <Detail>
          <FormattedMessage id="BostedSokerView.ForeignAddresse" />
        </Detail>
        <BodyShort size="small">{getUtlandsadresse(personopplysninger.adresser)}</BodyShort>
      </div>
      <div>
        {getPersonstatus(personopplysninger) && (
          <div className={styles.etikettMargin}>
            <Tag
              variant="warning"
              size="small"
              className={getPersonstatus(personopplysninger).kode === personstatusType.DOD ? styles.dodEtikett : ''}
              title={intl.formatMessage({ id: 'Personstatus.Hjelpetekst' })}
            >
              {getPersonstatus(personopplysninger).kode === personstatusType.UDEFINERT
                ? intl.formatMessage({ id: 'Personstatus.Ukjent' })
                : personstatusTypes.find(s => s.kode === getPersonstatus(personopplysninger).kode).navn}
            </Tag>
          </div>
        )}
        {personopplysninger.sivilstand && (
          <div className={styles.etikettMargin}>
            <Tag variant="warning" size="small" title={intl.formatMessage({ id: 'Sivilstand.Hjelpetekst' })}>
              {sivilstandTypes.find(s => s.kode === personopplysninger.sivilstand.kode).navn}
            </Tag>
          </div>
        )}
        {personopplysninger.region && personopplysninger.region.kode !== Region.UDEFINERT && (
          <div className={styles.etikettMargin}>
            <Tag variant="warning" size="small" title={intl.formatMessage({ id: 'BostedSokerView.Region' })}>
              {regionTypes.find(r => r.kode === personopplysninger.region.kode).navn}
            </Tag>
          </div>
        )}
      </div>
    </HGrid>
  </div>
);

export default injectIntl(BostedSokerView);
