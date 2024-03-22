import React, { ReactNode } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { BodyShort, Heading } from '@navikt/ds-react';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FlexColumn, FlexContainer, FlexRow, Tooltip, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { useKodeverkV2 } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverk.js';

const visSakDekningsgrad = (saksKode: string, dekningsgrad?: number): boolean => {
  const erForeldrepenger = saksKode === FagsakYtelseType.FORELDREPENGER;
  const gyldigDekningsGrad = dekningsgrad === 100 || dekningsgrad === 80;

  return erForeldrepenger && gyldigDekningsGrad;
};

interface OwnProps {
  saksnummer: string;
  fagsakYtelseType: string;
  fagsakStatus: string;
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
}: OwnProps & WrappedComponentProps) => {
  const { kodeverkNavnFraKode } = useKodeverkV2();
  return (
    <>
      <FlexContainer>
        <FlexRow spaceBetween alignItemsToBaseline>
          <FlexColumn>
            <FlexRow wrap>
              <FlexColumn>
                <Heading level="2" size="medium" className="-ml-2">
                  {kodeverkNavnFraKode(fagsakYtelseType, KodeverkType.FAGSAK_YTELSE)}
                </Heading>
              </FlexColumn>
              {visSakDekningsgrad(fagsakYtelseType, dekningsgrad) && (
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
            <BodyShort size="small">{`${saksnummer} - ${kodeverkNavnFraKode(fagsakStatus, KodeverkType.FAGSAK_STATUS)}`}</BodyShort>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      {renderBehandlingVelger()}
    </>
  );
};

export default injectIntl(FagsakProfile);
