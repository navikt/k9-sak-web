import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer } from '@fpsak-frontend/shared-components/index';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import Image from '@fpsak-frontend/shared-components/src/Image';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import { dateFormat } from '@fpsak-frontend/utils';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import classNames from 'classnames/bind';
import { Element, Undertekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { createIntl, createIntlCache, FormattedMessage, RawIntlProvider } from 'react-intl';
import isEqual from 'lodash.isequal';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import messages from '../i18n/nb_NO.json';
import styles from './sykdomProsessIndex.less';

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
    <Element>
      <FormattedMessage id={messageId} />
    </Element>
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
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={perioder.map((currentPeriode, currentPeriodeIndex) => ({
                active: perioder.findIndex(p => isEqual(p, activePeriode)) === currentPeriodeIndex,
                label: `${dateFormat(perioder[currentPeriodeIndex].periode.fom)} - ${dateFormat(
                  perioder[currentPeriodeIndex].periode.tom,
                )}`,
              }))}
              onClick={clickedIndex => {
                setActivePeriode(perioder[clickedIndex]);
              }}
              theme="arrow"
              heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
            />
          </div>
        )}
        <div className={styles.contentContainer}>
          <FlexContainer>
            <FlexRow>
              {erVilkarOk !== undefined && (
                <FlexColumn>
                  <Image className={styles.status} src={erVilkarOk ? innvilgetImage : avslattImage} />
                </FlexColumn>
              )}
              <FlexColumn>
                <Undertittel>
                  <FormattedMessage id={panelTittelKode} />
                </Undertittel>
              </FlexColumn>
              <FlexColumn>
                <Undertekst className={styles.vilkar}>{lovReferanseTekst}</Undertekst>
              </FlexColumn>
            </FlexRow>
            <FlexRow>
              <FlexColumn>
                <VerticalSpacer eightPx />
                {getVilkarOkMessage(erVilkarOk)}
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </div>
        <VerticalSpacer eightPx />
      </div>
    </RawIntlProvider>
  );
};

export default SykdomProsessIndex;
