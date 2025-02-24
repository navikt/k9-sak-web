import { get, Period } from '@fpsak-frontend/utils';
import { Alert, Tabs } from '@navikt/ds-react';
import { ChildIcon, Infostripe, PageContainer, WarningIcon } from '@navikt/ft-plattform-komponenter';
import { VurderingDtoResultat } from '@navikt/k9-sak-typescript-client';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useMemo } from 'react';
import BeredskapType from '../types/BeredskapType';
import ContainerContract from '../types/ContainerContract';
import EtablertTilsynType from '../types/EtablertTilsynType';
import NattevåkType from '../types/NattevåkType';
import { InnleggelsesperiodeResponse, SykdomResponse, TilsynResponse } from '../types/TilsynResponse';
import Beredskapsperiodeoversikt from './components/beredskap/beredskapsperioderoversikt/Beredskapsperiodeoversikt';
import EtablertTilsynMedSmoring from './components/etablertTilsyn/EtablertTilsynMedSmoring';
import Nattevåksperiodeoversikt from './components/nattevåk/nattevåksperiodeoversikt/Nattevåksperiodeoversikt';
import ContainerContext from './context/ContainerContext';
import styles from './mainComponent.module.css';

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
      {showWarningIcon && <WarningIcon />}
    </div>
  );
};

const getDefaultActiveTab = ({ harAksjonspunktForBeredskap, harAksjonspunktForNattevåk }: ContainerContract) => {
  if (harAksjonspunktForBeredskap) {
    return tabs[1];
  }
  if (harAksjonspunktForNattevåk) {
    return tabs[2];
  }
  return tabs[0];
};

const transformEtablertTilsynResponse = (response: TilsynResponse) => {
  const etablertTilsyn = response.etablertTilsynPerioder.map(
    etablertTilsynPeriode => new EtablertTilsynType(etablertTilsynPeriode),
  );
  const beredskap = new BeredskapType(response.beredskap);
  const nattevåk = new NattevåkType(response.nattevåk);
  const smurtEtablertTilsynPerioder = response.smortEtablertTilsynPerioder.map(
    etablertTilsynPeriode => new EtablertTilsynType(etablertTilsynPeriode),
  );
  return {
    etablertTilsyn,
    beredskap,
    nattevåk,
    smurtEtablertTilsynPerioder,
  };
};

const transformSykdomResponse = (response: SykdomResponse) => {
  const resterendeVurderingsperioder = response?.resterendeVurderingsperioder?.map(v => new Period(v.fom, v.tom));
  const sykdomsperioderSomIkkeErOppfylt = response.vurderingselementer
    .filter(v => v.resultat !== VurderingDtoResultat.OPPFYLT)
    .map(v => new Period(v.periode.fom, v.periode.tom));
  return [...sykdomsperioderSomIkkeErOppfylt, ...resterendeVurderingsperioder];
};

