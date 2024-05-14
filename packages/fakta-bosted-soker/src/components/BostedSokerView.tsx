import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { BodyShort, Detail, Label, HGrid, Tag } from '@navikt/ds-react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import Region from '@fpsak-frontend/kodeverk/src/region';
import { getAddresses } from '@fpsak-frontend/utils';
import { useKodeverkV2 } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverk.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { BostedSokerPersonopplysninger } from '../BostedSokerFaktaIndex';
import styles from './bostedSokerView.module.css';

interface OwnProps {
  personopplysninger: BostedSokerPersonopplysninger;
  sokerTypeTextId: string;
}

const getAdresse = (adresser: BostedSokerPersonopplysninger['adresser']) => {
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

const getPersonstatus = (personopplysning: BostedSokerPersonopplysninger) =>
  personopplysning.avklartPersonstatus && personopplysning.avklartPersonstatus.overstyrtPersonstatus
    ? personopplysning.avklartPersonstatus.overstyrtPersonstatus
    : personopplysning.personstatus;

export const BostedSokerView = ({ intl, personopplysninger, sokerTypeTextId }: OwnProps & WrappedComponentProps) => {
  const { kodeverkNavnFraKode } = useKodeverkV2();
  return (
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
                className={getPersonstatus(personopplysninger) === personstatusType.DOD ? styles.dodEtikett : ''}
                title={intl.formatMessage({ id: 'Personstatus.Hjelpetekst' })}
              >
                {getPersonstatus(personopplysninger) === personstatusType.UDEFINERT
                  ? intl.formatMessage({ id: 'Personstatus.Ukjent' })
                  : kodeverkNavnFraKode(getPersonstatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE)}
              </Tag>
            </div>
          )}
          {personopplysninger.sivilstand && (
            <div className={styles.etikettMargin}>
              <Tag variant="warning" size="small" title={intl.formatMessage({ id: 'Sivilstand.Hjelpetekst' })}>
                {kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
              </Tag>
            </div>
          )}
          {personopplysninger.region && personopplysninger.region !== Region.UDEFINERT && (
            <div className={styles.etikettMargin}>
              <Tag variant="warning" size="small" title={intl.formatMessage({ id: 'BostedSokerView.Region' })}>
                {kodeverkNavnFraKode(personopplysninger.region, KodeverkType.REGION)}
              </Tag>
            </div>
          )}
        </div>
      </HGrid>
    </div>
  );
};
export default injectIntl(BostedSokerView);
