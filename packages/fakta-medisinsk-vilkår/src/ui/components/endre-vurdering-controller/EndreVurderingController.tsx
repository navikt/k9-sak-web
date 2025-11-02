import { httpUtils, Period } from '@fpsak-frontend/utils';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { assertDefined } from '@k9-sak-web/gui/utils/validation/assertDefined.js';
import { Box } from '@navikt/ds-react';
import { k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto } from '@navikt/k9-sak-typescript-client/types';
import React, { use, useMemo, type JSX } from 'react';
import { MedisinskVilkårApiContext } from '../../../api/MedisinskVilkårApiContext';
import Dokument from '../../../types/Dokument';
import { PeriodeMedEndring } from '../../../types/PeriodeMedEndring';
import { Vurderingsversjon } from '../../../types/Vurdering';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import LagreVurderingFeiletMelding from '../lagre-vurdering-feilet-melding/LagreVurderingFeiletMelding';
import OverlappendePeriodeModal from '../overlappende-periode-modal/OverlappendePeriodeModal';
import ActionType from './actionTypes';
import vurderingControllerReducer from './reducer';

interface EndreVurderingControllerProps {
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
  dataTilVurderingUrl,
  onVurderingLagret,
  formRenderer,
  vurderingsid,
  vurderingsversjonId,
}: EndreVurderingControllerProps): JSX.Element => {
  const { httpErrorHandler, behandlingUuid } = React.useContext(ContainerContext);
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

  function endreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
    dispatch({ type: ActionType.LAGRING_AV_VURDERING_PÅBEGYNT });
    api
      .oppdaterSykdomsVurdering({
        behandlingUuid,
        id: vurderingsid,
        versjon: nyVurderingsversjon.versjon ?? '',
        tekst: nyVurderingsversjon.tekst,
        resultat: nyVurderingsversjon.resultat,
        perioder: nyVurderingsversjon.perioder ?? [],
        tilknyttedeDokumenter: nyVurderingsversjon.dokumenter?.map(dokument => dokument.id) || [],
        manglerLegeerklæring: !!nyVurderingsversjon.manglerLegeerklæring,
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
  }

  const sjekkForEksisterendeVurderinger = (
    nyVurderingsversjon: Vurderingsversjon,
  ): Promise<k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto> =>
    api.oppdaterSykdomsVurdering({
      behandlingUuid,
      id: vurderingsid,
      versjon: nyVurderingsversjon.versjon ?? '',
      tekst: nyVurderingsversjon.tekst,
      resultat: nyVurderingsversjon.resultat,
      perioder: nyVurderingsversjon.perioder ?? [],
      tilknyttedeDokumenter: nyVurderingsversjon.dokumenter?.map(dokument => dokument.id) || [],
      manglerLegeerklæring: !!nyVurderingsversjon.manglerLegeerklæring,
      dryRun: true,
    });

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
        <Box.New marginBlock="0 4">
          <LagreVurderingFeiletMelding />
        </Box.New>
      )}
      {formRenderer(dokumenter, beOmBekreftelseFørLagringHvisNødvendig, isSubmitting)}
      {lagreVurderingHarFeilet && (
        <Box.New marginBlock="4 0">
          <LagreVurderingFeiletMelding />
        </Box.New>
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
