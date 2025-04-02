import { httpUtils, Period } from '@fpsak-frontend/utils';
import { Box, PageContainer } from '@navikt/ft-plattform-komponenter';
import React, { useMemo, type JSX } from 'react';
import { postEndreVurdering, postEndreVurderingDryRun } from '../../../api/api';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { PeriodeMedEndring, PerioderMedEndringResponse } from '../../../types/PeriodeMedEndring';
import { Vurderingsversjon } from '../../../types/Vurdering';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import LagreVurderingFeiletMelding from '../lagre-vurdering-feilet-melding/LagreVurderingFeiletMelding';
import OverlappendePeriodeModal from '../overlappende-periode-modal/OverlappendePeriodeModal';
import ActionType from './actionTypes';
import vurderingControllerReducer from './reducer';

interface EndreVurderingControllerProps {
  endreVurderingLink: Link;
  dataTilVurderingUrl: string;
  onVurderingLagret: () => void;
  formRenderer: (
    dokumenter: Dokument[],
    onSubmit: (vurderingsversjon: Vurderingsversjon) => void,
    isSubmitting: boolean,
  ) => React.ReactNode;
  vurderingsid: string;
  vurderingsversjonId: string;
}

const EndreVurderingController = ({
  endreVurderingLink,
  dataTilVurderingUrl,
  onVurderingLagret,
  formRenderer,
  vurderingsid,
  vurderingsversjonId,
}: EndreVurderingControllerProps): JSX.Element => {
  const { httpErrorHandler } = React.useContext(ContainerContext);

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

  function endreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
    dispatch({ type: ActionType.LAGRING_AV_VURDERING_PÅBEGYNT });
    return postEndreVurdering(
      endreVurderingLink.href,
      endreVurderingLink.requestPayload.behandlingUuid,
      vurderingsid,
      nyVurderingsversjon,
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
  }

  const sjekkForEksisterendeVurderinger = (
    nyVurderingsversjon: Vurderingsversjon,
  ): Promise<PerioderMedEndringResponse> =>
    postEndreVurderingDryRun(
      endreVurderingLink.href,
      endreVurderingLink.requestPayload.behandlingUuid,
      vurderingsid,
      nyVurderingsversjon,
      httpErrorHandler,
      controller.signal,
    );

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
    const nyVurderingsversjonMedVersjonId = { ...nyVurderingsversjon, versjon: vurderingsversjonId };
    try {
      const perioderMedEndringerResponse = await sjekkForEksisterendeVurderinger(nyVurderingsversjonMedVersjonId);
      const perioderMedEndringer = initializePerioderMedEndringer(perioderMedEndringerResponse);
      const harOverlappendePerioder = perioderMedEndringer?.length > 0;
      if (harOverlappendePerioder) {
        advarOmEksisterendeVurderinger(nyVurderingsversjonMedVersjonId, perioderMedEndringer);
      } else {
        await endreVurdering(nyVurderingsversjonMedVersjonId);
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
        <Box marginBlock="0 4">
          <LagreVurderingFeiletMelding />
        </Box>
      )}
      {formRenderer(dokumenter, beOmBekreftelseFørLagringHvisNødvendig, isSubmitting)}
      {lagreVurderingHarFeilet && (
        <Box marginBlock="4 0">
          <LagreVurderingFeiletMelding />
        </Box>
      )}
      <OverlappendePeriodeModal
        perioderMedEndring={perioderMedEndring || []}
        onCancel={() => dispatch({ type: ActionType.LAGRING_AV_VURDERING_AVBRUTT })}
        onConfirm={async () => {
          await endreVurdering(vurderingsversjonTilLagringFraModal ?? {});
          dispatch({ type: ActionType.VURDERING_LAGRET, perioderMedEndring });
        }}
        isOpen={overlappendePeriodeModalOpen}
        isSubmitting={lagringAvVurderingPågår}
      />
    </PageContainer>
  );
};

export default EndreVurderingController;
