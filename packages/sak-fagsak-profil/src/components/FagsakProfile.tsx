import { EtikettInfo } from 'nav-frontend-etiketter';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FlexColumn, FlexContainer, FlexRow, Tooltip, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Heading } from '@navikt/ds-react';

const visSakDekningsgrad = (saksKode: string, dekningsgrad?: number): boolean => {
  const erForeldrepenger = saksKode === FagsakYtelseType.FORELDREPENGER;
  const gyldigDekningsGrad = dekningsgrad === 100 || dekningsgrad === 80;

  return erForeldrepenger && gyldigDekningsGrad;
};

interface OwnProps {
  saksnummer: string;
  fagsakYtelseType: KodeverkMedNavn;
  fagsakStatus: KodeverkMedNavn;
  renderBehandlingMeny: () => ReactNode;
  renderBehandlingVelger: () => ReactNode;
  dekningsgrad?: number;
}

/**
 * FagsakProfile
 *
 * Presentasjonskomponent. Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
 */
export const FagsakProfile = ({
  saksnummer,
  fagsakYtelseType,
  fagsakStatus,
  renderBehandlingMeny,
  renderBehandlingVelger,
  dekningsgrad,
  intl,
}: OwnProps & WrappedComponentProps) => (
  <>
    <FlexContainer>
      <FlexRow spaceBetween alignItemsToBaseline>
        <FlexColumn>
          <FlexRow wrap>
            <FlexColumn>
              <Heading level="2" size="medium">
                {fagsakYtelseType.navn}
              </Heading>
            </FlexColumn>
            {visSakDekningsgrad(fagsakYtelseType.kode, dekningsgrad) && (
              <FlexColumn>
                <Tooltip
                  content={intl.formatMessage({ id: 'FagsakProfile.Dekningsgrad' }, { dekningsgrad })}
                  alignBottom
                >
                  <EtikettInfo>{`${dekningsgrad}%`}</EtikettInfo>
                </Tooltip>
              </FlexColumn>
            )}
          </FlexRow>
        </FlexColumn>
        <FlexColumn>{renderBehandlingMeny()}</FlexColumn>
      </FlexRow>
      <VerticalSpacer eightPx />
      <FlexRow>
        <FlexColumn>
          <Normaltekst>{`${saksnummer} - ${fagsakStatus.navn}`}</Normaltekst>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    {renderBehandlingVelger()}
  </>
);

export default injectIntl(FagsakProfile);
