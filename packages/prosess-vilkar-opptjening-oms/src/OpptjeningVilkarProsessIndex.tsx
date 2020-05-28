import { Aksjonspunkt, Opptjening, OpptjeningBehandling, SubmitCallback } from '@k9-sak-web/types';
import SideMenu from '@navikt/nap-side-menu';
import classNames from 'classnames/bind';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import OpptjeningVilkarForm from './components/OpptjeningVilkarForm';
import styles from './opptjeningVilkarProsessIndex.less';

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OpptjeningVilkarProsessIndexProps {
  behandling: OpptjeningBehandling;
  opptjening: { opptjeninger: Opptjening[] };
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  lovReferanse?: string;
  submitCallback: (props: SubmitCallback[]) => void;
  isReadOnly: boolean;
  isAksjonspunktOpen: boolean;
  readOnlySubmitButton: boolean;
}

const OpptjeningVilkarProsessIndex = ({
  behandling,
  opptjening,
  aksjonspunkter,
  status,
  lovReferanse,
  submitCallback,
  isReadOnly,
  isAksjonspunktOpen,
  readOnlySubmitButton,
}: OpptjeningVilkarProsessIndexProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const activeOpptjeningObject = opptjening.opptjeninger[activeTab];
  const { behandlingsresultat } = behandling;
  const vilkårsresultat = behandlingsresultat?.vilkårResultat?.OPPTJENINGSVILKÅRET;
  const skalBrukeSidemeny = opptjening.opptjeninger.length > 1;

  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={opptjening.opptjeninger.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
                active: activeTab === currentBeregningsgrunnlagIndex,
                label: `Beregningsgrunnlag ${currentBeregningsgrunnlagIndex + 1}`,
              }))}
              onClick={clickedIndex => {
                setActiveTab(clickedIndex);
              }}
              theme="arrow"
            />
          </div>
        )}
        <div className={styles.contentContainer}>
          <OpptjeningVilkarForm
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            vilkårsresultat={vilkårsresultat ? vilkårsresultat[activeTab] : null}
            fastsattOpptjening={activeOpptjeningObject.fastsattOpptjening}
            status={status}
            lovReferanse={lovReferanse}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            readOnly={isReadOnly}
            isAksjonspunktOpen={isAksjonspunktOpen}
            readOnlySubmitButton={readOnlySubmitButton}
            vilkårIndex={activeTab}
            opptjeninger={opptjening.opptjeninger}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default OpptjeningVilkarProsessIndex;
