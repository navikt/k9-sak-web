import { httpUtils, Period } from '@fpsak-frontend/utils';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { Box } from '@navikt/ds-react';
import React, { useMemo, type JSX } from 'react';
import { postNyVurdering, postNyVurderingDryRun } from '../../../api/api';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { PeriodeMedEndring, PerioderMedEndringResponse } from '../../../types/PeriodeMedEndring';
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
  const { httpErrorHandler } = React.useContext(ContainerContext);
  const { vurderingstype } = React.useContext(VurderingContext);

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
      return postNyVurdering(
        opprettVurderingLink.href,
        opprettVurderingLink.requestPayload.behandlingUuid,
        { ...nyVurderingsversjon, type: vurderingstype },
        httpErrorHandler,
        controller.signal,
      ).then(
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
  ): Promise<PerioderMedEndringResponse> => {
    if (vurderingstype && opprettVurderingLink?.requestPayload?.behandlingUuid) {
      return postNyVurderingDryRun(
        opprettVurderingLink.href,
        opprettVurderingLink.requestPayload.behandlingUuid,
        { ...nyVurderingsversjon, type: vurderingstype },
        httpErrorHandler,
        controller.signal,
      );
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

  const initializePerioderMedEndringer = (perioderMedEndringResponse: PerioderMedEndringResponse) =>
    perioderMedEndringResponse.perioderMedEndringer.map(({ periode: { fom, tom }, ...otherFields }) => ({
      periode: new Period(fom, tom),
      ...otherFields,
    }));

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
