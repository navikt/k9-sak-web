import { FlexColumn, FlexContainer, FlexRow } from '@k9-sak-web/shared-components';
import { Risikoklassifisering } from '@k9-sak-web/types';
import { decodeHtmlEntity } from '@k9-sak-web/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface OwnProps {
  risikoklassifisering: Risikoklassifisering;
}

/**
 * Faresignaler
 *
 * Presentasjonskomponent. Viser en liste over faresignaler knyttet til behandlingen.
 */
const Faresignaler = ({ risikoklassifisering }: OwnProps) => (
  <FlexContainer>
    {risikoklassifisering.medlFaresignaler && risikoklassifisering.medlFaresignaler.faresignaler && (
      <div>
        <FlexRow>
          <FlexColumn>
            <Label size="small" as="p">
              <FormattedMessage id="Risikopanel.Panel.Medlemskap" />
            </Label>
            <ul>
              {risikoklassifisering.medlFaresignaler.faresignaler.map(faresignal => (
                <li key={faresignal}>
                  <BodyShort size="small">{decodeHtmlEntity(faresignal)}</BodyShort>
                </li>
              ))}
            </ul>
          </FlexColumn>
        </FlexRow>
      </div>
    )}
    {risikoklassifisering.iayFaresignaler && risikoklassifisering.iayFaresignaler.faresignaler && (
      <div>
        <FlexRow>
          <FlexColumn>
            <Label size="small" as="p">
              <FormattedMessage id="Risikopanel.Panel.ArbeidsforholdInntekt" />
            </Label>
            <ul>
              {risikoklassifisering.iayFaresignaler.faresignaler.map(faresignal => (
                <li key={faresignal}>
                  <BodyShort size="small">{decodeHtmlEntity(faresignal)}</BodyShort>
                </li>
              ))}
            </ul>
          </FlexColumn>
        </FlexRow>
      </div>
    )}
  </FlexContainer>
);

export default Faresignaler;
