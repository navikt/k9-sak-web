import { get, Period } from '@k9-sak-web/utils';
import { Box, Margin, NavigationWithDetailView, PageContainer } from '@navikt/ft-plattform-komponenter';
import React, { useMemo } from 'react';
import Step, { langvarigSykdomSteg, StepId } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { finnNesteStegForOpplæringspenger } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Vurderingsdetaljer from '../vurderingsdetaljer/Vurderingsdetaljer';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';

import BehandlingType from '../../../constants/BehandlingType';
import FagsakYtelseType from '../../../constants/FagsakYtelseType';
import VurderingsoversiktLangvarigSykdomMessages from '../vurderingsoversikt-langvarig-sykdom-messages/VurderingsoversiktLangvarigSykdomMessages';

interface VilkårsvurderingLangvarigSykdomProps {
  navigerTilNesteSteg: (steg: Step, ikkeMarkerSteg?: boolean) => void;
  hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
  sykdomsstegStatus: SykdomsstegStatusResponse;
}

const VilkårsvurderingLangvarigSykdom = ({
  navigerTilNesteSteg,
  hentSykdomsstegStatus,
  sykdomsstegStatus,
}: VilkårsvurderingLangvarigSykdomProps): JSX.Element => {
  const { endpoints, httpErrorHandler, fagsakYtelseType, behandlingType } = React.useContext(ContainerContext);
  const controller = useMemo(() => new AbortController(), []);

  const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
    visVurderingDetails: false,
    isLoading: true,
    vurderingsoversikt: null,
    valgtVurderingselement: null,
    skalViseRadForNyVurdering: false,
    vurderingsoversiktFeilet: false,
  });

  const {
    vurderingsoversikt,
    isLoading,
    visVurderingDetails,
    valgtVurderingselement,
    skalViseRadForNyVurdering,
    vurderingsoversiktFeilet,
  } = state;

  const { manglerGodkjentLegeerklæring } = sykdomsstegStatus;
  const harGyldigSignatur = !manglerGodkjentLegeerklæring;

  const getVurderingsoversikt = () =>
    get<Vurderingsoversikt>(endpoints.vurderingsoversiktLangvarigSykdom, httpErrorHandler, {
      signal: controller.signal,
    });

  const visVurderingsoversikt = (nyVurderingsoversikt: Vurderingsoversikt) => {
    dispatch({ type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt: nyVurderingsoversikt });
  };

  const handleError = () => {
    dispatch({ type: ActionType.VURDERINGSOVERSIKT_FEILET });
  };

  const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
    dispatch({
      type: ActionType.VIS_NY_VURDERING_FORM,
      resterendeVurderingsperioder,
    });
  };

  const åpneFørstePeriodeSomMåBehandles = (nyVurderingsoversikt: Vurderingsoversikt) => {
    const harEnPeriodeSomMåBehandles = nyVurderingsoversikt?.resterendeVurderingsperioder?.length > 0;
    if (harEnPeriodeSomMåBehandles) {
      visNyVurderingForm(nyVurderingsoversikt.resterendeVurderingsperioder);
    }
  };

  React.useEffect(() => {
    let isMounted = true;
    getVurderingsoversikt()
      .then(vurderingsoversiktData => {
        if (isMounted) {
          const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
          visVurderingsoversikt(nyVurderingsoversikt);
          åpneFørstePeriodeSomMåBehandles(nyVurderingsoversikt);
        }
      })
      .catch(handleError);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const velgVurderingselement = (nyValgtVurderingselement: Vurderingselement) => {
    dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyValgtVurderingselement });
  };

  const oppdaterVurderingsoversikt = () => {
    dispatch({ type: ActionType.PENDING });
    getVurderingsoversikt().then(vurderingsoversiktData => {
      const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
      visVurderingsoversikt(nyVurderingsoversikt);
    });
  };

  const onAvbryt = () => {
    dispatch({
      type: ActionType.AVBRYT_FORM,
    });
  };

  const onVurderingLagret = () => {
    dispatch({ type: ActionType.PENDING });
    hentSykdomsstegStatus()
      .then(status => {
        const nesteSteg = finnNesteStegForOpplæringspenger(status);
        if (nesteSteg === langvarigSykdomSteg || nesteSteg === null) {
          oppdaterVurderingsoversikt();
        } else if (nesteSteg !== null) {
          navigerTilNesteSteg(nesteSteg);
        }
      })
      .catch(handleError);
  };

  const setMargin = () => {
    if (vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur) {
      return Margin.medium;
    }
    return null;
  };

  const skalViseOpprettVurderingKnapp = () => {
    if (fagsakYtelseType === FagsakYtelseType.OPPLÆRINGSPENGER && BehandlingType.FORSTEGANGSSOKNAD === behandlingType)
      return false;

    return !vurderingsoversikt?.harPerioderSomSkalVurderes() &&
      !skalViseRadForNyVurdering &&
      harGyldigSignatur &&
      fagsakYtelseType === FagsakYtelseType.OPPLÆRINGSPENGER
      ? behandlingType !== BehandlingType.FORSTEGANGSSOKNAD
      : true;
  };

  const skalViseNyVurderingForm = visVurderingDetails && !valgtVurderingselement;

  return (
    <PageContainer isLoading={isLoading} hasError={vurderingsoversiktFeilet} key={StepId.LangvarigSykdom}>
      <VurderingsoversiktLangvarigSykdomMessages vurderingsoversikt={vurderingsoversikt} />
      {vurderingsoversikt?.harPerioderÅVise() && (
        <Box marginTop={setMargin()}>
          <NavigationWithDetailView
            navigationSection={() => (
              <Vurderingsnavigasjon
                vurderingselementer={vurderingsoversikt?.vurderingselementer}
                resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                onVurderingValgt={velgVurderingselement}
                onNyVurderingClick={visNyVurderingForm}
                visRadForNyVurdering={skalViseRadForNyVurdering}
                visParterLabel
                visOpprettVurderingKnapp={skalViseOpprettVurderingKnapp()}
              />
            )}
            showDetailSection={visVurderingDetails}
            detailSection={() => (
              <Vurderingsdetaljer
                vurderingsoversikt={vurderingsoversikt}
                valgtVurderingselement={valgtVurderingselement}
                radForNyVurderingVises={skalViseRadForNyVurdering}
                nyVurderingFormVises={skalViseNyVurderingForm}
                onVurderingLagret={onVurderingLagret}
                onAvbryt={onAvbryt}
              />
            )}
          />
        </Box>
      )}
    </PageContainer>
  );
};

export default VilkårsvurderingLangvarigSykdom;
