import { Box, ToggleGroup } from '@navikt/ds-react';
import { ReactNode, useState } from 'react';

interface OwnProps {
  v1: ReactNode;
  v2: ReactNode;
}

/**
 * Lar bruker velge mellom v1 eller v2 av komponent. Tenkt brukt under regresjonstesting av v2
 */
const VersjonsvelgerV1V2 = ({ v1, v2 }: OwnProps) => {
  const [valgtVersjon, setValgtVersjon] = useState<'v1' | 'v2'>('v2');

  return (
    <Box marginBlock="space-0 space-4">
      <ToggleGroup
        value={valgtVersjon}
        onChange={value => setValgtVersjon(value as 'v1' | 'v2')}
        size="small"
        data-color="neutral"
        aria-label="Velg versjon av panelet"
      >
        <ToggleGroup.Item value="v2">Ny versjon</ToggleGroup.Item>
        <ToggleGroup.Item value="v1">Gammel versjon</ToggleGroup.Item>
      </ToggleGroup>
      {valgtVersjon === 'v1' ? v1 : v2}
    </Box>
  );
};

export default VersjonsvelgerV1V2;
