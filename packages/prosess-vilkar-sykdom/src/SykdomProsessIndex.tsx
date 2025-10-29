import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer } from '@fpsak-frontend/shared-components/index';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Detail, Heading, HStack, Label } from '@navikt/ds-react';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import styles from './sykdomProsessIndex.module.css';

const cx = classNames.bind(styles);

const getVilkarOkMessage = originalErVilkarOk => {
  let messageText = 'Ikke behandlet';
  if (originalErVilkarOk) {
    messageText = 'Vilkåret er oppfylt';
  } else if (originalErVilkarOk === false) {
    messageText = 'Vilkåret er ikke oppfylt';
  }

  return (
    <Label size="small" as="p">
      {messageText}
    </Label>
  );
};

interface UtvidetVilkarperiode extends Vilkarperiode {
  pleietrengendeErOver18år?: boolean;
}

interface SykdomProsessIndexProps {
  perioder: UtvidetVilkarperiode[];
  panelTittelKode: string;
  lovReferanse?: string;
}

const SykdomProsessIndex = ({ perioder, panelTittelKode, lovReferanse }: SykdomProsessIndexProps) => {
  const [activePeriode, setActivePeriode] = React.useState(perioder[0]);
  const status = activePeriode?.vilkarStatus.kode || vilkarUtfallType.IKKE_VURDERT;
  const erOppfylt = vilkarUtfallType.OPPFYLT === status;
  const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const skalBrukeSidemeny = perioder.length > 1;
  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });
  let lovReferanseTekst = '§ 9-10 første og andre ledd, og 9-16 første ledd';

  if (activePeriode?.pleietrengendeErOver18år) {
    lovReferanseTekst = '§ 9-10 tredje ledd (over 18 år)';
  }

  // Oppplæringspenger || livets sluttfase
  if (lovReferanse === '§ 9-14' || lovReferanse === '§ 9-13') {
    lovReferanseTekst = lovReferanse;
  }

  return (
          <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={perioder.map((currentPeriode, currentPeriodeIndex) => ({
                active: perioder.findIndex(p => isEqual(p, activePeriode)) === currentPeriodeIndex,
                label: `${formatDate(perioder[currentPeriodeIndex].periode.fom)} - ${formatDate(
                  perioder[currentPeriodeIndex].periode.tom,
                )}`,
              }))}
              onClick={clickedIndex => {
                setActivePeriode(perioder[clickedIndex]);
              }}
              heading={"Perioder"}
            />
          </div>
        )}
        <div className={styles.contentContainer}>
          <FlexContainer>
            <HStack gap="space-16">
              {erVilkarOk !== undefined && (
                <>
                  {erVilkarOk ? (
                    <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
                  ) : (
                    <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
                  )}
                </>
              )}
              <Heading size="small" level="2">
                {panelTittelKode}
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
        <VerticalSpacer eightPx />
      </div>  );
};

export default SykdomProsessIndex;
