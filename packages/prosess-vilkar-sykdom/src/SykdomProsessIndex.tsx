import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer } from '@fpsak-frontend/shared-components/index';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import Image from '@fpsak-frontend/shared-components/src/Image';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import SideMenu from '@navikt/nap-side-menu';
import classNames from 'classnames/bind';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { createIntl, createIntlCache, FormattedMessage, RawIntlProvider } from 'react-intl';
import { dateFormat } from '@fpsak-frontend/utils';
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

const SykdomProsessIndex = ({ panelTittelKode, lovReferanse, vilkar }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const activeVilkår = vilkar[0];
  const activePeriode = activeVilkår?.perioder[activeTab];
  const status = activePeriode.vilkarStatus.kode;
  const erOppfylt = vilkarUtfallType.OPPFYLT === status;
  const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const skalBrukeSidemeny = activeVilkår.perioder.length > 1;
  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={activeVilkår.perioder.map((currentPeriode, currentPeriodeIndex) => ({
                active: activeTab === currentPeriodeIndex,
                label: `${dateFormat(activeVilkår.perioder[currentPeriodeIndex].periode.fom)} - ${dateFormat(
                  activeVilkår.perioder[currentPeriodeIndex].periode.tom,
                )}`,
              }))}
              onClick={clickedIndex => {
                setActiveTab(clickedIndex);
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
              {lovReferanse && (
                <FlexColumn>
                  <EtikettLiten className={styles.vilkar}>{lovReferanse}</EtikettLiten>
                </FlexColumn>
              )}
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
