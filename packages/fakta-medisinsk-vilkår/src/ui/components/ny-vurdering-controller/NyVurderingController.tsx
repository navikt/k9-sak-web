import { httpUtils, Period } from '@fpsak-frontend/utils';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { assertDefined } from '@k9-sak-web/gui/utils/validation/assertDefined.js';
import { Box } from '@navikt/ds-react';
import { k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto } from '@navikt/k9-sak-typescript-client/types';
import React, { use, useMemo, type JSX } from 'react';
import { MedisinskVilkårApiContext } from '../../../api/MedisinskVilkårApiContext';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { PeriodeMedEndring } from '../../../types/PeriodeMedEndring';
import { Vurderingsversjon } from '../../../types/Vurdering';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import VurderingContext from '../../context/VurderingContext';
import LagreVurderingFeiletMelding from '../lagre-vurdering-feilet-melding/LagreVurderingFeiletMelding';
import OverlappendePeriodeModal from '../overlappende-periode-modal/OverlappendePeriodeModal';
import ActionType from './actionTypes';
import vurderingControllerReducer from './reducer';

interface NyVurderingControllerProps {
  opprettVurderingLink: Link;
  dataTilVurderingUrl: string;
  onVurderingLagret: () => void;
  formRenderer: (
    dokumenter: Dokument[],
    onSubmit: (vurderingsversjon: Vurderingsversjon) => void,
    isSubmitting: boolean,
  ) => React.ReactNode;
}