const EtablertTilsynContainer = ({ data }: MainComponentProps) => {
  const { endpoints, httpErrorHandler, harAksjonspunktForBeredskap, harAksjonspunktForNattevåk } = data;

  const getTilsyn = (signal: AbortSignal) =>
    get<TilsynResponse>(endpoints.tilsyn, httpErrorHandler, {
      signal: signal,
    });
  const getSykdom = (signal: AbortSignal) =>
    get<SykdomResponse>(endpoints.sykdom, httpErrorHandler, {
      signal: signal,
    });
  const getInnleggelser = (signal: AbortSignal) =>
    get<InnleggelsesperiodeResponse>(endpoints.sykdomInnleggelse, httpErrorHandler, {
      signal: signal,
    });

  const {
    data: innleggelsesperioder = [],
    isError: innleggelserFeilet,
    isLoading: innleggelserLoading,
  } = useQuery({
    queryKey: ['innleggelsesperioder', endpoints.sykdomInnleggelse],
    queryFn: ({ signal }) =>
      getInnleggelser(signal).then(response => response.perioder.map(v => new Period(v.fom, v.tom))),
  });

  const {
    data: tilsyn,
    isError: tilsynHarFeilet,
    isLoading: tilsynLoading,
  } = useQuery({
    queryKey: ['etablertTilsyn', endpoints.tilsyn],
    queryFn: ({ signal }) => getTilsyn(signal),
    select: transformEtablertTilsynResponse,
  });

  const {
    data: sykdomsperioderSomIkkeErOppfylt = [],
    isError: sykdomHarFeilet,
    isLoading: sykdomIsLoading,
  } = useQuery({
    queryKey: ['sykdomsperioderIkkeOppfylt', endpoints.sykdom],
    queryFn: ({ signal }) => getSykdom(signal),
    select: transformSykdomResponse,
  });

  const { etablertTilsyn = [], smurtEtablertTilsynPerioder = [], beredskap, nattevåk } = tilsyn || {};
  const isLoading = tilsynLoading || innleggelserLoading || sykdomIsLoading;

  const perioderSomOverstyrerTilsyn = useMemo(() => {
    const bedredskapVurderinger = beredskap?.vurderinger || [];
    const nattevåkVurderinger = nattevåk?.vurderinger || [];
    return [
      ...bedredskapVurderinger
        .filter(v => v.resultat === VurderingDtoResultat.OPPFYLT)
        .map(v => new Period(v.periode.fom, v.periode.tom)),
      ...nattevåkVurderinger
        .filter(v => v.resultat === VurderingDtoResultat.OPPFYLT)
        .map(v => new Period(v.periode.fom, v.periode.tom)),
      ...innleggelsesperioder,
    ];
  }, [beredskap?.vurderinger, innleggelsesperioder, nattevåk?.vurderinger]);

  if (tilsynHarFeilet || sykdomHarFeilet || innleggelserFeilet) {
    return (
      <Alert size="small" variant="info">
        Noe gikk galt under henting av informasjon om etablert tilsyn. Dette kan skyldes at informasjon om etablert
        tilsyn ikke er tilgjengelig ennå, og at andre steg i behandlingen må fullføres før de kan vises her.
      </Alert>
    );
  }

  return (
    <ContainerContext.Provider value={data}>
      <Infostripe
        text="Etablert tilsyn og vurdering av beredskap og nattevåk gjelder barnet og er felles for alle parter."
        iconRenderer={() => <ChildIcon />}
      />
      <div className={styles.mainComponent}>
        <Tabs defaultValue={getDefaultActiveTab(data)}>
          <Tabs.List>
            {tabs.map((tabName, index) => (
              <Tabs.Tab
                key={tabName}
                value={tabName}
                label={
                  <TabItem
                    label={tabName}
                    showWarningIcon={
                      (index === 1 && harAksjonspunktForBeredskap) || (index === 2 && harAksjonspunktForNattevåk)
                    }
                  />
                }
              />
            ))}
          </Tabs.List>
          <PageContainer isLoading={isLoading}>
            <div className={styles.mainComponent__contentContainer}>
              <Tabs.Panel value={tabs[0]}>
                <EtablertTilsynMedSmoring
                  etablertTilsynData={etablertTilsyn}
                  smurtEtablertTilsynPerioder={smurtEtablertTilsynPerioder}
                  sykdomsperioderSomIkkeErOppfylt={sykdomsperioderSomIkkeErOppfylt}
                  perioderSomOverstyrerTilsyn={perioderSomOverstyrerTilsyn}
                />
              </Tabs.Panel>
              <Tabs.Panel value={tabs[1]}>
                {beredskap && <Beredskapsperiodeoversikt beredskapData={beredskap} />}
              </Tabs.Panel>
              <Tabs.Panel value={tabs[2]}>
                {nattevåk && <Nattevåksperiodeoversikt nattevåkData={nattevåk} />}
              </Tabs.Panel>
            </div>
          </PageContainer>
        </Tabs>
      </div>
    </ContainerContext.Provider>
  );
};

export default EtablertTilsynContainer;
