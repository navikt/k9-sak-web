import { k9_kodeverk_geografisk_AdresseType as adresseType } from '@k9-sak-web/backend/k9sak/generated';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, HStack, Label, Tag, Tooltip, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import getAddresses, { type Adresser } from '../../utils/getAddresses';
import { getLanguageFromspråkkode } from '../../utils/språkUtils';
import type { Personopplysninger } from './types/Personopplysninger';
import styles from './visittkortDetaljerPopup.module.css';

const borSokerMedBarnet = (adresser: Adresser, personopplysningerForBarn: Personopplysninger[] = []): boolean =>
  personopplysningerForBarn.some(
    barn =>
      barn.adresser && adresser[adresseType.BOSTEDSADRESSE] === getAddresses(barn.adresser)[adresseType.BOSTEDSADRESSE],
  );

const findPersonStatus = (personopplysning: Personopplysninger): string => {
  if (personopplysning.avklartPersonstatus) {
    return personopplysning.avklartPersonstatus.overstyrtPersonstatus;
  }
  return personopplysning.personstatus ? personopplysning.personstatus : '';
};

interface OwnProps {
  personopplysninger: Personopplysninger;
  språkkode?: string;
}

const VisittkortDetaljerPopup = ({ personopplysninger, språkkode }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const adresser = useMemo(() => getAddresses(personopplysninger.adresser ?? []), [personopplysninger.adresser]);
  const borMedBarnet = useMemo(() => borSokerMedBarnet(adresser, personopplysninger.barnSoktFor), [personopplysninger]);
  const midlertidigAdresse = adresser[adresseType.MIDLERTIDIG_POSTADRESSE_NORGE]
    ? adresser[adresseType.MIDLERTIDIG_POSTADRESSE_NORGE]
    : adresser[adresseType.MIDLERTIDIG_POSTADRESSE_UTLAND];

  return (
    <div className={styles.container}>
      <VStack gap="space-16">
        <HStack gap="space-16">
          {personopplysninger.region && (
            <Tooltip content="Statsborgerskap" placement="bottom">
              <Tag variant="info" className={styles.etikett} size="small">
                {kodeverkNavnFraKode(personopplysninger.region, KodeverkType.REGION)}
              </Tag>
            </Tooltip>
          )}
          <Tooltip content="Personstatus" placement="bottom">
            <Tag variant="info" className={styles.etikett} size="small">
              {kodeverkNavnFraKode(findPersonStatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE)}
            </Tag>
          </Tooltip>
          {personopplysninger.sivilstand && (
            <Tooltip content="Sivilstand" placement="bottom">
              <Tag variant="info" className={styles.etikett} size="small">
                {kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE)}
              </Tag>
            </Tooltip>
          )}
          {borMedBarnet && (
            <Tooltip content="Bor med barnet" placement="bottom">
              <Tag variant="info" className={styles.etikett} size="small">
                Bor med barnet
              </Tag>
            </Tooltip>
          )}
          <Tooltip content="Foretrukket språk" placement="bottom">
            <Tag variant="info" className={styles.etikett} size="small">
              {getLanguageFromspråkkode(språkkode)}
            </Tag>
          </Tooltip>
        </HStack>
        <VStack gap="space-8">
          <HStack gap="space-8">
            <div className={styles.labels}>
              <BodyShort size="small">Bostedsadresse</BodyShort>
            </div>
            <Label size="small" as="p">
              {adresser[adresseType.BOSTEDSADRESSE] || '-'}
            </Label>
          </HStack>
          <HStack gap="space-8">
            <div className={styles.labels}>
              <BodyShort size="small">Postadresse i Norge</BodyShort>
            </div>
            <Label size="small" as="p">
              {adresser[adresseType.POSTADRESSE] || '-'}
            </Label>
          </HStack>
          <HStack gap="space-8">
            <div className={styles.labels}>
              <BodyShort size="small">Midlertidig adresse</BodyShort>
            </div>
            <Label size="small" as="p">
              {midlertidigAdresse || '-'}
            </Label>
          </HStack>
          <HStack gap="space-8">
            <div className={styles.labels}>
              <BodyShort size="small">Postadresse i utlandet</BodyShort>
            </div>
            <Label size="small" as="p">
              {adresser[adresseType.POSTADRESSE_UTLAND] || '-'}
            </Label>
          </HStack>
        </VStack>
      </VStack>
    </div>
  );
};

export default VisittkortDetaljerPopup;