const NyVurderingController = ({
  opprettVurderingLink,
  dataTilVurderingUrl,
  onVurderingLagret,
  formRenderer,
}: NyVurderingControllerProps): JSX.Element => {
  const { httpErrorHandler, behandlingUuid } = React.useContext(ContainerContext);
  const { vurderingstype } = React.useContext(VurderingContext);
  const api = assertDefined(use(MedisinskVilkårApiContext));

  const [state, dispatch] = React.useReducer(vurderingControllerReducer, {
    sjekkForEksisterendeVurderingerPågår: false,
    lagringAvVurderingPågår: false,
    lagreVurderingHarFeilet: false,
    hentDataTilVurderingPågår: true,
    hentDataTilVurderingHarFeilet: false,
    dokumenter: [],
    perioderMedEndring: [],
    overlappendePeriodeModalOpen: false,
    vurderingsversjonTilLagringFraModal: null,
  });

  const {
    sjekkForEksisterendeVurderingerPågår,
    lagringAvVurderingPågår,
    lagreVurderingHarFeilet,
    hentDataTilVurderingPågår,
    hentDataTilVurderingHarFeilet,
    dokumenter,
    perioderMedEndring,
    overlappendePeriodeModalOpen,
    vurderingsversjonTilLagringFraModal,
  } = state;
  const controller = useMemo(() => new AbortController(), []);

  function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
    if (vurderingstype && opprettVurderingLink?.requestPayload?.behandlingUuid) {
      dispatch({ type: ActionType.LAGRING_AV_VURDERING_PÅBEGYNT });
      const vurderingsversjonMedType = { ...nyVurderingsversjon, type: vurderingstype };
      const { perioder, resultat, tekst, dokumenter, type, manglerLegeerklæring } = vurderingsversjonMedType;
      return api
        .opprettSykdomsVurdering({
          behandlingUuid,
          type,
          perioder,
          resultat,
          tekst,
          tilknyttedeDokumenter: (dokumenter ?? []).map(dokument => dokument.id),
          manglerLegeerklæring: !!manglerLegeerklæring,
        })
        .then(
          () => {
            onVurderingLagret();
            dispatch({ type: ActionType.VURDERING_LAGRET });
            scrollUp();
          },
          () => {
            dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
            scrollUp();
          },
        );
    } else {
      dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
    }
  }

  const sjekkForEksisterendeVurderinger = (
    nyVurderingsversjon: Vurderingsversjon,
  ): Promise<k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto> => {
    if (vurderingstype && opprettVurderingLink?.requestPayload?.behandlingUuid) {
      const vurderingsversjonMedType = { ...nyVurderingsversjon, type: vurderingstype };
      const { perioder, resultat, tekst, dokumenter, type, manglerLegeerklæring } = vurderingsversjonMedType;
      return api.opprettSykdomsVurdering({
        behandlingUuid,
        type,
        perioder,
        resultat,
        tekst,
        tilknyttedeDokumenter: (dokumenter ?? []).map(dokument => dokument.id),
        manglerLegeerklæring: !!manglerLegeerklæring,
        dryRun: true,
      });
    } else {
      dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
      return new Promise((_, reject) => reject(new Error('Ugyldig vurderingstype eller behandling UUID')));
    }
  };

  const advarOmEksisterendeVurderinger = (
    nyVurderingsversjon: Vurderingsversjon,
    perioderMedEndringValue: PeriodeMedEndring[],
  ) => {
    dispatch({
      type: ActionType.ADVAR_OM_EKSISTERENDE_VURDERINGER,
      perioderMedEndring: perioderMedEndringValue,
      vurderingsversjonTilLagringFraModal: nyVurderingsversjon,
    });
  };

  const initializePerioderMedEndringer = (
    perioderMedEndringResponse: k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto,
  ) =>
    perioderMedEndringResponse.perioderMedEndringer.map(
      ({ periode, endrerAnnenVurdering, endrerVurderingSammeBehandling }) => ({
        periode: new Period(periode?.fom ?? '', periode?.tom ?? ''),
        endrerAnnenVurdering: !!endrerAnnenVurdering,
        endrerVurderingSammeBehandling: !!endrerVurderingSammeBehandling,
      }),
    );

  const beOmBekreftelseFørLagringHvisNødvendig = async (nyVurderingsversjon: Vurderingsversjon) => {
    dispatch({ type: ActionType.SJEKK_FOR_EKSISTERENDE_VURDERINGER_PÅBEGYNT });
    try {
      const perioderMedEndringerResponse = await sjekkForEksisterendeVurderinger(nyVurderingsversjon);
      const perioderMedEndringer = initializePerioderMedEndringer(perioderMedEndringerResponse);
      const harOverlappendePerioder = perioderMedEndringer?.length > 0;
      if (harOverlappendePerioder) {
        advarOmEksisterendeVurderinger(nyVurderingsversjon, perioderMedEndringer);
      } else {
        await lagreVurdering(nyVurderingsversjon);
      }
    } catch {
      dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
    }
  };

  function hentDataTilVurdering(): Promise<Dokument[]> {
    if (!dataTilVurderingUrl) {
      return new Promise(resolve => {
        resolve([]);
      });
    }
    return httpUtils.get(dataTilVurderingUrl, httpErrorHandler, { signal: controller.signal });
  }

  const handleHentDataTilVurderingError = () => {
    dispatch({ type: ActionType.HENT_DATA_TIL_VURDERING_HAR_FEILET });
  };

  React.useEffect(() => {
    let isMounted = true;
    dispatch({ type: ActionType.HENT_DATA_TIL_VURDERING });
    hentDataTilVurdering()
      .then((dokumenterResponse: Dokument[]) => {
        if (isMounted) {
          dispatch({ type: ActionType.HENTET_DATA_TIL_VURDERING, dokumenter: dokumenterResponse });
        }
      })
      .catch(handleHentDataTilVurderingError);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const isSubmitting = lagringAvVurderingPågår || sjekkForEksisterendeVurderingerPågår;
  return (
    <PageContainer isLoading={hentDataTilVurderingPågår} hasError={hentDataTilVurderingHarFeilet} preventUnmount>
      {lagreVurderingHarFeilet && (
        <Box.New marginBlock="0 4">
          <LagreVurderingFeiletMelding />
        </Box.New>
      )}
      {formRenderer(dokumenter, beOmBekreftelseFørLagringHvisNødvendig, isSubmitting)}
      <OverlappendePeriodeModal
        perioderMedEndring={perioderMedEndring || []}
        onCancel={() => dispatch({ type: ActionType.LAGRING_AV_VURDERING_AVBRUTT })}
        onConfirm={async () => {
          await lagreVurdering(vurderingsversjonTilLagringFraModal ?? {});
          dispatch({ type: ActionType.VURDERING_LAGRET, perioderMedEndring });
        }}
        isOpen={overlappendePeriodeModalOpen}
        isSubmitting={lagringAvVurderingPågår}
      />
    </PageContainer>
  );
};

export default NyVurderingController;
