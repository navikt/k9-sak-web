import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const buttonText = showDetails =>
  showDetails ? 'Avregning.headerText.VisFærreDetaljer' : 'Avregning.headerText.VisFlereDetaljer';

const CollapseButton = ({ toggleDetails, showDetails, mottakerIndex }) => (
  <Button
    size="small"
    type="button"
    className="-ml-3 -mt-1"
    onClick={() => toggleDetails(mottakerIndex)}
    icon={showDetails ? <ChevronUpIcon title="Ekspandert" /> : <ChevronDownIcon title="Lukket" />}
    iconPosition="right"
    variant="tertiary"
  >
    <FormattedMessage id={buttonText(showDetails)} />
  </Button>
);

export default CollapseButton;
