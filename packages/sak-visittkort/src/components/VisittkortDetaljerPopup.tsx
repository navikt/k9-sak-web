import { EtikettInfo } from 'nav-frontend-etiketter';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { useMemo } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import { useKodeverkV2 } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverk.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { FlexColumn, FlexContainer, FlexRow, Tooltip, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Adresser, getAddresses, getLanguageFromSprakkode } from '@fpsak-frontend/utils';
import { Personopplysninger } from '@k9-sak-web/types';

import styles from './visittkortDetaljerPopup.module.css';

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
  sprakkode?: string;
}

const VisittkortDetaljerPopup = ({ intl, personopplysninger, sprakkode }: OwnProps & WrappedComponentProps) => {
  const { kodeverkNavnFraKode } = useKodeverkV2();

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
                  {kodeverkNavnFraKode(personopplysninger.region, KodeverkType.REGION)}
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
                {kodeverkNavnFraKode(findPersonStatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE)}
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
                  {kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
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
