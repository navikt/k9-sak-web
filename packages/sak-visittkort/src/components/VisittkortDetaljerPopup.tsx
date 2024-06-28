import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { FlexColumn, FlexContainer, FlexRow, Tooltip, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Adresser, getAddresses, getLanguageFromSprakkode } from '@fpsak-frontend/utils';
import { Personopplysninger } from '@k9-sak-web/types';
import { BodyShort, Label, Tag } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
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
  const { kodeverkNavnFraKode } = useKodeverkContext();

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
                <Tag variant="info" className={styles.etikett} size="small">
                  {kodeverkNavnFraKode(personopplysninger.region, KodeverkType.REGION)}
                </Tag>
              </Tooltip>
            </FlexColumn>
          )}
          <FlexColumn>
            <Tooltip
              content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Personstatus.Hjelpetekst' })}
              alignBottom
            >
              <Tag variant="info" className={styles.etikett} size="small">
                {kodeverkNavnFraKode(findPersonStatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE)}
              </Tag>
            </Tooltip>
          </FlexColumn>
          {personopplysninger.sivilstand && (
            <FlexColumn>
              <Tooltip
                content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Sivilstand.Hjelpetekst' })}
                alignBottom
              >
                <Tag variant="info" className={styles.etikett} size="small">
                  {kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
                </Tag>
              </Tooltip>
            </FlexColumn>
          )}
          {borMedBarnet && (
            <FlexColumn>
              <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.BorMedBarnet' })} alignBottom>
                <Tag variant="info" className={styles.etikett} size="small">
                  <FormattedMessage id="VisittkortDetaljerPopup.BorMedBarnet" />
                </Tag>
              </Tooltip>
            </FlexColumn>
          )}
          <FlexColumn>
            <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Malform.Beskrivelse' })} alignBottom>
              <Tag variant="info" className={styles.etikett} size="small">
                {getLanguageFromSprakkode(sprakkode)}
              </Tag>
            </Tooltip>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <BodyShort size="small">
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.bostedsadresse" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            <Label size="small" as="p">
              {adresser[opplysningAdresseType.BOSTEDSADRESSE] || '-'}
            </Label>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <BodyShort size="small">
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.postadresseNorge" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            <Label size="small" as="p">
              {adresser[opplysningAdresseType.POSTADRESSE] || '-'}
            </Label>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <BodyShort size="small">
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.midlertidigAdresse" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            <Label size="small" as="p">
              {midlertidigAdresse || '-'}
            </Label>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <BodyShort size="small">
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.postadresseUtland" />
            </BodyShort>
          </FlexColumn>
          <FlexColumn>
            <Label size="small" as="p">
              {adresser[opplysningAdresseType.UTENLANDSK_POSTADRESSE] || '-'}
            </Label>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default injectIntl(VisittkortDetaljerPopup);
