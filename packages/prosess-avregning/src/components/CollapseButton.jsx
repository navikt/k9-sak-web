import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const buttonText = showDetails =>
  showDetails ? 'Avregning.headerText.VisFærreDetaljer' : 'Avregning.headerText.VisFlereDetaljer';

const CollapseButton = ({ toggleDetails, showDetails, mottakerIndex }) => (
  <Button
    type="button"
    className="-ml-3 -mt-1"
    onClick={() => toggleDetails(mottakerIndex)}
    icon={showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
    iconPosition="right"
    variant="tertiary"
  >
    <FormattedMessage id={buttonText(showDetails)} />
  </Button>
);

CollapseButton.propTypes = {
  toggleDetails: PropTypes.func.isRequired,
  showDetails: PropTypes.bool.isRequired,
  mottakerIndex: PropTypes.number.isRequired,
};

export default CollapseButton;
