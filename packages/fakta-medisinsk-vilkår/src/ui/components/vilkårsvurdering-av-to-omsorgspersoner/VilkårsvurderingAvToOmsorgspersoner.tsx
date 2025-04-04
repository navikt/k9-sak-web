import { httpUtils, Period } from '@fpsak-frontend/utils';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigationWithDetailView/NavigationWithDetailView.js';
import { Box } from '@navikt/ds-react';
import { PageContainer } from '@navikt/ft-plattform-komponenter';
import React, { useMemo, type JSX } from 'react';
import Step, { StepId, toOmsorgspersonerSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { finnNesteStegForPleiepenger } from '../../../util/statusUtils';
import ContainerContext from '../../context/ContainerContext';
import Vurderingsdetaljer from '../vurderingsdetaljer/Vurderingsdetaljer';
import Vurderingsnavigasjon from '../vurderingsnavigasjon/Vurderingsnavigasjon';
import VurderingsoversiktMessages from '../vurderingsoversikt-messages/VurderingsoversiktMessages';
import ActionType from './actionTypes';
import vilkårsvurderingReducer from './reducer';

interface VilkårsvurderingAvToOmsorgspersonerProps {
  navigerTilNesteSteg: (steg: Step) => void;
  hentSykdomsstegStatus: () => Promise<SykdomsstegStatusResponse>;
  sykdomsstegStatus: SykdomsstegStatusResponse;
}

const VilkårsvurderingAvToOmsorgspersoner = ({
  navigerTilNesteSteg,
  hentSykdomsstegStatus,
  sykdomsstegStatus,
}: VilkårsvurderingAvToOmsorgspersonerProps): JSX.Element => {
  const { endpoints, onFinished, httpErrorHandler, readOnly } = React.useContext(ContainerContext);
  const controller = useMemo(() => new AbortController(), []);

  const [state, dispatch] = React.useReducer(vilkårsvurderingReducer, {
    visVurderingDetails: false,
    isLoading: true,
    vurderingsoversikt: null,
    valgtVurderingselement: null,
    vurderingsoversiktFeilet: false,
    skalViseRadForNyVurdering: false,
  });

  const {
    vurderingsoversikt,
    isLoading,
    visVurderingDetails,
    valgtVurderingselement,
    vurderingsoversiktFeilet,
    skalViseRadForNyVurdering,
  } = state;

  const { manglerGodkjentLegeerklæring } = sykdomsstegStatus;
  const harGyldigSignatur = !manglerGodkjentLegeerklæring;

  const getVurderingsoversikt = () =>
    httpUtils.get<Vurderingsoversikt>(endpoints.vurderingsoversiktBehovForToOmsorgspersoner, httpErrorHandler, {
      signal: controller.signal,
    });

  const visVurderingsoversikt = (nyVurderingsoversikt: Vurderingsoversikt) => {
    dispatch({ type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt: nyVurderingsoversikt });
  };

  const handleError = () => {
    dispatch({ type: ActionType.VURDERINGSOVERSIKT_FEILET });
  };

  const visNyVurderingForm = (resterendeVurderingsperioder?: Period[]) => {
    dispatch({ type: ActionType.VIS_NY_VURDERING_FORM, resterendeVurderingsperioder });
  };

  const onAvbryt = () => {
    dispatch({
      type: ActionType.AVBRYT_FORM,
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

  const velgVurderingselement = (nyvalgtVurderingselement: Vurderingselement) => {
    dispatch({ type: ActionType.VELG_VURDERINGSELEMENT, valgtVurderingselement: nyvalgtVurderingselement });
  };

  const oppdaterVurderingsoversikt = async () => {
    dispatch({ type: ActionType.PENDING });
    const vurderingsoversiktData = await getVurderingsoversikt();
    const nyVurderingsoversikt = new Vurderingsoversikt(vurderingsoversiktData);
    visVurderingsoversikt(nyVurderingsoversikt);
  };

  const onVurderingLagret = async () => {
    dispatch({ type: ActionType.PENDING });
    const status = await hentSykdomsstegStatus();
    if (status.kanLøseAksjonspunkt) {
      onFinished();
      return;
    }

    const nesteSteg = finnNesteStegForPleiepenger(status);
    if (nesteSteg === toOmsorgspersonerSteg || nesteSteg === null) {
      await oppdaterVurderingsoversikt();
    } else if (nesteSteg !== null) {
      navigerTilNesteSteg(nesteSteg);
    }
  };

  const setMargin = () => {
    if (vurderingsoversikt.harPerioderSomSkalVurderes() || !harGyldigSignatur) {
      return '4 0';
    }
    return undefined;
  };

  const skalViseValgfriePerioder = !readOnly && vurderingsoversikt?.resterendeValgfrieVurderingsperioder.length > 0;

  const skalViseOpprettVurderingKnapp =
    !vurderingsoversikt?.harPerioderSomSkalVurderes() && !skalViseRadForNyVurdering && harGyldigSignatur;

  const skalViseNyVurderingForm = visVurderingDetails && !valgtVurderingselement;

  return (
    <PageContainer hasError={vurderingsoversiktFeilet} isLoading={isLoading} key={StepId.ToOmsorgspersoner}>
      <VurderingsoversiktMessages vurderingsoversikt={vurderingsoversikt} harGyldigSignatur={harGyldigSignatur} />
      {vurderingsoversikt?.harPerioderÅVise() && (
        <Box marginBlock={setMargin()}>
          <NavigationWithDetailView
            navigationSection={() => {
              if (vurderingsoversikt.harPerioderÅVise()) {
                return (
                  <Vurderingsnavigasjon
                    vurderingselementer={vurderingsoversikt?.vurderingselementer}
                    resterendeVurderingsperioder={vurderingsoversikt?.resterendeVurderingsperioder}
                    onVurderingValgt={velgVurderingselement}
                    onNyVurderingClick={visNyVurderingForm}
                    visRadForNyVurdering={skalViseRadForNyVurdering}
                    visOpprettVurderingKnapp={skalViseOpprettVurderingKnapp}
                    resterendeValgfrieVurderingsperioder={
                      skalViseValgfriePerioder ? vurderingsoversikt?.resterendeValgfrieVurderingsperioder : []
                    }
                  />
                );
              }
              return null;
            }}
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

export default VilkårsvurderingAvToOmsorgspersoner;
