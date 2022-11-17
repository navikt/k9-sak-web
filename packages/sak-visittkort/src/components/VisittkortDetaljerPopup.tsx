import React, { useMemo } from 'react';
import { injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { KodeverkMedNavn, Personopplysninger } from '@k9-sak-web/types';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer, Tooltip } from '@fpsak-frontend/shared-components';

import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { getKodeverknavnFn, getLanguageFromSprakkode, getAddresses, Adresser } from '@fpsak-frontend/utils';

import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import styles from './visittkortDetaljerPopup.less';

const borSokerMedBarnet = (adresser: Adresser, personopplysningerForBarn: Personopplysninger[] = []): boolean =>
  personopplysningerForBarn.some(
    barn =>
      adresser[opplysningAdresseType.BOSTEDSADRESSE] ===
      getAddresses(barn.adresser)[opplysningAdresseType.BOSTEDSADRESSE],
  );

const findPersonStatus = (personopplysning: Personopplysninger): string => {
  if (personopplysning.avklartPersonstatus) {
    return personopplysning.avklartPersonstatus.overstyrtPersonstatus;
  }
  return personopplysning.personstatus ? personopplysning.personstatus : undefined;
};

interface OwnProps {
  personopplysninger: Personopplysninger;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  sprakkode?: string;
}

const VisittkortDetaljerPopup = ({
  intl,
  personopplysninger,
  alleKodeverk,
  sprakkode,
}: OwnProps & WrappedComponentProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk);
  const adresser = useMemo(() => getAddresses(personopplysninger.adresser), [personopplysninger.adresser]);
  const borMedBarnet = useMemo(() => borSokerMedBarnet(adresser, personopplysninger.barnSoktFor), [personopplysninger]);
  const midlertidigAdresse = adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
    ? adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
    : adresser[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE];

  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          {personopplysninger.region && (
            <FlexColumn>
              <Tooltip
                content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Statsborgerskap.Hjelpetekst' })}
                alignBottom
              >
                <EtikettInfo className={styles.etikett} typo="undertekst">
                  {getKodeverknavn(personopplysninger.region, KodeverkType.REGION)}
                </EtikettInfo>
              </Tooltip>
            </FlexColumn>
          )}
          <FlexColumn>
            <Tooltip
              content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Personstatus.Hjelpetekst' })}
              alignBottom
            >
              <EtikettInfo className={styles.etikett} typo="undertekst">
                {getKodeverknavn(findPersonStatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE)}
              </EtikettInfo>
            </Tooltip>
          </FlexColumn>
          {personopplysninger.sivilstand && (
            <FlexColumn>
              <Tooltip
                content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Sivilstand.Hjelpetekst' })}
                alignBottom
              >
                <EtikettInfo className={styles.etikett} typo="undertekst">
                  {getKodeverknavn(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
                </EtikettInfo>
              </Tooltip>
            </FlexColumn>
          )}
          {borMedBarnet && (
            <FlexColumn>
              <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.BorMedBarnet' })} alignBottom>
                <EtikettInfo className={styles.etikett} typo="undertekst">
                  <FormattedMessage id="VisittkortDetaljerPopup.BorMedBarnet" />
                </EtikettInfo>
              </Tooltip>
            </FlexColumn>
          )}
          <FlexColumn>
            <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Malform.Beskrivelse' })} alignBottom>
              <EtikettInfo className={styles.etikett} typo="undertekst">
                {getLanguageFromSprakkode(sprakkode)}
              </EtikettInfo>
            </Tooltip>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.bostedsadresse" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>{adresser[opplysningAdresseType.BOSTEDSADRESSE] || '-'}</Element>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.postadresseNorge" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>{adresser[opplysningAdresseType.POSTADRESSE] || '-'}</Element>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.midlertidigAdresse" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>{midlertidigAdresse || '-'}</Element>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.postadresseUtland" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>{adresser[opplysningAdresseType.UTENLANDSK_POSTADRESSE] || '-'}</Element>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default injectIntl(VisittkortDetaljerPopup);
