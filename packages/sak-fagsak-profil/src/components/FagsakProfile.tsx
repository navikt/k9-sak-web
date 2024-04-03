import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FlexColumn, FlexContainer, FlexRow, Tooltip, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort, Heading, Tag } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

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
              <Heading level="2" size="medium" className="-ml-2">
                {fagsakYtelseType.navn}
              </Heading>
            </FlexColumn>
            {visSakDekningsgrad(fagsakYtelseType.kode, dekningsgrad) && (
              <FlexColumn>
                <Tooltip
                  content={intl.formatMessage({ id: 'FagsakProfile.Dekningsgrad' }, { dekningsgrad })}
                  alignBottom
                >
                  <Tag variant="info">{`${dekningsgrad}%`}</Tag>
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
          <BodyShort size="small">{`${saksnummer} - ${fagsakStatus.navn}`}</BodyShort>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    {renderBehandlingVelger()}
  </>
);

export default injectIntl(FagsakProfile);
