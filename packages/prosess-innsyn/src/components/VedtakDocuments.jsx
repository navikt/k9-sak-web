import { BodyShort, HGrid } from '@navikt/ds-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { DateLabel, VerticalSpacer } from '@k9-sak-web/shared-components';

/* TODO Ta i bruk fpsakApi - Flytt url ut av komponent */
const DOCUMENT_SERVER_URL = '/k9/sak/api/vedtak/hent-vedtaksdokument';
const getLink = document => `${DOCUMENT_SERVER_URL}?behandlingId=${document.dokumentId}`;

/**
 * VedtakDocuments
 *
 * Presentasjonskomponent.
 */
class VedtakDocuments extends Component {
  constructor() {
    super();

    this.toggleDocuments = this.toggleDocuments.bind(this);
    this.state = {
      showDocuments: false,
    };
  }

  toggleDocuments(evt) {
    this.setState(prevState => ({
      showDocuments: !prevState.showDocuments,
    }));
    evt.preventDefault();
  }

  render() {
    const { vedtaksdokumenter, behandlingTypes } = this.props;
    const { showDocuments } = this.state;
    return (
      <>
        <a href="" onClick={this.toggleDocuments} className="lenke lenke--frittstaende">
          <BodyShort size="small">
            <FormattedMessage
              id="DocumentListInnsyn.Vedtaksdokumentasjon"
              values={{ numberOfDocuments: vedtaksdokumenter.length }}
            />
            <i
              className={classNames(
                'nav-frontend-chevron chevronboks ',
                showDocuments ? 'chevron--ned' : 'chevron--opp',
              )}
            />
          </BodyShort>
        </a>
        {showDocuments && (
          <>
            <VerticalSpacer fourPx />
            {vedtaksdokumenter.map(document => (
              <HGrid gap="1" columns={{ xs: '2fr 10fr' }} key={document.dokumentId}>
                <DateLabel dateString={document.opprettetDato} />
                <div>
                  <a
                    href={getLink(document)}
                    className="lenke lenke--frittstaende"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {behandlingTypes.find(bt => bt.kode === document.tittel).navn}
                  </a>
                </div>
              </HGrid>
            ))}
          </>
        )}
      </>
    );
  }
}

VedtakDocuments.propTypes = {
  behandlingTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  vedtaksdokumenter: PropTypes.arrayOf(
    PropTypes.shape({
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string.isRequired,
      opprettetDato: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default VedtakDocuments;
