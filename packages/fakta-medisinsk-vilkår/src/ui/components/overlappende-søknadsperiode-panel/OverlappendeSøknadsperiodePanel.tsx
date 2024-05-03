import { Period, prettifyPeriodList } from '@k9-sak-web/utils';
import { BodyShort, Button } from '@navikt/ds-react';
import { InfoPanel } from '@navikt/ft-plattform-komponenter';
import React from 'react';

interface OverlappendeSøknadsperiodePanelProps {
  onProgressButtonClick: () => void;
  overlappendeVurderingsperioder: Period[];
}

const OverlappendeSøknadsperiodePanel = ({
  onProgressButtonClick,
  overlappendeVurderingsperioder,
}: OverlappendeSøknadsperiodePanelProps): JSX.Element => (
  <InfoPanel type="warning">
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
  </InfoPanel>
);

export default OverlappendeSøknadsperiodePanel;
