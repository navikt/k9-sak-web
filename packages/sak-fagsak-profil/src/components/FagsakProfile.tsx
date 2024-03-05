import React, { ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';

import { useKodeverkV2 } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverk.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer, Tooltip } from '@fpsak-frontend/shared-components';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

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
 * Presentasjonskomponent
 *
 *  Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
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
        fagsak profile
        <FlexRow spaceBetween alignItemsToBaseline>
          <FlexColumn>
            <FlexRow wrap>
              <FlexColumn>
                <Systemtittel>{kodeverkNavnFraKode(fagsakYtelseType, KodeverkType.FAGSAK_YTELSE)}</Systemtittel>
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
            <Normaltekst>{`${saksnummer} - ${kodeverkNavnFraKode(fagsakStatus, KodeverkType.FAGSAK_STATUS)}`}</Normaltekst>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      {renderBehandlingVelger()}
    </>
  );
};

export default injectIntl(FagsakProfile);
