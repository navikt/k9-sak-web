import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import Etikettfokus from 'nav-frontend-etiketter';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { getAddresses } from '@fpsak-frontend/utils';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import Region from '@fpsak-frontend/kodeverk/src/region';

import { BostedSokerPersonopplysninger } from '../BostedSokerFaktaIndex';

import styles from './bostedSokerView.less';

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
                : personstatusTypes.find(s => s.kode === getPersonstatus(personopplysninger)).navn}
            </Etikettfokus>
          </div>
        )}
        {personopplysninger.sivilstand && (
          <div className={styles.etikettMargin}>
            <Etikettfokus type="fokus" typo="undertekst" title={intl.formatMessage({ id: 'Sivilstand.Hjelpetekst' })}>
              {sivilstandTypes.find(s => s.kode === personopplysninger.sivilstand).navn}
            </Etikettfokus>
          </div>
        )}
        {personopplysninger.region && personopplysninger.region !== Region.UDEFINERT && (
          <div className={styles.etikettMargin}>
            <Etikettfokus type="fokus" typo="undertekst" title={intl.formatMessage({ id: 'BostedSokerView.Region' })}>
              {regionTypes.find(r => r.kode === personopplysninger.region).navn}
            </Etikettfokus>
          </div>
        )}
      </Column>
    </Row>
  </div>
);

export default injectIntl(BostedSokerView);
