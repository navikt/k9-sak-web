import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import Etikettfokus from 'nav-frontend-etiketter';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
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
      <Row>
        <Column xs="8">
          <Undertekst>
            <FormattedMessage id={sokerTypeTextId} />
          </Undertekst>
          <Element>{personopplysninger.navn ? personopplysninger.navn : '-'}</Element>
          <Normaltekst className={styles.paddingBottom}>{getAdresse(personopplysninger.adresser)}</Normaltekst>
          <Undertekst>
            <FormattedMessage id="BostedSokerView.ForeignAddresse" />
          </Undertekst>
          <Normaltekst>{getUtlandsadresse(personopplysninger.adresser)}</Normaltekst>
        </Column>
        <Column xs="4">
          {getPersonstatus(personopplysninger) && (
            <div className={styles.etikettMargin}>
              <Etikettfokus
                className={getPersonstatus(personopplysninger) === personstatusType.DOD ? styles.dodEtikett : ''}
                type="fokus"
                typo="undertekst"
                title={intl.formatMessage({ id: 'Personstatus.Hjelpetekst' })}
              >
                {getPersonstatus(personopplysninger) === personstatusType.UDEFINERT
                  ? intl.formatMessage({ id: 'Personstatus.Ukjent' })
                  : kodeverkNavnFraKode(getPersonstatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE)}
              </Etikettfokus>
            </div>
          )}
          {personopplysninger.sivilstand && (
            <div className={styles.etikettMargin}>
              <Etikettfokus type="fokus" typo="undertekst" title={intl.formatMessage({ id: 'Sivilstand.Hjelpetekst' })}>
                {kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
              </Etikettfokus>
            </div>
          )}
          {personopplysninger.region && personopplysninger.region !== Region.UDEFINERT && (
            <div className={styles.etikettMargin}>
              <Etikettfokus type="fokus" typo="undertekst" title={intl.formatMessage({ id: 'BostedSokerView.Region' })}>
                {kodeverkNavnFraKode(personopplysninger.region, KodeverkType.REGION)}
              </Etikettfokus>
            </div>
          )}
        </Column>
      </Row>
    </div>
  );
};

export default injectIntl(BostedSokerView);
