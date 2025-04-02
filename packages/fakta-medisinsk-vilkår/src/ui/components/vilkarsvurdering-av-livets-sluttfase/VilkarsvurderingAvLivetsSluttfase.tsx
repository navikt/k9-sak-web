import { get, Period } from '@fpsak-frontend/utils';
import { PageContainer } from '@navikt/ft-plattform-komponenter';
import React, { useMemo, type JSX } from 'react';
import Step, { livetsSluttfaseSteg, StepId } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { finnNesteStegForLivetsSluttfase } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Vurderingsdetaljer from '../vurderingsdetaljer/Vurderingsdetaljer';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigationWithDetailView/NavigationWithDetailView.js';
import { Box } from '@navikt/ds-react';
import BehandlingType from '../../../constants/BehandlingType';
import VurderingsoversiktSluttfaseMessages from '../vurderingsoversikt-sluttfase-messages/VurderingsoversiktSluttfaseMessages';

interface VilkårsvurderingAvLivetsSluttfaseProps {
  navigerTilNesteSteg: (steg: Step, ikkeMarkerSteg?: boolean) => void;
  hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
  sykdomsstegStatus: SykdomsstegStatusResponse;
}

const VilkårsvurderingAvLivetsSluttfase = ({
  navigerTilNesteSteg,
  hentSykdomsstegStatus,
  sykdomsstegStatus,
}: VilkårsvurderingAvLivetsSluttfaseProps): JSX.Element => {
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
    get<Vurderingsoversikt>(endpoints.vurderingsoversiktLivetsSluttfase, httpErrorHandler, {
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

  const oppdaterVurderingsoversikt = async () => {
    dispatch({ type: ActionType.PENDING });
    const vurderingsoversiktData = await getVurderingsoversikt();
    const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
    visVurderingsoversikt(nyVurderingsoversikt);
  };

  const onAvbryt = () => {
    dispatch({
      type: ActionType.AVBRYT_FORM,
    });
  };

  const onVurderingLagret = async () => {
    dispatch({ type: ActionType.PENDING });
    try {
      const status = await hentSykdomsstegStatus();
      const nesteSteg = finnNesteStegForLivetsSluttfase(status);
      if (nesteSteg === livetsSluttfaseSteg || nesteSteg === null) {
        await oppdaterVurderingsoversikt();
      } else if (nesteSteg !== null) {
        navigerTilNesteSteg(nesteSteg);
      }
    } catch {
      handleError();
    }
  };

  const setMargin = () => {
    if (vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur) {
      return '4 0';
    }
    return undefined;
  };

  const skalViseOpprettVurderingKnapp = () => {
    if (
      fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE &&
      BehandlingType.FORSTEGANGSSOKNAD === behandlingType
    )
      return false;

    return !vurderingsoversikt?.harPerioderSomSkalVurderes() &&
      !skalViseRadForNyVurdering &&
      harGyldigSignatur &&
      fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE
      ? behandlingType !== BehandlingType.FORSTEGANGSSOKNAD
      : true;
  };

  const skalViseNyVurderingForm = visVurderingDetails && !valgtVurderingselement;

  return (
    <PageContainer isLoading={isLoading} hasError={vurderingsoversiktFeilet} key={StepId.LivetsSluttfase}>
      <VurderingsoversiktSluttfaseMessages
        vurderingsoversikt={vurderingsoversikt}
        harGyldigSignatur={harGyldigSignatur}
      />
      {vurderingsoversikt?.harPerioderÅVise() && (
        <Box marginBlock={setMargin()}>
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

export default VilkårsvurderingAvLivetsSluttfase;
