import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType, KodeverkTypeV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { type ReactNode } from 'react';
import type { Fagsak } from '../../Fagsak';

interface OwnProps {
  saksnummer: string;
  fagsakYtelseType: Fagsak['sakstype'];
  fagsakStatus: string;
  renderBehandlingMeny: () => ReactNode;
  renderBehandlingVelger: () => ReactNode;
}

/**
 * FagsakProfile
 *
 * Presentasjonskomponent. Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
 */
export const FagsakProfile = ({
  saksnummer,
  fagsakYtelseType,
  fagsakStatus,
  renderBehandlingMeny,
  renderBehandlingVelger,
}: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    <>
      <VStack gap="space-8">
        <HStack justify="space-between" align="baseline">
          <Heading level="2" size="medium">
            {kodeverkNavnFraKode(fagsakYtelseType, KodeverkTypeV2.FAGSAK_YTELSE)}
          </Heading>
          <div>{renderBehandlingMeny()}</div>
        </HStack>
        <BodyShort size="small">{`${saksnummer} - ${kodeverkNavnFraKode(fagsakStatus, KodeverkType.FAGSAK_STATUS)}`}</BodyShort>
      </VStack>
      {renderBehandlingVelger()}
    </>
  );
};

export default FagsakProfile;
