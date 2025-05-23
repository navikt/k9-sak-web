import { Period, prettifyPeriodList } from '@fpsak-frontend/utils';
import { BodyShort, Box, Button } from '@navikt/ds-react';
import { type JSX } from 'react';

interface OverlappendeSøknadsperiodePanelProps {
  onProgressButtonClick: () => void;
  overlappendeVurderingsperioder: Period[];
}

const OverlappendeSøknadsperiodePanel = ({
  onProgressButtonClick,
  overlappendeVurderingsperioder,
}: OverlappendeSøknadsperiodePanelProps): JSX.Element => (
  <Box padding="4" borderColor="border-warning" borderWidth="2">
    <BodyShort size="small">
      {`Søknadsperioden overlapper med en eller flere tidligere vurderte perioder
                (${prettifyPeriodList(
                  overlappendeVurderingsperioder,
                )}). Vurder om det er grunnlag for å gjøre en ny vurdering for
                denne perioden.`}
    </BodyShort>
    <Button size="small" onClick={onProgressButtonClick} style={{ marginTop: '1rem' }}>
      Utført, eventuelle nye vurderinger er registrert
    </Button>
  </Box>
);

export default OverlappendeSøknadsperiodePanel;
