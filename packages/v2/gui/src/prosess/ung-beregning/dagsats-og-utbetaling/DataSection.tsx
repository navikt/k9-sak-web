import type { UngdomsprogramInformasjonDto } from '@k9-sak-web/backend/ungsak/generated';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import styles from './dataSection.module.css';

const DataBox = ({ children, maxHeight }: { children: React.ReactNode; maxHeight?: string }) => (
  <div className={styles.dataBox} style={{ maxHeight }}>
    <VStack gap="4">{children}</VStack>
  </div>
);

interface DataSectionProps {
  ungdomsprogramInformasjon: UngdomsprogramInformasjonDto | undefined;
}

export const DataSection = ({ ungdomsprogramInformasjon }: DataSectionProps) => {
  return (
    <HStack>
      <DataBox maxHeight="185px">
        <HStack gap="2" marginInline="05 0">
          <InformationSquareIcon color="#417DA0" fontSize="1.5rem" />
          <Label as="p">Nøkkelinformasjon</Label>
        </HStack>
        <HStack gap="4">
          <BodyShort size="small">
            <b>Startdato:</b>{' '}
            {ungdomsprogramInformasjon?.startdato ? formatDate(ungdomsprogramInformasjon?.startdato) : ''}
          </BodyShort>
          {ungdomsprogramInformasjon?.maksdatoForDeltakelse && (
            <BodyShort size="small">
              <b>Maksdato:</b> {formatDate(ungdomsprogramInformasjon?.maksdatoForDeltakelse)}
            </BodyShort>
          )}
          {ungdomsprogramInformasjon?.opphørsdato && (
            <BodyShort size="small">
              <b>Sluttdato:</b> {formatDate(ungdomsprogramInformasjon?.opphørsdato)}
            </BodyShort>
          )}
        </HStack>
      </DataBox>
    </HStack>
  );
};
