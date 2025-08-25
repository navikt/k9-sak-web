import { Box } from '@navikt/ds-react';

interface VilkårComponentProps {
  children: React.ReactNode;
}

export const VilkårComponent = ({ children }: VilkårComponentProps) => (
  <Box.New padding="4" borderRadius="xlarge" style={{ backgroundColor: '#EEF6FC' }} maxWidth="730px">
    {children}
  </Box.New>
);
