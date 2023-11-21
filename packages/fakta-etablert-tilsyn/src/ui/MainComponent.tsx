import { get } from '@navikt/k9-fe-http-utils';
import { ChildIcon, Infostripe, PageContainer, WarningIcon } from '@navikt/ft-plattform-komponenter';
import classnames from 'classnames';
import { TabsPure } from 'nav-frontend-tabs';
import React, { useMemo } from 'react';
import { Period } from '@navikt/k9-fe-period-utils';
import ContainerContract from '../types/ContainerContract';
import { InnleggelsesperiodeResponse, SykdomResponse, TilsynResponse } from '../types/TilsynResponse';
import Alertstripe from './components/alertstripe/Alertstripe';
import Beredskapsperiodeoversikt from './components/beredskap/beredskapsperioderoversikt/Beredskapsperiodeoversikt';
import EtablertTilsyn from './components/etablertTilsyn/EtablertTilsynMedSmoring';
import Nattevåksperiodeoversikt from './components/nattevåk/nattevåksperiodeoversikt/Nattevåksperiodeoversikt';
import ContainerContext from './context/ContainerContext';
import ActionType from './mainActionTypes';
import styles from './mainComponent.css';
import mainComponentReducer from './mainReducer';

interface MainComponentProps {
  data: ContainerContract;
}

const tabs = ['Etablert tilsyn', 'Beredskap', 'Nattevåk'];

interface TabItemProps {
  label: string;
  showWarningIcon: boolean;
}

const TabItem = ({ label, showWarningIcon }: TabItemProps) => {
  const cls = classnames(styles.tabItem, {
    [styles.tabItemExtended]: showWarningIcon,
  });
  return (
    <div className={cls}>
      {label}
      {showWarningIcon && (
        <div className={styles.tabItem__warningIcon}>
          <WarningIcon />
        </div>
      )}
    </div>
  );
};

const setDefaultActiveTabIndex = ({ harAksjonspunktForBeredskap, harAksjonspunktForNattevåk }: ContainerContract) => {
  if (harAksjonspunktForBeredskap) {
    return 1;
  }
  if (harAksjonspunktForNattevåk) {
    return 2;
  }
  return 0;
};

const MainComponent = ({ data }: MainComponentProps) => {
  const [state, dispatch] = React.useReducer(mainComponentReducer, {
    isLoading: true,
    etablertTilsyn: null,
    beredskap: null,
    nattevåk: null,
    sykdomsperioderSomIkkeErOppfylt: [],
  });
  const {
    isLoading,
    etablertTilsyn,
    smurtEtablertTilsynPerioder,
    beredskap,
    nattevåk,
    sykdomsperioderSomIkkeErOppfylt,
    tilsynHarFeilet,
    sykdomHarFeilet,
  } = state;
  const { endpoints, httpErrorHandler, harAksjonspunktForBeredskap, harAksjonspunktForNattevåk } = data;
  const [activeTab, setActiveTab] = React.useState(setDefaultActiveTabIndex(data));
  const [innleggelsesperioder, setInnleggelsesperioder] = React.useState<Period[]>([]);
  const [innleggelserFeilet, setInnleggelserFeilet] = React.useState(false);
  const controller = useMemo(() => new AbortController(), []);
  const getTilsyn = () =>
    get<TilsynResponse>(endpoints.tilsyn, httpErrorHandler, {
      signal: controller.signal,
    });
  const getSykdom = () =>
    get<SykdomResponse>(endpoints.sykdom, httpErrorHandler, {
      signal: controller.signal,
    });
  const getInnleggelser = () =>
    get<InnleggelsesperiodeResponse>(endpoints.sykdomInnleggelse, httpErrorHandler, {
      signal: controller.signal,
    });

  React.useEffect(() => {
    let isMounted = true;
    getTilsyn()
      .then(tilsynResponse => {
        if (isMounted) {
          dispatch({ type: ActionType.OK, tilsynResponse });
        }
      })
      .catch(() => {
        dispatch({ type: ActionType.FAILED });
      });
    getSykdom()
      .then(sykdomResponse => {
        if (isMounted) {
          dispatch({ type: ActionType.SYKDOM_OK, sykdomResponse });
        }
      })
      .catch(() => {
        dispatch({ type: ActionType.SYKDOM_FAILED });
      });

    getInnleggelser()
      .then(innleggelserResponse => {
        if (isMounted) {
          setInnleggelsesperioder(innleggelserResponse.perioder.map(v => new Period(v.fom, v.tom)));
        }
      })
      .catch(() => {
        setInnleggelserFeilet(true);
      });
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const bedredskapVurderinger = beredskap?.vurderinger || [];
  const nattevåkVurderinger = nattevåk?.vurderinger || [];
  const perioderSomOverstyrerTilsyn = [
    ...bedredskapVurderinger.filter(v => v.resultat === 'OPPFYLT').map(v => new Period(v.periode.fom, v.periode.tom)),
    ...nattevåkVurderinger.filter(v => v.resultat === 'OPPFYLT').map(v => new Period(v.periode.fom, v.periode.tom)),
    ...innleggelsesperioder,
  ];

  if (tilsynHarFeilet || sykdomHarFeilet || innleggelserFeilet) {
    return (
      <Alertstripe type="info">
        Noe gikk galt under henting av informasjon om etablert tilsyn. Dette kan skyldes at informasjon om etablert
        tilsyn ikke er tilgjengelig ennå, og at andre steg i behandlingen må fullføres før de kan vises her.
      </Alertstripe>
    );
  }

  return (
    <ContainerContext.Provider value={data}>
      <Infostripe
        text="Etablert tilsyn og vurdering av beredskap og nattevåk gjelder barnet og er felles for alle parter."
        iconRenderer={() => <ChildIcon />}
      />
      <div className={styles.mainComponent}>
        <TabsPure
          kompakt
          tabs={tabs.map((tabName, index) => ({
            label: (
              <TabItem
                label={tabName}
                showWarningIcon={
                  (index === 1 && harAksjonspunktForBeredskap) || (index === 2 && harAksjonspunktForNattevåk)
                }
              />
            ),
            aktiv: activeTab === index,
          }))}
          onChange={(event, clickedIndex) => setActiveTab(clickedIndex)}
        />
        <PageContainer isLoading={isLoading}>
          <div className={styles.mainComponent__contentContainer}>
            {activeTab === 0 && (
              <EtablertTilsyn
                etablertTilsynData={etablertTilsyn}
                smurtEtablertTilsynPerioder={smurtEtablertTilsynPerioder}
                sykdomsperioderSomIkkeErOppfylt={sykdomsperioderSomIkkeErOppfylt}
                perioderSomOverstyrerTilsyn={perioderSomOverstyrerTilsyn}
              />
            )}
            {activeTab === 1 && <Beredskapsperiodeoversikt beredskapData={beredskap} />}
            {activeTab === 2 && <Nattevåksperiodeoversikt nattevåkData={nattevåk} />}
          </div>
        </PageContainer>
      </div>
    </ContainerContext.Provider>
  );
};

export default MainComponent;
