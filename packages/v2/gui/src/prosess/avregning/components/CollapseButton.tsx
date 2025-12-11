import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Bleed, Button } from '@navikt/ds-react';

const buttonText = (showDetails: boolean) => (showDetails ? 'Vis færre detaljer' : 'Vis flere detaljer');

interface OwnProps {
  toggleDetails: (id: number) => void;
  showDetails: boolean;
  mottakerIndex: number;
}

export const CollapseButton = ({ toggleDetails, showDetails, mottakerIndex }: OwnProps) => (
  <Bleed marginBlock="space-4 0" marginInline="space-12 0">
    <Button
      size="small"
      type="button"
      onClick={() => toggleDetails(mottakerIndex)}
      icon={showDetails ? <ChevronUpIcon title="Ekspandert" /> : <ChevronDownIcon title="Lukket" />}
      iconPosition="right"
      variant="tertiary"
    >
      {buttonText(showDetails)}
    </Button>
  </Bleed>
);
