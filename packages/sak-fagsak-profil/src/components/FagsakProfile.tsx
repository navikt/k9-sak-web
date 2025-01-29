import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkTypeV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort, Heading, Tag, Tooltip } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';

const visSakDekningsgrad = (saksKode: FagsakYtelsesType, dekningsgrad?: number): boolean => {
  const erForeldrepenger = saksKode === fagsakYtelsesType.FORELDREPENGER;
  const gyldigDekningsGrad = dekningsgrad === 100 || dekningsgrad === 80;

  return erForeldrepenger && gyldigDekningsGrad;
};

interface OwnProps {
  saksnummer: string;
  fagsakYtelseType: FagsakYtelsesType;
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
}: OwnProps & WrappedComponentProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    <>
      <FlexContainer>
        <FlexRow spaceBetween alignItemsToBaseline>
          <FlexColumn>
            <FlexRow wrap>
              <FlexColumn>
                <Heading level="2" size="medium" className="-ml-2">
                  {kodeverkNavnFraKode(fagsakYtelseType, KodeverkTypeV2.FAGSAK_YTELSE)}
                </Heading>
              </FlexColumn>
              {visSakDekningsgrad(fagsakYtelseType, dekningsgrad) && (
                <FlexColumn>
                  <Tooltip
                    content={intl.formatMessage({ id: 'FagsakProfile.Dekningsgrad' }, { dekningsgrad })}
                    placement="bottom"
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
};

export default injectIntl(FagsakProfile);
