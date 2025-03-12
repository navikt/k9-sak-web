import { Vilkarperiode } from "@k9-sak-web/types";
import React, {useState} from "react";
import vilkarUtfallType from "@fpsak-frontend/kodeverk/src/vilkarUtfallType";
import {createIntl, createIntlCache, FormattedMessage, RawIntlProvider} from "react-intl";
import classNames from "classnames/bind";
import styles from "@k9-sak-web/prosess-vilkar-sykdom/src/sykdomProsessIndex.module.css";
import messages from "@k9-sak-web/prosess-vilkar-sykdom/i18n/nb_NO.json";
import {SideMenu} from "@navikt/ft-plattform-komponenter";
import isEqual from "lodash/isEqual";
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import {FlexColumn, FlexContainer} from "@fpsak-frontend/shared-components";
import {Detail, Heading, HStack, Label} from "@navikt/ds-react";
import {CheckmarkCircleFillIcon, XMarkOctagonFillIcon} from "@navikt/aksel-icons";
import FlexRow from "@fpsak-frontend/shared-components/src/flexGrid/FlexRow";
import VerticalSpacer from "@fpsak-frontend/shared-components/src/VerticalSpacer";
import {Lovreferanse} from "@k9-sak-web/gui/shared/lovreferanse/Lovreferanse";

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const getVilkarOkMessage = originalErVilkarOk => {
  let messageId = 'VilkarresultatMedOverstyringForm.IkkeBehandlet';
  if (originalErVilkarOk) {
    messageId = 'VilkarresultatMedOverstyringForm.ErOppfylt';
  } else if (originalErVilkarOk === false) {
    messageId = 'VilkarresultatMedOverstyringForm.ErIkkeOppfylt';
  }

  return (
    <Label size="small" as="p">
      <FormattedMessage id={messageId} />
    </Label>
  );
};

interface LangvarigSykVilkarProsessIndexProps {
  perioder: Vilkarperiode[];
}

const LangvarigSykVilkarProsessIndex = ({ perioder, panelTittelKode }: LangvarigSykVilkarProsessIndexProps) => {
  const [aktivPeriode, setAktivPeriode] = useState<Vilkarperiode>(perioder[0]);
  const status = aktivPeriode?.vilkarStatus.kode;
  const erOppfylt = vilkarUtfallType.OPPFYLT === status;
  const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const skalBrukeSidemeny = perioder.length > 1;
  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });
  const lovReferanseTekst = '§ 9-14'

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        { skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={perioder.map((currentPeriode, currentPeriodeIndex) => ({
                active: perioder.findIndex(p => isEqual(p, aktivPeriode)) === currentPeriodeIndex,
                label: `${formatDate(perioder[currentPeriodeIndex].periode.fom)} - ${formatDate(
                  perioder[currentPeriodeIndex].periode.tom,
                )}`,
              }))}
              onClick={clickedIndex => {
                setAktivPeriode(perioder[clickedIndex]);
              }}
              heading={intl.formatMessage({id: 'Sidemeny.Perioder'})}
            />
          </div>
        )}
        <div className={mainContainerClassnames}>
          <FlexContainer>
            <HStack gap="4">
              {erVilkarOk !== undefined && (
                <>
                  {erVilkarOk ? (
                    <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
                  ) : (
                    <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
                  )}
                </>
              )}
              <Heading size="small" level="2">
                <FormattedMessage id={panelTittelKode} />
              </Heading>
              <Detail className={styles.vilkar}>
                <Lovreferanse>{lovReferanseTekst}</Lovreferanse>
              </Detail>
            </HStack>
            <FlexRow>
              <FlexColumn>
                <VerticalSpacer eightPx />
                {getVilkarOkMessage(erVilkarOk)}
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </div>
      </div>
    </RawIntlProvider>
  )
}

export default LangvarigSykVilkarProsessIndex;
