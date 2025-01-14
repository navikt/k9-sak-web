import { adresseType } from '@k9-sak-web/backend/k9sak/generated';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, HStack, Label, Tag, Tooltip, VStack, type TooltipProps } from '@navikt/ds-react';
import { useMemo } from 'react';
import getAddresses, { type Adresser } from '../../utils/getAddresses';
import { getLanguageFromSprakkode } from '../../utils/språkUtils';
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
  sprakkode?: string;
}

const VisittkortDetaljerPopup = ({ personopplysninger, sprakkode }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const adresser = useMemo(() => getAddresses(personopplysninger.adresser ?? []), [personopplysninger.adresser]);
  const borMedBarnet = useMemo(() => borSokerMedBarnet(adresser, personopplysninger.barnSoktFor), [personopplysninger]);
  const midlertidigAdresse = adresser[adresseType.MIDLERTIDIG_POSTADRESSE_NORGE]
    ? adresser[adresseType.MIDLERTIDIG_POSTADRESSE_NORGE]
    : adresser[adresseType.MIDLERTIDIG_POSTADRESSE_UTLAND];

  const renderTag = (content: string, tooltip: TooltipProps['content']) => (
    <Tooltip content={tooltip} placement="bottom">
      <Tag variant="info" className={styles.etikett} size="small">
        {content}
      </Tag>
    </Tooltip>
  );

  return (
    <div className={styles.container}>
      <VStack gap="4">
        <HStack gap="4">
          {personopplysninger.region &&
            renderTag(kodeverkNavnFraKode(personopplysninger.region, KodeverkType.REGION), 'Statsborgerskap')}
          {renderTag(
            kodeverkNavnFraKode(findPersonStatus(personopplysninger), KodeverkType.PERSONSTATUS_TYPE),
            'Personstatus',
          )}
          {personopplysninger.sivilstand &&
            renderTag(kodeverkNavnFraKode(personopplysninger.sivilstand, KodeverkType.SIVILSTAND_TYPE), 'Sivilstand')}
          {borMedBarnet && renderTag('Bor med barnet', 'Bor med barnet')}
          {renderTag(getLanguageFromSprakkode(sprakkode), 'Foretrukket språk')}
        </HStack>
        <VStack gap="2">
          <HStack gap="4">
            <div className={styles.labels}>
              <BodyShort size="small">Bostedsadresse</BodyShort>
            </div>
            <Label size="small" as="p">
              {adresser[adresseType.BOSTEDSADRESSE] || '-'}
            </Label>
          </HStack>
          <HStack gap="4">
            <div className={styles.labels}>
              <BodyShort size="small">Postadresse i Norge</BodyShort>
            </div>
            <Label size="small" as="p">
              {adresser[adresseType.POSTADRESSE] || '-'}
            </Label>
          </HStack>
          <HStack gap="4">
            <div className={styles.labels}>
              <BodyShort size="small">Midlertidig adresse</BodyShort>
            </div>
            <Label size="small" as="p">
              {midlertidigAdresse || '-'}
            </Label>
          </HStack>
          <HStack gap="4">
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
