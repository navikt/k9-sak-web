import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Button } from '@navikt/ds-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useLangvarigSykVurderingerFagsak, useVurdertLangvarigSykdom } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import SykdomUperiodisertContainer from './SykdomUperiodisertContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { Period } from '@navikt/ft-utils';
import NavigasjonsmenyRad from './NavigasjonsmenyRad';
import { utledResultat } from './utils';
import { utledGodkjent } from './utils';
import { type k9_sak_kontrakt_opplæringspenger_langvarigsykdom_LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { CenteredLoader } from '../CenteredLoader';
import type { UperiodisertSykdom } from './SykdomUperiodisertForm';
import SykdomUperiodisertAlert from './SykdomUperiodisertAlert';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { finnAksjonspunkt } from '../../../utils/aksjonspunktUtils.js';

export const SykdomUperiodisertContext = createContext<{
  setNyVurdering: (nyVurdering: boolean) => void;
}>({
  setNyVurdering: () => {},
});

interface SykdomVurderingselement
  extends Vurderingselement,
    k9_sak_kontrakt_opplæringspenger_langvarigsykdom_LangvarigSykdomVurderingDto {
  id: string;
}

const defaultVurdering = {
  diagnosekoder: [],
  begrunnelse: '',
  godkjent: '',
} as UperiodisertSykdom;

const SykdomUperiodisertIndex = () => {
  const { behandlingUuid, readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const aksjonspunkt9301 = finnAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_LANGVARIG_SYK);

  const { data: langvarigSykVurderinger, isLoading: isLoadingLangvarigSykVurderinger } =
    useLangvarigSykVurderingerFagsak(behandlingUuid);
  const { data: vurderingBruktIAksjonspunkt, isLoading: isLoadingVurderingBruktIAksjonspunkt } =
    useVurdertLangvarigSykdom(behandlingUuid);

  const [valgtPeriode, setValgtPeriode] = useState<SykdomVurderingselement | null>(null);
  const [nyVurdering, setNyVurdering] = useState<boolean>(false);

  useEffect(() => {
    if (langvarigSykVurderinger?.length === 0) {
      setNyVurdering(true);
    }
  }, [langvarigSykVurderinger]);

  const mappedVurderinger = langvarigSykVurderinger?.map(element => ({
    ...element,
    godkjent: utledGodkjent(element),
  }));
  const vurderingsliste = langvarigSykVurderinger?.map(element => ({
    ...element,
    perioder: element.vurdertTidspunkt ? [new Period(element.vurdertTidspunkt, element.vurdertTidspunkt)] : [],
    id: element.uuid,
    resultat: utledResultat(element),
  }));

  const velgPeriode = (periode: SykdomVurderingselement | null) => {
    setValgtPeriode(periode);
    setNyVurdering(false);
  };

  const handleNyVurdering = () => {
    setNyVurdering(true);
    setValgtPeriode(null);
  };

  const valgtVurdering = mappedVurderinger?.find(vurdering => vurdering.uuid === valgtPeriode?.id);

  if (isLoadingLangvarigSykVurderinger || isLoadingVurderingBruktIAksjonspunkt) {
    return <CenteredLoader />;
  }
  return (
    <>
      <SykdomUperiodisertContext.Provider value={{ setNyVurdering }}>
        <SykdomUperiodisertAlert
          vurderinger={langvarigSykVurderinger}
          vurderingBruktIAksjonspunkt={vurderingBruktIAksjonspunkt}
        />
        <NavigationWithDetailView
          navigationSection={() => (
            <Vurderingsnavigasjon<SykdomVurderingselement>
              title="Alle vurderinger"
              valgtPeriode={valgtPeriode}
              perioder={vurderingsliste || []}
              onPeriodeClick={velgPeriode}
              customLabelRow={
                <CustomLabelRow harAnnenPart={vurderingsliste?.some(vurdering => vurdering.vurderingFraAnnenpart)} />
              }
              customPeriodeRad={(periode, onPeriodeClick) => (
                <NavigasjonsmenyRad
                  periode={periode}
                  active={periode.id === valgtPeriode?.id}
                  erBruktIAksjonspunkt={periode.id === vurderingBruktIAksjonspunkt?.vurderingUuid}
                  erFraAnnenPart={periode.vurderingFraAnnenpart}
                  onClick={() => onPeriodeClick(periode)}
                />
              )}
            />
          )}
          showDetailSection
          belowNavigationContent={
            !readOnly &&
            !!aksjonspunkt9301 && (
              <Button variant="tertiary" icon={<PlusIcon />} onClick={handleNyVurdering}>
                Legg til ny sykdomsvurdering
              </Button>
            )
          }
          detailSection={() => {
            if (nyVurdering) {
              return <SykdomUperiodisertContainer vurdering={defaultVurdering} />;
            }
            if (valgtVurdering) {
              return <SykdomUperiodisertContainer vurdering={valgtVurdering} />;
            }
            return null;
          }}
        />
      </SykdomUperiodisertContext.Provider>
    </>
  );
};

const CustomLabelRow = ({ harAnnenPart }: { harAnnenPart?: boolean }) => {
  return (
    <div className="flex items-center w-full">
      <div className="ml-6 min-w-[50px]">Status</div>
      <div className="ml-2">Periode</div>
      {harAnnenPart && <div className="ml-14">Annen part</div>}
    </div>
  );
};

export default SykdomUperiodisertIndex;
