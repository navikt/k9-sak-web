import { Box } from '@navikt/ds-react';

interface VilkårComponentProps {
  children: React.ReactNode;
}

export const VilkårComponent = ({ children }: VilkårComponentProps) => (
  <Box padding="space-16" borderRadius="12" style={{ backgroundColor: '#EEF6FC' }} maxWidth="730px">
    {children}
  </Box>
);
